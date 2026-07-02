package com.mobileshoperp.modules.auth.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.auth.dto.SettingsResponse;
import com.mobileshoperp.modules.auth.dto.UpdateSettingsRequest;
import com.mobileshoperp.modules.auth.service.SettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Settings")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    @Operation(summary = "Get shop settings")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<SettingsResponse> getSettings() {
        return ApiResponse.success(settingsService.getSettings());
    }

    @Operation(summary = "Update shop settings")
    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<SettingsResponse> updateSettings(@Valid @RequestBody UpdateSettingsRequest request) {
        return ApiResponse.success("Settings updated", settingsService.updateSettings(request));
    }
}
