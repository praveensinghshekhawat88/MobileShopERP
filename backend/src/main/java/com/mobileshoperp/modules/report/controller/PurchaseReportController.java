package com.mobileshoperp.modules.report.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.modules.report.dto.PurchaseBySupplierReportDto;
import com.mobileshoperp.modules.report.dto.PurchaseReportDto;
import com.mobileshoperp.modules.report.dto.PurchaseReportSummaryDto;
import com.mobileshoperp.modules.report.service.PurchaseReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
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

@Tag(name = "Purchase Reports")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/reports/purchases")
@RequiredArgsConstructor
public class PurchaseReportController {

    private final PurchaseReportService purchaseReportService;

    @Operation(summary = "Purchase summary for a date range")
    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<PurchaseReportSummaryDto> getSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        return ApiResponse.success(purchaseReportService.getSummary(fromDate, toDate));
    }

    @Operation(summary = "Paginated purchase report with date and optional filters")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<PurchaseReportDto>> findPurchases(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) UUID supplierId,
            @RequestParam(required = false) PaymentStatus paymentStatus,
            Pageable pageable) {
        return ApiResponse.success(
                purchaseReportService.findPurchases(fromDate, toDate, supplierId, paymentStatus, pageable));
    }

    @Operation(summary = "Purchases grouped by supplier for a date range")
    @GetMapping("/by-supplier")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<PurchaseBySupplierReportDto>> findPurchasesBySupplier(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            Pageable pageable) {
        return ApiResponse.success(purchaseReportService.findPurchasesBySupplier(fromDate, toDate, pageable));
    }
}
