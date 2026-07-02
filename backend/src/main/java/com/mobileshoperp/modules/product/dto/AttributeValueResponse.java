package com.mobileshoperp.modules.product.dto;

public record AttributeValueResponse(
        Long id, Long attributeId, String value, int displayOrder, boolean active) {
}
