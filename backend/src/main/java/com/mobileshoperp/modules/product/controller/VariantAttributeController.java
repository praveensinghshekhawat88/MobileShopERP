package com.mobileshoperp.modules.product.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.product.dto.CreateVariantAttributeRequest;
import com.mobileshoperp.modules.product.dto.ReplaceVariantAttributesRequest;
import com.mobileshoperp.modules.product.dto.VariantAttributeDetailResponse;
import com.mobileshoperp.modules.product.service.ProductVariantAttributeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
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

@Tag(name = "Variant Attributes")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/variant-attributes")
@RequiredArgsConstructor
public class VariantAttributeController {

    private final ProductVariantAttributeService variantAttributeService;

    @Operation(summary = "List attribute assignments for a variant with resolved labels")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<List<VariantAttributeDetailResponse>> findByVariantId(
            @RequestParam UUID variantId) {
        return ApiResponse.success(variantAttributeService.findByVariantId(variantId));
    }

    @Operation(summary = "Get variant attribute assignment by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<VariantAttributeDetailResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(variantAttributeService.findById(id));
    }

    @Operation(summary = "Assign a single attribute value to a variant")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<VariantAttributeDetailResponse> assign(
            @Valid @RequestBody CreateVariantAttributeRequest request) {
        return ApiResponse.success("Variant attribute assigned", variantAttributeService.assign(request));
    }

    @Operation(summary = "Replace all attribute values for a variant")
    @PutMapping("/replace")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<VariantAttributeDetailResponse>> replace(
            @Valid @RequestBody ReplaceVariantAttributesRequest request) {
        return ApiResponse.success("Variant attributes replaced", variantAttributeService.replace(request));
    }

    @Operation(summary = "Remove an attribute assignment from a variant")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> remove(@PathVariable UUID id) {
        variantAttributeService.remove(id);
        return ApiResponse.success("Variant attribute removed", null);
    }
}
