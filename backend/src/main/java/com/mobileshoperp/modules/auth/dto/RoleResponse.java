package com.mobileshoperp.modules.auth.dto;

public record RoleResponse(
        Long id,
        String name,
        String description,
        boolean active) {
}
