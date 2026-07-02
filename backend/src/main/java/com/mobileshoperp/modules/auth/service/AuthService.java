package com.mobileshoperp.modules.auth.service;

import com.mobileshoperp.modules.auth.dto.LoginRequest;
import com.mobileshoperp.modules.auth.dto.LoginResponse;
import com.mobileshoperp.modules.auth.dto.RefreshTokenRequest;
import com.mobileshoperp.modules.auth.entity.User;
import com.mobileshoperp.modules.auth.exception.InactiveUserException;
import com.mobileshoperp.modules.auth.exception.InvalidCredentialsException;
import com.mobileshoperp.modules.auth.repository.UserRepository;
import com.mobileshoperp.modules.utility.service.AuditLogService;
import com.mobileshoperp.security.JwtProperties;
import com.mobileshoperp.security.JwtUtil;
import io.jsonwebtoken.Claims;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private static final String TOKEN_TYPE = "Bearer";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final JwtProperties jwtProperties;
    private final AuditLogService auditLogService;

    public LoginResponse login(LoginRequest request, String ipAddress) {
        User user = userRepository.findByMobile(request.mobile())
                .orElseThrow(InvalidCredentialsException::new);

        if (!user.isActive()) {
            throw new InactiveUserException();
        }
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        user.setLastLogin(Instant.now());
        userRepository.save(user);

        auditLogService.recordLogin(user.getId(), ipAddress);

        return buildLoginResponse(user);
    }

    @Transactional(readOnly = true)
    public LoginResponse refresh(RefreshTokenRequest request) {
        Claims claims = jwtUtil.parseClaims(request.refreshToken());
        if (!"refresh".equals(claims.get("type", String.class))) {
            throw new InvalidCredentialsException();
        }
        if (!jwtUtil.isTokenValid(request.refreshToken())) {
            throw new InvalidCredentialsException();
        }

        User user = userRepository.findByIdWithRole(jwtUtil.extractUserId(request.refreshToken()))
                .orElseThrow(InvalidCredentialsException::new);

        if (!user.isActive()) {
            throw new InactiveUserException();
        }

        return buildLoginResponse(user);
    }

    private LoginResponse buildLoginResponse(User user) {
        String accessToken = jwtUtil.generateAccessToken(
                user.getMobile(), user.getId(), user.getRole().getName());
        String refreshToken = jwtUtil.generateRefreshToken(user.getMobile(), user.getId());

        LoginResponse.UserSummary summary = new LoginResponse.UserSummary(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getMobile(),
                user.getRole().getName());

        return new LoginResponse(
                accessToken,
                refreshToken,
                TOKEN_TYPE,
                jwtProperties.getExpirationMs() / 1000,
                summary);
    }
}
