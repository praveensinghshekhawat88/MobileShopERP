package com.mobileshoperp.modules.report.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.common.enums.ClaimStatus;
import com.mobileshoperp.modules.report.dto.WarrantyReportDto;
import com.mobileshoperp.modules.report.dto.WarrantyReportSummaryDto;
import com.mobileshoperp.modules.report.service.WarrantyReportService;
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

@Tag(name = "Warranty Reports")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/reports/warranty")
@RequiredArgsConstructor
public class WarrantyReportController {

    private final WarrantyReportService warrantyReportService;

    @Operation(summary = "Warranty counts: active, expired, and expiring within N days")
    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<WarrantyReportSummaryDto> getSummary(
            @RequestParam(defaultValue = "30") int daysWithin) {
        return ApiResponse.success(warrantyReportService.getSummary(daysWithin));
    }

    @Operation(summary = "Paginated warranty list with optional status, customer, sale, and end-date filters")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<WarrantyReportDto>> findWarranties(
            @RequestParam(required = false) ClaimStatus claimStatus,
            @RequestParam(required = false) UUID customerId,
            @RequestParam(required = false) UUID saleId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            Pageable pageable) {
        return ApiResponse.success(
                warrantyReportService.findWarranties(claimStatus, customerId, saleId, fromDate, toDate, pageable));
    }
}
