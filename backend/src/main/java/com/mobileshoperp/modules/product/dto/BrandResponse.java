package com.mobileshoperp.modules.product.dto;

public record BrandResponse(
        Long id,
        String name,
        String description,
        boolean active) {
}
