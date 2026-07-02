package com.mobileshoperp.modules.report.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.report.dto.CustomerHistoryReportDto;
import com.mobileshoperp.modules.report.dto.TopCustomerReportDto;
import com.mobileshoperp.modules.report.service.CustomerReportService;
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

@Tag(name = "Customer Reports")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/reports/customers")
@RequiredArgsConstructor
public class CustomerReportController {

    private final CustomerReportService customerReportService;

    @Operation(summary = "Top customers by revenue (optional date range)")
    @GetMapping("/top")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<TopCustomerReportDto>> findTopCustomers(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            Pageable pageable) {
        return ApiResponse.success(customerReportService.findTopCustomers(fromDate, toDate, pageable));
    }

    @Operation(summary = "Customer purchase history ledger for a date range")
    @GetMapping("/{id}/history")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<CustomerHistoryReportDto> getCustomerHistory(
            @PathVariable UUID id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            Pageable pageable) {
        return ApiResponse.success(customerReportService.getCustomerHistory(id, fromDate, toDate, pageable));
    }
}
