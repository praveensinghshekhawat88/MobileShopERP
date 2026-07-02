package com.mobileshoperp.modules.product.dto;

public record CategoryResponse(
        Long id,
        Long parentId,
        String name,
        String description,
        boolean active) {
}
