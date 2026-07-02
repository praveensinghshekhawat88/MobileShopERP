package com.mobileshoperp.modules.purchase.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.purchase.dto.CreatePurchaseItemRequest;
import com.mobileshoperp.modules.purchase.dto.PurchaseItemResponse;
import com.mobileshoperp.modules.purchase.dto.UpdatePurchaseItemRequest;
import com.mobileshoperp.modules.purchase.service.PurchaseItemService;
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

@Tag(name = "Purchase Items")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/purchases/{purchaseId}/items")
@RequiredArgsConstructor
public class PurchaseItemController {

    private final PurchaseItemService purchaseItemService;

    @Operation(summary = "List line items for a purchase")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<List<PurchaseItemResponse>> findByPurchaseId(@PathVariable UUID purchaseId) {
        return ApiResponse.success(purchaseItemService.findByPurchaseId(purchaseId));
    }

    @Operation(summary = "Get purchase line item by id")
    @GetMapping("/{itemId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<PurchaseItemResponse> findById(
            @PathVariable UUID purchaseId, @PathVariable UUID itemId) {
        return ApiResponse.success(purchaseItemService.findById(purchaseId, itemId));
    }

    @Operation(summary = "Add line item to purchase")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PurchaseItemResponse> create(
            @PathVariable UUID purchaseId, @Valid @RequestBody CreatePurchaseItemRequest request) {
        return ApiResponse.success("Purchase item created", purchaseItemService.create(purchaseId, request));
    }

    @Operation(summary = "Update purchase line item")
    @PutMapping("/{itemId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PurchaseItemResponse> update(
            @PathVariable UUID purchaseId,
            @PathVariable UUID itemId,
            @Valid @RequestBody UpdatePurchaseItemRequest request) {
        return ApiResponse.success("Purchase item updated", purchaseItemService.update(purchaseId, itemId, request));
    }

    @Operation(summary = "Soft delete purchase line item")
    @DeleteMapping("/{itemId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable UUID purchaseId, @PathVariable UUID itemId) {
        purchaseItemService.softDelete(purchaseId, itemId);
        return ApiResponse.success("Purchase item deleted", null);
    }
}
