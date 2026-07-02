package com.mobileshoperp.modules.purchase.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PurchaseItemResponse(
        UUID id,
        UUID purchaseId,
        UUID variantId,
        int quantity,
        BigDecimal purchasePrice,
        BigDecimal taxAmount,
        BigDecimal totalAmount) {
}
