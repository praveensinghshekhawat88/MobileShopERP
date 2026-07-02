package com.mobileshoperp.modules.sales.service;

import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.auth.service.SettingsService;
import com.mobileshoperp.modules.business.service.CustomerService;
import com.mobileshoperp.modules.sales.dto.CreateSaleRequest;
import com.mobileshoperp.modules.sales.dto.SaleResponse;
import com.mobileshoperp.modules.sales.dto.UpdateSaleRequest;
import com.mobileshoperp.modules.sales.entity.Sale;
import com.mobileshoperp.modules.sales.exception.DuplicateSaleInvoiceNumberException;
import com.mobileshoperp.modules.sales.exception.SaleNotFoundException;
import com.mobileshoperp.modules.sales.mapper.SaleMapper;
import com.mobileshoperp.modules.sales.repository.SaleRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.EnumSet;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional
public class SaleService {

    private static final Set<PaymentStatus> WRITABLE_PAYMENT_STATUSES =
            EnumSet.of(PaymentStatus.PENDING, PaymentStatus.PARTIAL, PaymentStatus.PAID);

    private final SaleRepository saleRepository;
    private final SaleMapper saleMapper;
    private final CustomerService customerService;
    private final SettingsService settingsService;

    @Transactional(readOnly = true)
    public Page<SaleResponse> findAll(UUID customerId, Pageable pageable) {
        Page<Sale> page = customerId == null
                ? saleRepository.findAllByOrderByInvoiceDateDesc(pageable)
                : saleRepository.findByCustomerIdOrderByInvoiceDateDesc(customerId, pageable);
        return page.map(saleMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public SaleResponse findById(UUID id) {
        return saleMapper.toResponse(getSaleOrThrow(id));
    }

    public SaleResponse create(CreateSaleRequest request) {
        customerService.getActiveCustomerOrThrow(request.customerId());
        String invoiceNumber = resolveInvoiceNumber(request.invoiceNumber(), request.invoiceDate());
        validateUniqueInvoiceNumber(invoiceNumber, null);
        BigDecimal totalAmount = request.totalAmount() != null ? request.totalAmount() : BigDecimal.ZERO;
        validateTotalAmount(totalAmount);
        validatePaymentStatus(request.paymentStatus());

        Sale sale = saleMapper.toEntity(request);
        sale.setInvoiceNumber(invoiceNumber);
        sale.setTotalAmount(totalAmount);
        if (request.paymentStatus() != null) {
            sale.setPaymentStatus(request.paymentStatus());
        }
        return saleMapper.toResponse(saleRepository.save(sale));
    }

    public SaleResponse update(UUID id, UpdateSaleRequest request) {
        Sale sale = getSaleOrThrow(id);
        if (request.customerId() != null) {
            customerService.getActiveCustomerOrThrow(request.customerId());
        }
        if (request.invoiceNumber() != null) {
            validateUniqueInvoiceNumber(request.invoiceNumber(), id);
        }
        if (request.totalAmount() != null) {
            validateTotalAmount(request.totalAmount());
        }
        if (request.paymentStatus() != null) {
            validatePaymentStatus(request.paymentStatus());
        }
        saleMapper.updateEntity(request, sale);
        return saleMapper.toResponse(saleRepository.save(sale));
    }

    @Transactional(readOnly = true)
    public Sale getSaleOrThrow(UUID id) {
        return saleRepository.findById(id).orElseThrow(() -> new SaleNotFoundException(id));
    }

    /**
     * Generates shop invoice numbers as {@code {prefix}-{yyyyMM}-{sequence}}.
     * Prefix comes from {@code settings.invoice_prefix} (default {@code INV}).
     * Sequence resets per calendar month and is zero-padded to four digits.
     */
    String generateInvoiceNumber(LocalDate invoiceDate) {
        String prefix = settingsService.getInvoicePrefixOrDefault();
        String period = YearMonth.from(invoiceDate).format(DateTimeFormatter.ofPattern("yyyyMM"));
        String base = prefix + "-" + period + "-";
        long existing = saleRepository.countByInvoiceNumberStartingWithIgnoreCase(base);
        for (int attempt = 0; attempt < 100; attempt++) {
            String candidate = base + String.format("%04d", existing + 1 + attempt);
            if (saleRepository.findByInvoiceNumberIgnoreCase(candidate).isEmpty()) {
                return candidate;
            }
        }
        throw new BusinessRuleException("Unable to generate unique invoice number");
    }

    private String resolveInvoiceNumber(String requestedNumber, LocalDate invoiceDate) {
        if (StringUtils.hasText(requestedNumber)) {
            return requestedNumber.trim();
        }
        return generateInvoiceNumber(invoiceDate);
    }

    private void validateUniqueInvoiceNumber(String invoiceNumber, UUID excludeId) {
        saleRepository.findByInvoiceNumberIgnoreCase(invoiceNumber).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new DuplicateSaleInvoiceNumberException(invoiceNumber);
            }
        });
    }

    private void validateTotalAmount(BigDecimal totalAmount) {
        if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessRuleException("Sale total amount cannot be negative");
        }
    }

    private void validatePaymentStatus(PaymentStatus paymentStatus) {
        if (paymentStatus == null) {
            return;
        }
        if (!WRITABLE_PAYMENT_STATUSES.contains(paymentStatus)) {
            throw new BusinessRuleException(
                    "Sale payment status must be one of: PENDING, PARTIAL, PAID");
        }
    }
}
