package com.mobileshoperp.modules.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateAttributeGroupRequest(@NotBlank @Size(max = 100) String name) {
}
