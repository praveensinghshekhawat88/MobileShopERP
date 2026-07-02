package com.mobileshoperp.modules.business.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.business.dto.CreateSupplierRequest;
import com.mobileshoperp.modules.business.dto.SupplierResponse;
import com.mobileshoperp.modules.business.dto.UpdateSupplierRequest;
import com.mobileshoperp.modules.business.service.SupplierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Suppliers")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @Operation(summary = "List suppliers (paginated, optional name or mobile search)")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<SupplierResponse>> findAll(
            @RequestParam(required = false) String supplierName,
            @RequestParam(required = false) String mobile,
            Pageable pageable) {
        return ApiResponse.success(supplierService.findAll(supplierName, mobile, pageable));
    }

    @Operation(summary = "Get supplier by exact mobile number")
    @GetMapping("/by-mobile/{mobile}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<SupplierResponse> findByMobile(@PathVariable String mobile) {
        return ApiResponse.success(supplierService.findByMobile(mobile));
    }

    @Operation(summary = "Get supplier by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<SupplierResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(supplierService.findById(id));
    }

    @Operation(summary = "Create supplier")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<SupplierResponse> create(@Valid @RequestBody CreateSupplierRequest request) {
        return ApiResponse.success("Supplier created", supplierService.create(request));
    }

    @Operation(summary = "Update supplier")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<SupplierResponse> update(
            @PathVariable UUID id, @Valid @RequestBody UpdateSupplierRequest request) {
        return ApiResponse.success("Supplier updated", supplierService.update(id, request));
    }

    @Operation(summary = "Soft delete supplier")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        supplierService.softDelete(id);
        return ApiResponse.success("Supplier deleted", null);
    }
}
