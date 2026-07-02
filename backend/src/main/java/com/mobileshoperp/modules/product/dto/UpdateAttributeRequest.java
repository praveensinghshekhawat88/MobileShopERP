package com.mobileshoperp.modules.product.dto;

import com.mobileshoperp.common.enums.AttributeType;
import jakarta.validation.constraints.Size;

public record UpdateAttributeRequest(
        Long attributeGroupId,
        @Size(max = 100) String name,
        AttributeType attributeType) {
}
