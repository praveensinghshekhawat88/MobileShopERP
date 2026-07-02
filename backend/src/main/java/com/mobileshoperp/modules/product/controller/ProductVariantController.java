package com.mobileshoperp.modules.product.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.product.dto.CreateProductVariantRequest;
import com.mobileshoperp.modules.product.dto.ProductVariantResponse;
import com.mobileshoperp.modules.product.dto.UpdateProductVariantRequest;
import com.mobileshoperp.modules.product.service.ProductVariantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
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

@Tag(name = "Product Variants")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/product-variants")
@RequiredArgsConstructor
public class ProductVariantController {

    private final ProductVariantService productVariantService;

    @Operation(summary = "List active product variants (paginated, optional product filter)")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<ProductVariantResponse>> findAllActive(
            @RequestParam(required = false) UUID productId, Pageable pageable) {
        return ApiResponse.success(productVariantService.findAllActive(productId, pageable));
    }

    @Operation(summary = "List active variants for a product")
    @GetMapping("/by-product/{productId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<List<ProductVariantResponse>> findAllActiveByProductId(@PathVariable UUID productId) {
        return ApiResponse.success(productVariantService.findAllActiveByProductId(productId));
    }

    @Operation(summary = "Get product variant by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<ProductVariantResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(productVariantService.findById(id));
    }

    @Operation(summary = "Create product variant")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductVariantResponse> create(@Valid @RequestBody CreateProductVariantRequest request) {
        return ApiResponse.success("Product variant created", productVariantService.create(request));
    }

    @Operation(summary = "Update product variant")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductVariantResponse> update(
            @PathVariable UUID id, @Valid @RequestBody UpdateProductVariantRequest request) {
        return ApiResponse.success("Product variant updated", productVariantService.update(id, request));
    }

    @Operation(summary = "Deactivate product variant")
    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deactivate(@PathVariable UUID id) {
        productVariantService.deactivate(id);
        return ApiResponse.success("Product variant deactivated", null);
    }

    @Operation(summary = "Soft delete product variant")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        productVariantService.softDelete(id);
        return ApiResponse.success("Product variant deleted", null);
    }
}
