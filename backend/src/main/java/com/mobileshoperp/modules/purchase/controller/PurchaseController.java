package com.mobileshoperp.modules.purchase.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.purchase.dto.CreatePurchaseRequest;
import com.mobileshoperp.modules.purchase.dto.PurchaseResponse;
import com.mobileshoperp.modules.purchase.dto.ReceivePurchaseRequest;
import com.mobileshoperp.modules.purchase.dto.UpdatePurchaseRequest;
import com.mobileshoperp.modules.purchase.service.PurchaseCancelService;
import com.mobileshoperp.modules.purchase.service.PurchaseReceiveService;
import com.mobileshoperp.modules.purchase.service.PurchaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Purchases")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;
    private final PurchaseReceiveService purchaseReceiveService;
    private final PurchaseCancelService purchaseCancelService;

    @Operation(summary = "List purchases (paginated, optional supplier filter)")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<PurchaseResponse>> findAll(
            @RequestParam(required = false) UUID supplierId, Pageable pageable) {
        return ApiResponse.success(purchaseService.findAll(supplierId, pageable));
    }

    @Operation(summary = "Get purchase by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<PurchaseResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(purchaseService.findById(id));
    }

    @Operation(summary = "Create purchase header")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PurchaseResponse> create(@Valid @RequestBody CreatePurchaseRequest request) {
        return ApiResponse.success("Purchase created", purchaseService.create(request));
    }

    @Operation(summary = "Update purchase header")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PurchaseResponse> update(
            @PathVariable UUID id, @Valid @RequestBody UpdatePurchaseRequest request) {
        return ApiResponse.success("Purchase updated", purchaseService.update(id, request));
    }

    @Operation(summary = "Receive purchase and create stock records")
    @PostMapping("/{id}/receive")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PurchaseResponse> receive(
            @PathVariable UUID id, @Valid @RequestBody ReceivePurchaseRequest request) {
        return ApiResponse.success("Purchase received", purchaseReceiveService.receive(id, request));
    }

    @Operation(summary = "Cancel purchase and reverse stock")
    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PurchaseResponse> cancel(@PathVariable UUID id) {
        return ApiResponse.success("Purchase cancelled", purchaseCancelService.cancel(id));
    }
}
