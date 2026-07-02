package com.mobileshoperp.modules.product.dto;

import com.mobileshoperp.common.enums.AttributeType;

public record AttributeResponse(
        Long id,
        Long attributeGroupId,
        String name,
        AttributeType attributeType) {
}
