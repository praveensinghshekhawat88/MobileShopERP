package com.mobileshoperp.modules.product.dto;

import com.mobileshoperp.common.enums.AttributeType;
import java.util.UUID;

public record VariantAttributeDetailResponse(
        UUID id,
        UUID variantId,
        Long attributeValueId,
        Long attributeId,
        String attributeName,
        Long attributeGroupId,
        String attributeGroupName,
        AttributeType attributeType,
        String value) {
}
