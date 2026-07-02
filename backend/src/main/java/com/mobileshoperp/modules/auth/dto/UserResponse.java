package com.mobileshoperp.modules.auth.dto;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        Long roleId,
        String roleName,
        String firstName,
        String lastName,
        String mobile,
        String email,
        boolean active,
        Instant lastLogin) {
}
