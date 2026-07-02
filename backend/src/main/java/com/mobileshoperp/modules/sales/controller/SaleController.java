package com.mobileshoperp.modules.sales.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.sales.dto.CreateSaleRequest;
import com.mobileshoperp.modules.sales.dto.FinalizeSaleRequest;
import com.mobileshoperp.modules.sales.dto.SaleCompletionResponse;
import com.mobileshoperp.modules.sales.dto.SaleResponse;
import com.mobileshoperp.modules.sales.dto.UpdateSaleRequest;
import com.mobileshoperp.modules.sales.service.SaleCancellationService;
import com.mobileshoperp.modules.sales.service.SaleCompletionService;
import com.mobileshoperp.modules.sales.service.SaleService;
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

@Tag(name = "Sales")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;
    private final SaleCompletionService saleCompletionService;
    private final SaleCancellationService saleCancellationService;

    @Operation(summary = "List sales (paginated, optional customer filter)")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<SaleResponse>> findAll(
            @RequestParam(required = false) UUID customerId, Pageable pageable) {
        return ApiResponse.success(saleService.findAll(customerId, pageable));
    }

    @Operation(summary = "Get sale by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<SaleResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(saleService.findById(id));
    }

    @Operation(summary = "Create sale header")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<SaleResponse> create(@Valid @RequestBody CreateSaleRequest request) {
        return ApiResponse.success("Sale created", saleService.create(request));
    }

    @Operation(summary = "Update sale header")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<SaleResponse> update(
            @PathVariable UUID id, @Valid @RequestBody UpdateSaleRequest request) {
        return ApiResponse.success("Sale updated", saleService.update(id, request));
    }

    @Operation(summary = "Finalize sale — mark stock SOLD and record movements")
    @PostMapping("/{id}/finalize")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<SaleCompletionResponse> finalizeSale(
            @PathVariable UUID id, @Valid @RequestBody(required = false) FinalizeSaleRequest request) {
        return ApiResponse.success("Sale finalized", saleCompletionService.finalizeSale(id, request));
    }

    @Operation(summary = "Cancel sale and restore stock when finalized")
    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<SaleCompletionResponse> cancelSale(@PathVariable UUID id) {
        return ApiResponse.success("Sale cancelled", saleCancellationService.cancelSale(id));
    }
}
