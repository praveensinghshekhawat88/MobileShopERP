package com.mobileshoperp.modules.product.dto;

import com.mobileshoperp.common.enums.AttributeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateAttributeRequest(
        @NotNull Long attributeGroupId,
        @NotBlank @Size(max = 100) String name,
        @NotNull AttributeType attributeType) {
}
