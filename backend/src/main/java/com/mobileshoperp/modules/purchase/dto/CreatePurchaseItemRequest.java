package com.mobileshoperp.modules.purchase.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.UUID;

public record CreatePurchaseItemRequest(
        @NotNull UUID variantId,
        @NotNull @Min(1) Integer quantity,
        @NotNull @Positive BigDecimal purchasePrice,
        BigDecimal taxAmount) {
}
