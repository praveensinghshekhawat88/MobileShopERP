package com.mobileshoperp.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException)
            throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        ApiResponse<Void> body =
                ApiResponse.error("Authentication required", ErrorCode.UNAUTHORIZED.name(), request.getRequestURI());
        objectMapper.writeValue(response.getOutputStream(), body);
    }
}
