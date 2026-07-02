package com.mobileshoperp.modules.utility.dto;

import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.common.enums.ReferenceType;
import java.math.BigDecimal;
import java.util.UUID;

public record PaymentBalanceResponse(
        ReferenceType referenceType,
        UUID referenceId,
        BigDecimal totalAmount,
        BigDecimal amountPaid,
        BigDecimal pendingBalance,
        PaymentStatus paymentStatus) {
}
