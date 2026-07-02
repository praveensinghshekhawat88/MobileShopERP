package com.mobileshoperp.modules.report.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.common.enums.MovementType;
import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.common.enums.StockStatus;
import com.mobileshoperp.modules.report.dto.LowStockReportDto;
import com.mobileshoperp.modules.report.dto.StockMovementReportDto;
import com.mobileshoperp.modules.report.dto.StockSnapshotReportDto;
import com.mobileshoperp.modules.report.dto.StockUnitReportDto;
import com.mobileshoperp.modules.report.service.InventoryReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Inventory Reports")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/reports/stock")
@RequiredArgsConstructor
public class InventoryReportController {

    private final InventoryReportService inventoryReportService;

    @Operation(summary = "Current stock snapshot grouped by variant and status")
    @GetMapping(value = "/current", params = "!imei")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<StockSnapshotReportDto>> findCurrentSnapshot(
            @RequestParam(required = false) UUID variantId,
            @RequestParam(required = false) StockStatus stockStatus,
            Pageable pageable) {
        return ApiResponse.success(inventoryReportService.findCurrentSnapshot(variantId, stockStatus, pageable));
    }

    @Operation(summary = "Search current stock units by IMEI (detail view)")
    @GetMapping(value = "/current", params = "imei")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<StockUnitReportDto>> findCurrentByImei(
            @RequestParam String imei, Pageable pageable) {
        return ApiResponse.success(inventoryReportService.findCurrentByImei(imei, pageable));
    }

    @Operation(summary = "Stock movement history with optional filters (includes IMEI)")
    @GetMapping("/movements")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<StockMovementReportDto>> findMovements(
            @RequestParam(required = false) UUID stockId,
            @RequestParam(required = false) UUID variantId,
            @RequestParam(required = false) String imei,
            @RequestParam(required = false) ReferenceType referenceType,
            @RequestParam(required = false) UUID referenceId,
            @RequestParam(required = false) MovementType movementType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            Pageable pageable) {
        return ApiResponse.success(inventoryReportService.findMovements(
                stockId, variantId, imei, referenceType, referenceId, movementType, from, to, pageable));
    }

    @Operation(summary = "Variants with available stock at or below threshold")
    @GetMapping("/low")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<LowStockReportDto>> findLowStock(
            @RequestParam(defaultValue = "5") int threshold, Pageable pageable) {
        return ApiResponse.success(inventoryReportService.findLowStock(threshold, pageable));
    }
}
