package com.mobileshoperp.modules.product.dto;

import jakarta.validation.constraints.Size;

public record UpdateBrandRequest(
        @Size(max = 100) String name,
        String description,
        Boolean active) {
}
