package com.mobileshoperp.modules.purchase.dto;

import com.mobileshoperp.common.enums.PaymentStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreatePurchaseRequest(
        @NotNull UUID supplierId,
        @NotBlank @Size(max = 100) String invoiceNumber,
        @NotNull LocalDate invoiceDate,
        @NotNull @DecimalMin(value = "0.0") BigDecimal totalAmount,
        PaymentStatus paymentStatus) {
}
