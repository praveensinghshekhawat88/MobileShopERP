package com.mobileshoperp.modules.sales.dto;

import com.mobileshoperp.common.enums.PaymentMode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record FinalizeSaleRequest(@Valid InitialPaymentRequest initialPayment) {

    public record InitialPaymentRequest(
            @NotNull PaymentMode paymentMode,
            @NotNull @DecimalMin(value = "0.01") BigDecimal amount,
            @Size(max = 150) String transactionNumber) {
    }
}
