package com.mobileshoperp.modules.purchase.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.UUID;

public record UpdatePurchaseItemRequest(
        UUID variantId,
        @Min(1) Integer quantity,
        @Positive BigDecimal purchasePrice,
        BigDecimal taxAmount) {
}
