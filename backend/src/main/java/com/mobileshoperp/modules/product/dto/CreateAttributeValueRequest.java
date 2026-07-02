package com.mobileshoperp.modules.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateAttributeValueRequest(
        @NotNull Long attributeId,
        @NotBlank @Size(max = 100) String value,
        Integer displayOrder,
        Boolean active) {
}
