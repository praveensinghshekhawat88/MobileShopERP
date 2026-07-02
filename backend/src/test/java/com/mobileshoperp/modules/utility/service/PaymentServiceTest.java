package com.mobileshoperp.modules.utility.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.common.enums.PaymentMode;
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
import com.mobileshoperp.modules.utility.mapper.PaymentMapper;
import com.mobileshoperp.modules.utility.repository.PaymentRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private PaymentMapper paymentMapper;

    @Mock
    private SaleService saleService;

    @Mock
    private SaleRepository saleRepository;

    @Mock
    private PurchaseService purchaseService;

    @Mock
    private PurchaseRepository purchaseRepository;

    @Mock
    private ExpenseService expenseService;

    @InjectMocks
    private PaymentService paymentService;

    @Test
    void recordPayment_partialPayment_updatesSaleStatusToPartial() {
        UUID saleId = UUID.randomUUID();
        Sale sale = new Sale();
        sale.setId(saleId);
        sale.setTotalAmount(new BigDecimal("10000.00"));
        sale.setPaymentStatus(PaymentStatus.PENDING);

        RecordPaymentRequest request = new RecordPaymentRequest(
                ReferenceType.SALE, saleId, PaymentMode.UPI, new BigDecimal("4000.00"), "TXN-1", null);

        Payment saved = new Payment();
        saved.setId(UUID.randomUUID());
        when(saleService.getSaleOrThrow(saleId)).thenReturn(sale);
        when(paymentRepository.sumAmountByReference(ReferenceType.SALE, saleId))
                .thenReturn(BigDecimal.ZERO)
                .thenReturn(new BigDecimal("4000.00"));
        when(paymentRepository.save(any(Payment.class))).thenReturn(saved);
        when(paymentMapper.toResponse(saved))
                .thenReturn(new PaymentResponse(
                        saved.getId(),
                        ReferenceType.SALE,
                        saleId,
                        PaymentMode.UPI,
                        new BigDecimal("4000.00"),
                        "TXN-1",
                        null));

        PaymentResponse response = paymentService.recordPayment(request);

        assertThat(response.amount()).isEqualByComparingTo("4000.00");
        ArgumentCaptor<Sale> saleCaptor = ArgumentCaptor.forClass(Sale.class);
        verify(saleRepository).save(saleCaptor.capture());
        assertThat(saleCaptor.getValue().getPaymentStatus()).isEqualTo(PaymentStatus.PARTIAL);
    }

    @Test
    void recordPayment_fullPayment_updatesSaleStatusToPaid() {
        UUID saleId = UUID.randomUUID();
        Sale sale = new Sale();
        sale.setId(saleId);
        sale.setTotalAmount(new BigDecimal("10000.00"));

        RecordPaymentRequest request = new RecordPaymentRequest(
                ReferenceType.SALE, saleId, PaymentMode.CASH, new BigDecimal("6000.00"), null, null);

        Payment saved = new Payment();
        saved.setId(UUID.randomUUID());
        when(saleService.getSaleOrThrow(saleId)).thenReturn(sale);
        when(paymentRepository.sumAmountByReference(ReferenceType.SALE, saleId))
                .thenReturn(new BigDecimal("4000.00"))
                .thenReturn(new BigDecimal("10000.00"));
        when(paymentRepository.save(any(Payment.class))).thenReturn(saved);
        when(paymentMapper.toResponse(saved))
                .thenReturn(new PaymentResponse(
                        saved.getId(),
                        ReferenceType.SALE,
                        saleId,
                        PaymentMode.CASH,
                        new BigDecimal("6000.00"),
                        null,
                        null));

        paymentService.recordPayment(request);

        ArgumentCaptor<Sale> saleCaptor = ArgumentCaptor.forClass(Sale.class);
        verify(saleRepository).save(saleCaptor.capture());
        assertThat(saleCaptor.getValue().getPaymentStatus()).isEqualTo(PaymentStatus.PAID);
    }

    @Test
    void recordPayment_exceedingPendingBalance_rejects() {
        UUID purchaseId = UUID.randomUUID();
        Purchase purchase = new Purchase();
        purchase.setId(purchaseId);
        purchase.setTotalAmount(new BigDecimal("5000.00"));

        RecordPaymentRequest request = new RecordPaymentRequest(
                ReferenceType.PURCHASE, purchaseId, PaymentMode.CARD, new BigDecimal("3000.00"), null, null);

        when(purchaseService.getPurchaseOrThrow(purchaseId)).thenReturn(purchase);
        when(paymentRepository.sumAmountByReference(ReferenceType.PURCHASE, purchaseId))
                .thenReturn(new BigDecimal("4000.00"));

        assertThatThrownBy(() -> paymentService.recordPayment(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("pending balance");
    }

    @Test
    void getBalance_returnsPendingAmount() {
        UUID saleId = UUID.randomUUID();
        Sale sale = new Sale();
        sale.setId(saleId);
        sale.setTotalAmount(new BigDecimal("15000.00"));

        when(saleService.getSaleOrThrow(saleId)).thenReturn(sale);
        when(paymentRepository.sumAmountByReference(ReferenceType.SALE, saleId))
                .thenReturn(new BigDecimal("5000.00"));

        PaymentBalanceResponse balance = paymentService.getBalance(ReferenceType.SALE, saleId);

        assertThat(balance.totalAmount()).isEqualByComparingTo("15000.00");
        assertThat(balance.amountPaid()).isEqualByComparingTo("5000.00");
        assertThat(balance.pendingBalance()).isEqualByComparingTo("10000.00");
        assertThat(balance.paymentStatus()).isEqualTo(PaymentStatus.PARTIAL);
    }

    @Test
    void getHistory_returnsPaymentsForReference() {
        UUID saleId = UUID.randomUUID();
        Sale sale = new Sale();
        sale.setId(saleId);
        sale.setTotalAmount(BigDecimal.ZERO);

        Payment payment = new Payment();
        payment.setId(UUID.randomUUID());
        when(saleService.getSaleOrThrow(saleId)).thenReturn(sale);
        when(paymentRepository.findByReferenceTypeAndReferenceIdOrderByPaymentDateDescCreatedAtDesc(
                        ReferenceType.SALE, saleId))
                .thenReturn(List.of(payment));
        when(paymentMapper.toResponse(payment))
                .thenReturn(new PaymentResponse(
                        payment.getId(),
                        ReferenceType.SALE,
                        saleId,
                        PaymentMode.CASH,
                        new BigDecimal("100.00"),
                        null,
                        null));

        List<PaymentResponse> history = paymentService.getHistory(ReferenceType.SALE, saleId);

        assertThat(history).hasSize(1);
    }

    @Test
    void recordPayment_forExpense_usesExpenseAmountAsTotal() {
        UUID expenseId = UUID.randomUUID();
        Expense expense = new Expense();
        expense.setId(expenseId);
        expense.setAmount(new BigDecimal("2500.00"));

        RecordPaymentRequest request = new RecordPaymentRequest(
                ReferenceType.EXPENSE, expenseId, PaymentMode.CASH, new BigDecimal("2500.00"), null, null);

        Payment saved = new Payment();
        saved.setId(UUID.randomUUID());
        when(expenseService.getExpenseOrThrow(expenseId)).thenReturn(expense);
        when(paymentRepository.sumAmountByReference(ReferenceType.EXPENSE, expenseId))
                .thenReturn(BigDecimal.ZERO)
                .thenReturn(new BigDecimal("2500.00"));
        when(paymentRepository.save(any(Payment.class))).thenReturn(saved);
        when(paymentMapper.toResponse(saved))
                .thenReturn(new PaymentResponse(
                        saved.getId(),
                        ReferenceType.EXPENSE,
                        expenseId,
                        PaymentMode.CASH,
                        new BigDecimal("2500.00"),
                        null,
                        null));

        PaymentResponse response = paymentService.recordPayment(request);

        assertThat(response.amount()).isEqualByComparingTo("2500.00");
    }
}
