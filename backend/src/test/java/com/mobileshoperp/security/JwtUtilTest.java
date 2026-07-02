package com.mobileshoperp.security;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        JwtProperties properties = new JwtProperties();
        properties.setSecret("test-secret-key-minimum-256-bits-required-for-hmac-sha256-signing");
        properties.setExpirationMs(3600000);
        properties.setRefreshExpirationMs(86400000);
        jwtUtil = new JwtUtil(properties);
    }

    @Test
    void shouldGenerateAndValidateAccessToken() {
        UUID userId = UUID.randomUUID();
        String token = jwtUtil.generateAccessToken("admin", userId, "ADMIN");

        assertThat(jwtUtil.isTokenValid(token)).isTrue();
        assertThat(jwtUtil.extractUsername(token)).isEqualTo("admin");
        assertThat(jwtUtil.extractUserId(token)).isEqualTo(userId);
        assertThat(jwtUtil.extractRole(token)).isEqualTo("ADMIN");
    }

    @Test
    void shouldRejectInvalidToken() {
        assertThat(jwtUtil.isTokenValid("invalid.token.value")).isFalse();
    }

    @Test
    void shouldIdentifyRefreshToken() {
        UUID userId = UUID.randomUUID();
        String refresh = jwtUtil.generateRefreshToken("admin", userId);

        assertThat(jwtUtil.isRefreshToken(refresh)).isTrue();
        assertThat(jwtUtil.isAccessToken(refresh)).isFalse();
    }

    @Test
    void accessTokenShouldNotBeRefreshToken() {
        UUID userId = UUID.randomUUID();
        String access = jwtUtil.generateAccessToken("admin", userId, "ADMIN");

        assertThat(jwtUtil.isRefreshToken(access)).isFalse();
        assertThat(jwtUtil.isAccessToken(access)).isTrue();
    }
}
