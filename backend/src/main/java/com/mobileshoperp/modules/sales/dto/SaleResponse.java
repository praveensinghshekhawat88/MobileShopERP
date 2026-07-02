package com.mobileshoperp.modules.sales.dto;

import com.mobileshoperp.common.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record SaleResponse(
        UUID id,
        UUID customerId,
        String invoiceNumber,
        LocalDate invoiceDate,
        BigDecimal totalAmount,
        PaymentStatus paymentStatus) {
}
