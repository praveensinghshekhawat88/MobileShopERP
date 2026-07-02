package com.mobileshoperp.modules.utility.dto;

import com.mobileshoperp.common.enums.PaymentMode;
import com.mobileshoperp.common.enums.ReferenceType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record RecordPaymentRequest(
        @NotNull ReferenceType referenceType,
        @NotNull UUID referenceId,
        @NotNull PaymentMode paymentMode,
        @NotNull @DecimalMin(value = "0.01") BigDecimal amount,
        @Size(max = 150) String transactionNumber,
        Instant paymentDate) {
}
