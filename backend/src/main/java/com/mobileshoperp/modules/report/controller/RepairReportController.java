package com.mobileshoperp.modules.report.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.common.enums.RepairStatus;
import com.mobileshoperp.modules.report.dto.RepairReportDto;
import com.mobileshoperp.modules.report.dto.RepairReportSummaryDto;
import com.mobileshoperp.modules.report.service.RepairReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Repair Reports")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/reports/repairs")
@RequiredArgsConstructor
public class RepairReportController {

    private final RepairReportService repairReportService;

    @Operation(summary = "Repair summary: open counts by status and delivered repairs in date range")
    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<RepairReportSummaryDto> getSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        return ApiResponse.success(repairReportService.getSummary(fromDate, toDate));
    }

    @Operation(summary = "Paginated repair list with optional status and date filters")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<RepairReportDto>> findRepairs(
            @RequestParam(required = false) RepairStatus repairStatus,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            Pageable pageable) {
        return ApiResponse.success(repairReportService.findRepairs(repairStatus, fromDate, toDate, pageable));
    }
}
