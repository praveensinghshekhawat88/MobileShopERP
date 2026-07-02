package com.mobileshoperp.modules.product.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record ReplaceVariantAttributesRequest(
        @NotNull UUID variantId, @NotEmpty List<Long> attributeValueIds) {
}
