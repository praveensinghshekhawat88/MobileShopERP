package com.mobileshoperp.modules.product.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.product.dto.AttributeValueResponse;
import com.mobileshoperp.modules.product.dto.CreateAttributeValueRequest;
import com.mobileshoperp.modules.product.dto.UpdateAttributeValueRequest;
import com.mobileshoperp.modules.product.service.AttributeValueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Attribute Values")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/attribute-values")
@RequiredArgsConstructor
public class AttributeValueController {

    private final AttributeValueService attributeValueService;

    @Operation(summary = "List active attribute values (paginated, optional attribute filter)")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<AttributeValueResponse>> findAllActive(
            @RequestParam(required = false) Long attributeId, Pageable pageable) {
        return ApiResponse.success(attributeValueService.findAllActive(attributeId, pageable));
    }

    @Operation(summary = "List active values for an attribute ordered by display order")
    @GetMapping("/by-attribute/{attributeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<List<AttributeValueResponse>> findAllActiveByAttributeId(
            @PathVariable Long attributeId) {
        return ApiResponse.success(attributeValueService.findAllActiveByAttributeId(attributeId));
    }

    @Operation(summary = "Get attribute value by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<AttributeValueResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(attributeValueService.findById(id));
    }

    @Operation(summary = "Create attribute value")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AttributeValueResponse> create(@Valid @RequestBody CreateAttributeValueRequest request) {
        return ApiResponse.success("Attribute value created", attributeValueService.create(request));
    }

    @Operation(summary = "Update attribute value")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AttributeValueResponse> update(
            @PathVariable Long id, @Valid @RequestBody UpdateAttributeValueRequest request) {
        return ApiResponse.success("Attribute value updated", attributeValueService.update(id, request));
    }

    @Operation(summary = "Deactivate attribute value")
    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deactivate(@PathVariable Long id) {
        attributeValueService.deactivate(id);
        return ApiResponse.success("Attribute value deactivated", null);
    }
}
