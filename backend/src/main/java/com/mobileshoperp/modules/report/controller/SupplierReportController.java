package com.mobileshoperp.modules.report.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.report.dto.SupplierPurchasesReportDto;
import com.mobileshoperp.modules.report.dto.SupplierSummaryReportDto;
import com.mobileshoperp.modules.report.service.SupplierReportService;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Supplier Reports")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/reports/suppliers")
@RequiredArgsConstructor
public class SupplierReportController {

    private final SupplierReportService supplierReportService;

    @Operation(summary = "Supplier spend summary with outstanding payment totals for a date range")
    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<SupplierSummaryReportDto>> findSupplierSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            Pageable pageable) {
        return ApiResponse.success(supplierReportService.findSupplierSummary(fromDate, toDate, pageable));
    }

    @Operation(summary = "Supplier purchase history with payment status for a date range")
    @GetMapping("/{id}/purchases")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<SupplierPurchasesReportDto> getSupplierPurchases(
            @PathVariable UUID id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            Pageable pageable) {
        return ApiResponse.success(supplierReportService.getSupplierPurchases(id, fromDate, toDate, pageable));
    }
}
