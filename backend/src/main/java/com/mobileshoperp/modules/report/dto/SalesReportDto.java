package com.mobileshoperp.modules.report.dto;

import com.mobileshoperp.common.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record SalesReportDto(
        UUID id,
        String invoiceNumber,
        LocalDate invoiceDate,
        UUID customerId,
        String customerName,
        String customerMobile,
        BigDecimal totalAmount,
        PaymentStatus paymentStatus) {}
