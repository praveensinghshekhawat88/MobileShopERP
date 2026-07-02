package com.mobileshoperp.modules.purchase.dto;

import com.mobileshoperp.common.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record PurchaseResponse(
        UUID id,
        UUID supplierId,
        String invoiceNumber,
        LocalDate invoiceDate,
        BigDecimal totalAmount,
        PaymentStatus paymentStatus) {
}
