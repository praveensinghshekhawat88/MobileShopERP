package com.mobileshoperp.modules.product.dto;

import jakarta.validation.constraints.Size;

public record UpdateAttributeValueRequest(
        @Size(max = 100) String value, Integer displayOrder, Boolean active) {
}
