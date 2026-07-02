package com.mobileshoperp.modules.product.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateProductImageRequest(@NotBlank String imageUrl, Integer displayOrder) {
}
