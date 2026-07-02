package com.mobileshoperp.modules.product.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.product.dto.AttributeResponse;
import com.mobileshoperp.modules.product.dto.CreateAttributeRequest;
import com.mobileshoperp.modules.product.dto.UpdateAttributeRequest;
import com.mobileshoperp.modules.product.service.AttributeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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

@Tag(name = "Attributes")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/attributes")
@RequiredArgsConstructor
public class AttributeController {

    private final AttributeService attributeService;

    @Operation(summary = "List attributes (paginated, optional group filter)")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<AttributeResponse>> findAll(
            @RequestParam(required = false) Long attributeGroupId, Pageable pageable) {
        return ApiResponse.success(attributeService.findAll(attributeGroupId, pageable));
    }

    @Operation(summary = "Get attribute by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<AttributeResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(attributeService.findById(id));
    }

    @Operation(summary = "Create attribute")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AttributeResponse> create(@Valid @RequestBody CreateAttributeRequest request) {
        return ApiResponse.success("Attribute created", attributeService.create(request));
    }

    @Operation(summary = "Update attribute")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AttributeResponse> update(
            @PathVariable Long id, @Valid @RequestBody UpdateAttributeRequest request) {
        return ApiResponse.success("Attribute updated", attributeService.update(id, request));
    }

    @Operation(summary = "Delete attribute")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        attributeService.delete(id);
        return ApiResponse.success("Attribute deleted", null);
    }
}
