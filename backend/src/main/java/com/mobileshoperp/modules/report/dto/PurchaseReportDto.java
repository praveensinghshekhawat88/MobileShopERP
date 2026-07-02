package com.mobileshoperp.modules.report.dto;

import com.mobileshoperp.common.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record PurchaseReportDto(
        UUID id,
        String invoiceNumber,
        LocalDate invoiceDate,
        UUID supplierId,
        String supplierName,
        String supplierMobile,
        BigDecimal totalAmount,
        PaymentStatus paymentStatus) {}
