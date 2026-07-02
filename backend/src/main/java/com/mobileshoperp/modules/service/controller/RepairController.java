package com.mobileshoperp.modules.service.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.common.enums.RepairStatus;
import com.mobileshoperp.modules.service.dto.CreateRepairRequest;
import com.mobileshoperp.modules.service.dto.RepairResponse;
import com.mobileshoperp.modules.service.dto.UpdateRepairRequest;
import com.mobileshoperp.modules.service.dto.UpdateRepairStatusRequest;
import com.mobileshoperp.modules.service.service.RepairService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Repairs")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/repairs")
@RequiredArgsConstructor
public class RepairController {

    private final RepairService repairService;

    @Operation(summary = "List repairs (paginated, optional customer and status filters)")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<RepairResponse>> findAll(
            @RequestParam(required = false) UUID customerId,
            @RequestParam(required = false) RepairStatus status,
            Pageable pageable) {
        return ApiResponse.success(repairService.findAll(customerId, status, pageable));
    }

    @Operation(summary = "Get repair by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<RepairResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(repairService.findById(id));
    }

    @Operation(summary = "Create repair ticket")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<RepairResponse> create(@Valid @RequestBody CreateRepairRequest request) {
        return ApiResponse.success("Repair created", repairService.create(request));
    }

    @Operation(summary = "Update repair details")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<RepairResponse> update(
            @PathVariable UUID id, @Valid @RequestBody UpdateRepairRequest request) {
        return ApiResponse.success("Repair updated", repairService.update(id, request));
    }

    @Operation(summary = "Update repair status")
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<RepairResponse> updateStatus(
            @PathVariable UUID id, @Valid @RequestBody UpdateRepairStatusRequest request) {
        return ApiResponse.success("Repair status updated", repairService.updateStatus(id, request));
    }
}
