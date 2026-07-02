package com.mobileshoperp.modules.utility.dto;

import com.mobileshoperp.common.enums.PaymentMode;
import com.mobileshoperp.common.enums.ReferenceType;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PaymentResponse(
        UUID id,
        ReferenceType referenceType,
        UUID referenceId,
        PaymentMode paymentMode,
        BigDecimal amount,
        String transactionNumber,
        Instant paymentDate) {
}
