package com.mobileshoperp.modules.product.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.product.dto.CreateProductPriceRequest;
import com.mobileshoperp.modules.product.dto.ProductPriceResponse;
import com.mobileshoperp.modules.product.service.ProductPriceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Product Prices")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/product-prices")
@RequiredArgsConstructor
public class ProductPriceController {

    private final ProductPriceService productPriceService;

    @Operation(summary = "Get price history for a variant")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<List<ProductPriceResponse>> getHistory(@RequestParam UUID variantId) {
        return ApiResponse.success(productPriceService.getHistoryByVariantId(variantId));
    }

    @Operation(summary = "Get active retail price for a variant")
    @GetMapping("/active-retail")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<ProductPriceResponse> getActiveRetailPrice(@RequestParam UUID variantId) {
        return ApiResponse.success(productPriceService.getActiveRetailPrice(variantId));
    }

    @Operation(summary = "Get product price by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<ProductPriceResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(productPriceService.findById(id));
    }

    @Operation(summary = "Create a new price record (append-only; never updates history)")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductPriceResponse> create(@Valid @RequestBody CreateProductPriceRequest request) {
        return ApiResponse.success("Product price created", productPriceService.create(request));
    }
}
