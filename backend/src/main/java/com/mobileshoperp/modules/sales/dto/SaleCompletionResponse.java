package com.mobileshoperp.modules.sales.dto;

import com.mobileshoperp.common.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record SaleCompletionResponse(
        UUID saleId,
        String invoiceNumber,
        LocalDate invoiceDate,
        UUID customerId,
        BigDecimal totalAmount,
        PaymentStatus paymentStatus,
        BigDecimal amountPaid,
        BigDecimal balanceDue,
        int itemCount) {
}
