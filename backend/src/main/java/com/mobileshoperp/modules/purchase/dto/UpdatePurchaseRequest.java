package com.mobileshoperp.modules.purchase.dto;

import com.mobileshoperp.common.enums.PaymentStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record UpdatePurchaseRequest(
        UUID supplierId,
        @Size(max = 100) String invoiceNumber,
        LocalDate invoiceDate,
        @DecimalMin(value = "0.0") BigDecimal totalAmount,
        PaymentStatus paymentStatus) {
}
