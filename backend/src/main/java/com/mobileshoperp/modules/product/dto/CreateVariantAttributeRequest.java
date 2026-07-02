package com.mobileshoperp.modules.product.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateVariantAttributeRequest(@NotNull UUID variantId, @NotNull Long attributeValueId) {
}
