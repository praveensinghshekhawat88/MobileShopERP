package com.mobileshoperp.modules.report.dto;

import com.mobileshoperp.common.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record SupplierPurchaseItemDto(
        UUID id,
        String invoiceNumber,
        LocalDate invoiceDate,
        BigDecimal totalAmount,
        PaymentStatus paymentStatus) {}
