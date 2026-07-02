package com.mobileshoperp.modules.product.dto;

import jakarta.validation.constraints.Size;

public record UpdateAttributeGroupRequest(@Size(max = 100) String name) {
}
