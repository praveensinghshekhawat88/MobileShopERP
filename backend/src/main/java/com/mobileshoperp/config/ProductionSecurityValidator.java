package com.mobileshoperp.config;

import com.mobileshoperp.security.JwtProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("prod")
@RequiredArgsConstructor
public class ProductionSecurityValidator implements ApplicationRunner {

    private static final String DEFAULT_SECRET = "change-me-in-production-use-at-least-256-bit-secret-key";

    private final JwtProperties jwtProperties;

    @Override
    public void run(ApplicationArguments args) {
        String secret = jwtProperties.getSecret();
        if (secret == null || secret.isBlank() || DEFAULT_SECRET.equals(secret)) {
            throw new IllegalStateException(
                    "JWT_SECRET must be configured with a strong value when running with the prod profile");
        }
        if (secret.length() < 32) {
            throw new IllegalStateException("JWT_SECRET must be at least 32 characters for production use");
        }
    }
}
