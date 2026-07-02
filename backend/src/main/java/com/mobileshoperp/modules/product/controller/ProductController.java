package com.mobileshoperp.modules.product.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.product.dto.CreateProductRequest;
import com.mobileshoperp.modules.product.dto.ProductResponse;
import com.mobileshoperp.modules.product.dto.UpdateProductRequest;
import com.mobileshoperp.modules.product.service.ProductService;
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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Products")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "List active products (paginated, optional brand/category filters)")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<ProductResponse>> findAllActive(
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) Long categoryId,
            Pageable pageable) {
        return ApiResponse.success(productService.findAllActive(brandId, categoryId, pageable));
    }

    @Operation(summary = "Get product by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<ProductResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(productService.findById(id));
    }

    @Operation(summary = "Create product")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductResponse> create(@Valid @RequestBody CreateProductRequest request) {
        return ApiResponse.success("Product created", productService.create(request));
    }

    @Operation(summary = "Update product")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductResponse> update(
            @PathVariable UUID id, @Valid @RequestBody UpdateProductRequest request) {
        return ApiResponse.success("Product updated", productService.update(id, request));
    }

    @Operation(summary = "Deactivate product")
    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deactivate(@PathVariable UUID id) {
        productService.deactivate(id);
        return ApiResponse.success("Product deactivated", null);
    }

    @Operation(summary = "Soft delete product")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        productService.softDelete(id);
        return ApiResponse.success("Product deleted", null);
    }
}
