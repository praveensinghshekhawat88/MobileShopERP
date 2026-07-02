package com.mobileshoperp.modules.utility.service;

import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.purchase.entity.Purchase;
import com.mobileshoperp.modules.purchase.repository.PurchaseRepository;
import com.mobileshoperp.modules.purchase.service.PurchaseService;
import com.mobileshoperp.modules.sales.entity.Sale;
import com.mobileshoperp.modules.sales.repository.SaleRepository;
import com.mobileshoperp.modules.sales.service.SaleService;
import com.mobileshoperp.modules.utility.dto.PaymentBalanceResponse;
import com.mobileshoperp.modules.utility.dto.PaymentResponse;
import com.mobileshoperp.modules.utility.dto.RecordPaymentRequest;
import com.mobileshoperp.modules.utility.entity.Expense;
import com.mobileshoperp.modules.utility.entity.Payment;
import com.mobileshoperp.modules.utility.exception.PaymentNotFoundException;
import com.mobileshoperp.modules.utility.mapper.PaymentMapper;
import com.mobileshoperp.modules.utility.repository.PaymentRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final SaleService saleService;
    private final SaleRepository saleRepository;
    private final PurchaseService purchaseService;
    private final PurchaseRepository purchaseRepository;
    private final ExpenseService expenseService;

    public PaymentResponse recordPayment(RecordPaymentRequest request) {
        ReferenceAmount reference = resolveReferenceAmount(request.referenceType(), request.referenceId());
        return recordPayment(request, reference.totalAmount());
    }

    public PaymentResponse recordPayment(RecordPaymentRequest request, BigDecimal referenceTotalAmount) {
        validatePositiveAmount(request.amount());
        validateReferencePayable(request.referenceType(), request.referenceId());

        BigDecimal paid = getTotalPaid(request.referenceType(), request.referenceId());
        BigDecimal pending = referenceTotalAmount.subtract(paid);
        if (request.amount().compareTo(pending) > 0) {
            throw new BusinessRuleException("Payment amount exceeds pending balance");
        }

        Payment payment = new Payment();
        payment.setReferenceType(request.referenceType());
        payment.setReferenceId(request.referenceId());
        payment.setPaymentMode(request.paymentMode());
        payment.setAmount(request.amount());
        payment.setTransactionNumber(request.transactionNumber());
        payment.setPaymentDate(request.paymentDate() != null ? request.paymentDate() : Instant.now());

        PaymentResponse response = paymentMapper.toResponse(paymentRepository.save(payment));
        refreshParentPaymentStatus(request.referenceType(), request.referenceId(), referenceTotalAmount);
        return response;
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getHistory(ReferenceType referenceType, UUID referenceId) {
        validateReferenceExists(referenceType, referenceId);
        return paymentRepository
                .findByReferenceTypeAndReferenceIdOrderByPaymentDateDescCreatedAtDesc(referenceType, referenceId)
                .stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PaymentBalanceResponse getBalance(ReferenceType referenceType, UUID referenceId) {
        ReferenceAmount reference = resolveReferenceAmount(referenceType, referenceId);
        BigDecimal paid = getTotalPaid(referenceType, referenceId);
        return buildBalance(referenceType, referenceId, reference.totalAmount(), paid);
    }

    @Transactional(readOnly = true)
    public PaymentResponse findById(UUID id) {
        return paymentMapper.toResponse(getPaymentOrThrow(id));
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalPaid(ReferenceType referenceType, UUID referenceId) {
        return paymentRepository.sumAmountByReference(referenceType, referenceId);
    }

    public PaymentStatus resolvePaymentStatus(BigDecimal totalAmount, BigDecimal paidAmount) {
        if (paidAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return PaymentStatus.PENDING;
        }
        if (paidAmount.compareTo(totalAmount) >= 0) {
            return PaymentStatus.PAID;
        }
        return PaymentStatus.PARTIAL;
    }

    @Transactional(readOnly = true)
    public Payment getPaymentOrThrow(UUID id) {
        return paymentRepository.findById(id).orElseThrow(() -> new PaymentNotFoundException(id));
    }

    private void refreshParentPaymentStatus(
            ReferenceType referenceType, UUID referenceId, BigDecimal referenceTotalAmount) {
        BigDecimal paid = getTotalPaid(referenceType, referenceId);
        PaymentStatus status = resolvePaymentStatus(referenceTotalAmount, paid);
        switch (referenceType) {
            case SALE -> {
                Sale sale = saleService.getSaleOrThrow(referenceId);
                sale.setPaymentStatus(status);
                saleRepository.save(sale);
            }
            case PURCHASE -> {
                Purchase purchase = purchaseService.getPurchaseOrThrow(referenceId);
                purchase.setPaymentStatus(status);
                purchaseRepository.save(purchase);
            }
            case EXPENSE -> {
                // Expenses do not have a payment_status column; balance tracked via payments only.
            }
            case REPAIR ->
                    throw new BusinessRuleException("Payment status sync is not supported for: " + referenceType);
        }
    }

    private ReferenceAmount resolveReferenceAmount(ReferenceType referenceType, UUID referenceId) {
        validateReferenceExists(referenceType, referenceId);
        return switch (referenceType) {
            case SALE -> {
                Sale sale = saleService.getSaleOrThrow(referenceId);
                yield new ReferenceAmount(sale.getTotalAmount());
            }
            case PURCHASE -> {
                Purchase purchase = purchaseService.getPurchaseOrThrow(referenceId);
                yield new ReferenceAmount(purchase.getTotalAmount());
            }
            case EXPENSE -> {
                Expense expense = expenseService.getExpenseOrThrow(referenceId);
                yield new ReferenceAmount(expense.getAmount());
            }
            case REPAIR ->
                    throw new BusinessRuleException("Payments for " + referenceType + " are not yet supported");
        };
    }

    private void validateReferenceExists(ReferenceType referenceType, UUID referenceId) {
        switch (referenceType) {
            case SALE -> saleService.getSaleOrThrow(referenceId);
            case PURCHASE -> purchaseService.getPurchaseOrThrow(referenceId);
            case EXPENSE -> expenseService.getExpenseOrThrow(referenceId);
            case REPAIR ->
                    throw new BusinessRuleException("Payments for " + referenceType + " are not yet supported");
        }
    }

    private void validateReferencePayable(ReferenceType referenceType, UUID referenceId) {
        switch (referenceType) {
            case SALE -> {
                Sale sale = saleService.getSaleOrThrow(referenceId);
                if (sale.getDeletedAt() != null || sale.getPaymentStatus() == PaymentStatus.REFUNDED) {
                    throw new BusinessRuleException("Cancelled sale cannot accept payments");
                }
            }
            case PURCHASE -> {
                Purchase purchase = purchaseService.getPurchaseOrThrow(referenceId);
                if (purchase.getPaymentStatus() == PaymentStatus.CANCELLED) {
                    throw new BusinessRuleException("Cancelled purchase cannot accept payments");
                }
            }
            case EXPENSE -> {
                Expense expense = expenseService.getExpenseOrThrow(referenceId);
                if (expense.getDeletedAt() != null) {
                    throw new BusinessRuleException("Deleted expense cannot accept payments");
                }
            }
            case REPAIR ->
                    throw new BusinessRuleException("Payments for " + referenceType + " are not yet supported");
        }
    }

    private PaymentBalanceResponse buildBalance(
            ReferenceType referenceType, UUID referenceId, BigDecimal totalAmount, BigDecimal paidAmount) {
        BigDecimal pending = totalAmount.subtract(paidAmount).max(BigDecimal.ZERO);
        return new PaymentBalanceResponse(
                referenceType,
                referenceId,
                totalAmount,
                paidAmount,
                pending,
                resolvePaymentStatus(totalAmount, paidAmount));
    }

    private void validatePositiveAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleException("Payment amount must be positive");
        }
    }

    private record ReferenceAmount(BigDecimal totalAmount) {}
}
