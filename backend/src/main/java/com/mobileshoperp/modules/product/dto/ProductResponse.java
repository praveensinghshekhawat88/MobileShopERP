package com.mobileshoperp.modules.product.dto;

import java.util.UUID;

public record ProductResponse(
        UUID id,
        Long brandId,
        Long categoryId,
        String name,
        String model,
        String hsnCode,
        String description,
        boolean active) {
}
