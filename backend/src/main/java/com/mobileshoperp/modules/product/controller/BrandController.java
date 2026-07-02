package com.mobileshoperp.modules.product.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.product.dto.BrandResponse;
import com.mobileshoperp.modules.product.dto.CreateBrandRequest;
import com.mobileshoperp.modules.product.dto.UpdateBrandRequest;
import com.mobileshoperp.modules.product.service.BrandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

@Tag(name = "Brands")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    @Operation(summary = "List active brands (paginated)")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<BrandResponse>> findAllActive(Pageable pageable) {
        return ApiResponse.success(brandService.findAllActive(pageable));
    }

    @Operation(summary = "Get brand by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<BrandResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(brandService.findById(id));
    }

    @Operation(summary = "Create brand")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<BrandResponse> create(@Valid @RequestBody CreateBrandRequest request) {
        return ApiResponse.success("Brand created", brandService.create(request));
    }

    @Operation(summary = "Update brand")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<BrandResponse> update(
            @PathVariable Long id, @Valid @RequestBody UpdateBrandRequest request) {
        return ApiResponse.success("Brand updated", brandService.update(id, request));
    }

    @Operation(summary = "Deactivate brand")
    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deactivate(@PathVariable Long id) {
        brandService.deactivate(id);
        return ApiResponse.success("Brand deactivated", null);
    }
}
