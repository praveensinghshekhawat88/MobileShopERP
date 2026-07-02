package com.mobileshoperp.modules.auth.dto;

import jakarta.validation.constraints.Size;

public record UpdateRoleRequest(
        @Size(max = 50) String name,
        String description,
        Boolean active) {
}
