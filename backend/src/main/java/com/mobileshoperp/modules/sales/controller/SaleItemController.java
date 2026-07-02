package com.mobileshoperp.modules.sales.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.sales.dto.CreateSaleItemRequest;
import com.mobileshoperp.modules.sales.dto.SaleItemResponse;
import com.mobileshoperp.modules.sales.dto.UpdateSaleItemRequest;
import com.mobileshoperp.modules.sales.service.SaleItemService;
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

@Tag(name = "Sale Items")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/sales/{saleId}/items")
@RequiredArgsConstructor
public class SaleItemController {

    private final SaleItemService saleItemService;

    @Operation(summary = "List line items for a sale")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<List<SaleItemResponse>> findBySaleId(@PathVariable UUID saleId) {
        return ApiResponse.success(saleItemService.findBySaleId(saleId));
    }

    @Operation(summary = "Get sale line item by id")
    @GetMapping("/{itemId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<SaleItemResponse> findById(@PathVariable UUID saleId, @PathVariable UUID itemId) {
        return ApiResponse.success(saleItemService.findById(saleId, itemId));
    }

    @Operation(summary = "Add stock unit to sale")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<SaleItemResponse> create(
            @PathVariable UUID saleId, @Valid @RequestBody CreateSaleItemRequest request) {
        return ApiResponse.success("Sale item created", saleItemService.create(saleId, request));
    }

    @Operation(summary = "Update sale line item")
    @PutMapping("/{itemId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<SaleItemResponse> update(
            @PathVariable UUID saleId,
            @PathVariable UUID itemId,
            @Valid @RequestBody UpdateSaleItemRequest request) {
        return ApiResponse.success("Sale item updated", saleItemService.update(saleId, itemId, request));
    }

    @Operation(summary = "Remove line item from sale")
    @DeleteMapping("/{itemId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Void> delete(@PathVariable UUID saleId, @PathVariable UUID itemId) {
        saleItemService.softDelete(saleId, itemId);
        return ApiResponse.success("Sale item deleted", null);
    }
}
