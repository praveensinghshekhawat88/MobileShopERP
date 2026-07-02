package com.mobileshoperp.modules.auth.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.auth.dto.LoginRequest;
import com.mobileshoperp.modules.auth.dto.LoginResponse;
import com.mobileshoperp.modules.auth.dto.RefreshTokenRequest;
import com.mobileshoperp.modules.auth.service.AuthService;
import com.mobileshoperp.modules.utility.util.ClientIpResolver;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Authentication")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Login with mobile and password")
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(
            @Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        return ApiResponse.success(
                "Login successful", authService.login(request, ClientIpResolver.resolve(httpRequest)));
    }

    @Operation(summary = "Refresh access token")
    @PostMapping("/refresh")
    public ApiResponse<LoginResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ApiResponse.success("Token refreshed", authService.refresh(request));
    }
}
