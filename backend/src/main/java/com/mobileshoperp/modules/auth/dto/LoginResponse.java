package com.mobileshoperp.modules.auth.dto;

import java.util.UUID;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresIn,
        UserSummary user) {

    public record UserSummary(
            UUID id,
            String firstName,
            String lastName,
            String mobile,
            String roleName) {
    }
}
