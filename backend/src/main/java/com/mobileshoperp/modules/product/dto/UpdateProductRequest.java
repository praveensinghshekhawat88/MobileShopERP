package com.mobileshoperp.modules.product.dto;

import jakarta.validation.constraints.Size;

public record UpdateProductRequest(
        Long brandId,
        Long categoryId,
        @Size(max = 200) String name,
        @Size(max = 150) String model,
        @Size(max = 20) String hsnCode,
        String description,
        Boolean active) {
}
