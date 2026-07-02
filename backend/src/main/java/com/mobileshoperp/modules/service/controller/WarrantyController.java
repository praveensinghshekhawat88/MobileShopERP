package com.mobileshoperp.modules.service.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.service.dto.CreateWarrantyRequest;
import com.mobileshoperp.modules.service.dto.WarrantyResponse;
import com.mobileshoperp.modules.service.service.WarrantyService;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Warranty")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/warranties")
@RequiredArgsConstructor
public class WarrantyController {

    private final WarrantyService warrantyService;

    @Operation(summary = "List warranties (paginated)")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<WarrantyResponse>> findAll(Pageable pageable) {
        return ApiResponse.success(warrantyService.findAll(pageable));
    }

    @Operation(summary = "Get warranty by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<WarrantyResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(warrantyService.findById(id));
    }

    @Operation(summary = "Get warranty by sale item id")
    @GetMapping("/by-sale-item/{saleItemId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<WarrantyResponse> findBySaleItemId(@PathVariable UUID saleItemId) {
        return ApiResponse.success(warrantyService.findBySaleItemId(saleItemId));
    }

    @Operation(summary = "Create warranty for a sold item")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<WarrantyResponse> create(@Valid @RequestBody CreateWarrantyRequest request) {
        return ApiResponse.success("Warranty created", warrantyService.create(request));
    }

    @Operation(summary = "Submit warranty claim")
    @PostMapping("/{id}/claim")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<WarrantyResponse> submitClaim(@PathVariable UUID id) {
        return ApiResponse.success("Warranty claim submitted", warrantyService.submitClaim(id));
    }
}
