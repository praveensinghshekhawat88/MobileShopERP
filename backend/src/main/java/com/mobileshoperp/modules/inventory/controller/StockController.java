package com.mobileshoperp.modules.inventory.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.common.enums.StockStatus;
import com.mobileshoperp.modules.inventory.dto.StockResponse;
import com.mobileshoperp.modules.inventory.dto.StockStatusUpdateRequest;
import com.mobileshoperp.modules.inventory.dto.UpdateStockRequest;
import com.mobileshoperp.modules.inventory.service.StockService;
import com.mobileshoperp.modules.inventory.service.StockStatusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Stock")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;
    private final StockStatusService stockStatusService;

    @Operation(summary = "List stock units (paginated, optional variant and status filters)")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<StockResponse>> findAll(
            @RequestParam(required = false) UUID variantId,
            @RequestParam(required = false) StockStatus status,
            Pageable pageable) {
        return ApiResponse.success(stockService.findAll(variantId, status, pageable));
    }

    @Operation(summary = "Get stock by IMEI")
    @GetMapping("/by-imei/{imei}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<StockResponse> findByImei(@PathVariable String imei) {
        return ApiResponse.success(stockService.findByImei(imei));
    }

    @Operation(summary = "Get stock by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<StockResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(stockService.findById(id));
    }

    @Operation(summary = "Update stock metadata (IMEI, serial number)")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<StockResponse> update(
            @PathVariable UUID id, @Valid @RequestBody UpdateStockRequest request) {
        return ApiResponse.success("Stock updated", stockService.update(id, request));
    }

    @Operation(summary = "Update stock status via lifecycle rules")
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<StockResponse> updateStatus(
            @PathVariable UUID id, @Valid @RequestBody StockStatusUpdateRequest request) {
        return ApiResponse.success("Stock status updated", stockStatusService.updateStatus(id, request));
    }
}
