package com.mobileshoperp.modules.business.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.business.dto.CreateCustomerRequest;
import com.mobileshoperp.modules.business.dto.CustomerResponse;
import com.mobileshoperp.modules.business.dto.UpdateCustomerRequest;
import com.mobileshoperp.modules.business.service.CustomerService;
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

@Tag(name = "Customers")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @Operation(summary = "List customers (paginated, optional name or mobile search)")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<CustomerResponse>> findAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String mobile,
            Pageable pageable) {
        return ApiResponse.success(customerService.findAll(name, mobile, pageable));
    }

    @Operation(summary = "Get customer by exact mobile number")
    @GetMapping("/by-mobile/{mobile}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<CustomerResponse> findByMobile(@PathVariable String mobile) {
        return ApiResponse.success(customerService.findByMobile(mobile));
    }

    @Operation(summary = "Get customer by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<CustomerResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(customerService.findById(id));
    }

    @Operation(summary = "Create customer")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<CustomerResponse> create(@Valid @RequestBody CreateCustomerRequest request) {
        return ApiResponse.success("Customer created", customerService.create(request));
    }

    @Operation(summary = "Update customer")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<CustomerResponse> update(
            @PathVariable UUID id, @Valid @RequestBody UpdateCustomerRequest request) {
        return ApiResponse.success("Customer updated", customerService.update(id, request));
    }

    @Operation(summary = "Soft delete customer")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        customerService.softDelete(id);
        return ApiResponse.success("Customer deleted", null);
    }
}
