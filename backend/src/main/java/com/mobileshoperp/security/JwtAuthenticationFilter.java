package com.mobileshoperp.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.exception.ErrorCode;
import com.mobileshoperp.modules.auth.entity.User;
import com.mobileshoperp.modules.auth.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader(AUTHORIZATION_HEADER);

        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(BEARER_PREFIX.length());

        if (!jwtUtil.isTokenValid(token)) {
            writeUnauthorized(response, request, "Invalid or expired token");
            return;
        }

        if (jwtUtil.isRefreshToken(token)) {
            writeUnauthorized(response, request, "Refresh token cannot be used for API access");
            return;
        }

        if (!jwtUtil.isAccessToken(token)) {
            writeUnauthorized(response, request, "Invalid token type");
            return;
        }

        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        String mobile = jwtUtil.extractUsername(token);
        User user = userRepository.findByMobile(mobile).orElse(null);
        if (user == null || user.getDeletedAt() != null || !user.isActive()) {
            writeUnauthorized(response, request, "User account is inactive or unavailable");
            return;
        }

        String role = jwtUtil.extractRole(token);
        var authorities = role != null
                ? Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                : Collections.<SimpleGrantedAuthority>emptyList();

        AuthenticatedUser principal =
                new AuthenticatedUser(jwtUtil.extractUserId(token), mobile, role);
        var authentication = new UsernamePasswordAuthenticationToken(principal, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }

    private void writeUnauthorized(HttpServletResponse response, HttpServletRequest request, String message)
            throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        ApiResponse<Void> body = ApiResponse.error(message, ErrorCode.UNAUTHORIZED.name(), request.getRequestURI());
        objectMapper.writeValue(response.getOutputStream(), body);
    }
}
