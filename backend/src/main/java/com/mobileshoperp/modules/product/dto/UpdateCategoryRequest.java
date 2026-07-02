package com.mobileshoperp.modules.product.dto;

import jakarta.validation.constraints.Size;

public record UpdateCategoryRequest(
        Long parentId,
        @Size(max = 100) String name,
        String description,
        Boolean active) {
}
