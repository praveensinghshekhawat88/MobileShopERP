package com.mobileshoperp.modules.auth.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.auth.dto.CreateRoleRequest;
import com.mobileshoperp.modules.auth.dto.RoleResponse;
import com.mobileshoperp.modules.auth.dto.UpdateRoleRequest;
import com.mobileshoperp.modules.auth.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Roles")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @Operation(summary = "List active roles")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<List<RoleResponse>> findAllActive() {
        return ApiResponse.success(roleService.findAllActive());
    }

    @Operation(summary = "Get role by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<RoleResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(roleService.findById(id));
    }

    @Operation(summary = "Create role")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<RoleResponse> create(@Valid @RequestBody CreateRoleRequest request) {
        return ApiResponse.success("Role created", roleService.create(request));
    }

    @Operation(summary = "Update role")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<RoleResponse> update(
            @PathVariable Long id, @Valid @RequestBody UpdateRoleRequest request) {
        return ApiResponse.success("Role updated", roleService.update(id, request));
    }

    @Operation(summary = "Deactivate role")
    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deactivate(@PathVariable Long id) {
        roleService.deactivate(id);
        return ApiResponse.success("Role deactivated", null);
    }
}
