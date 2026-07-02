package com.mobileshoperp.modules.product.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.product.dto.CreateProductImageRequest;
import com.mobileshoperp.modules.product.dto.ProductImageResponse;
import com.mobileshoperp.modules.product.dto.UpdateProductImageRequest;
import com.mobileshoperp.modules.product.service.ProductImageService;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Variant Images")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/variants/{variantId}/images")
@RequiredArgsConstructor
public class ProductImageController {

    private final ProductImageService productImageService;

    @Operation(summary = "List images for a variant ordered by display order")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<List<ProductImageResponse>> findByVariantId(@PathVariable UUID variantId) {
        return ApiResponse.success(productImageService.findByVariantId(variantId));
    }

    @Operation(summary = "Get variant image by id")
    @GetMapping("/{imageId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<ProductImageResponse> findById(
            @PathVariable UUID variantId, @PathVariable UUID imageId) {
        return ApiResponse.success(productImageService.findById(variantId, imageId));
    }

    @Operation(summary = "Add image URL to a variant")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductImageResponse> create(
            @PathVariable UUID variantId, @Valid @RequestBody CreateProductImageRequest request) {
        return ApiResponse.success("Product image created", productImageService.create(variantId, request));
    }

    @Operation(summary = "Update variant image metadata")
    @PutMapping("/{imageId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductImageResponse> update(
            @PathVariable UUID variantId,
            @PathVariable UUID imageId,
            @Valid @RequestBody UpdateProductImageRequest request) {
        return ApiResponse.success("Product image updated", productImageService.update(variantId, imageId, request));
    }

    @Operation(summary = "Soft delete variant image")
    @DeleteMapping("/{imageId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable UUID variantId, @PathVariable UUID imageId) {
        productImageService.softDelete(variantId, imageId);
        return ApiResponse.success("Product image deleted", null);
    }
}
