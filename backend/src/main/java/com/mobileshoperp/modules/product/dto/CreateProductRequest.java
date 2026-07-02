package com.mobileshoperp.modules.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateProductRequest(
        @NotNull Long brandId,
        @NotNull Long categoryId,
        @NotBlank @Size(max = 200) String name,
        @Size(max = 150) String model,
        @Size(max = 20) String hsnCode,
        String description,
        Boolean active) {
}
