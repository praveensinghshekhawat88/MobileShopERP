package com.mobileshoperp.modules.report.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.modules.report.dto.SalesByCustomerReportDto;
import com.mobileshoperp.modules.report.dto.SalesReportDto;
import com.mobileshoperp.modules.report.dto.SalesReportSummaryDto;
import com.mobileshoperp.modules.report.service.SalesReportService;
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

@Tag(name = "Sales Reports")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/reports/sales")
@RequiredArgsConstructor
public class SalesReportController {

    private final SalesReportService salesReportService;

    @Operation(summary = "Sales summary for a date range")
    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<SalesReportSummaryDto> getSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        return ApiResponse.success(salesReportService.getSummary(fromDate, toDate));
    }

    @Operation(summary = "Paginated sales report with date and optional filters")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<SalesReportDto>> findSales(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) UUID customerId,
            @RequestParam(required = false) PaymentStatus paymentStatus,
            Pageable pageable) {
        return ApiResponse.success(
                salesReportService.findSales(fromDate, toDate, customerId, paymentStatus, pageable));
    }

    @Operation(summary = "Sales grouped by customer for a date range")
    @GetMapping("/by-customer")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<SalesByCustomerReportDto>> findSalesByCustomer(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            Pageable pageable) {
        return ApiResponse.success(salesReportService.findSalesByCustomer(fromDate, toDate, pageable));
    }
}
