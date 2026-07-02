package com.mobileshoperp.modules.sales.dto;

import com.mobileshoperp.common.enums.PaymentStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record UpdateSaleRequest(
        UUID customerId,
        @Size(max = 100) String invoiceNumber,
        LocalDate invoiceDate,
        @DecimalMin(value = "0.0") BigDecimal totalAmount,
        PaymentStatus paymentStatus) {
}
