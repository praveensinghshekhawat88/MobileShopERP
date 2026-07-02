package com.mobileshoperp.modules.report.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.report.dto.ExpenseReportDto;
import com.mobileshoperp.modules.report.dto.ExpenseReportSummaryDto;
import com.mobileshoperp.modules.report.dto.ExpenseSummaryGroupBy;
import com.mobileshoperp.modules.report.service.ExpenseReportService;
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

@Tag(name = "Expense Reports")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/reports/expenses")
@RequiredArgsConstructor
public class ExpenseReportController {

    private final ExpenseReportService expenseReportService;

    @Operation(summary = "Expense summary with daily or monthly buckets for a date range")
    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<ExpenseReportSummaryDto> getSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "DAY") ExpenseSummaryGroupBy groupBy) {
        return ApiResponse.success(expenseReportService.getSummary(fromDate, toDate, groupBy));
    }

    @Operation(summary = "Paginated expense list with optional date range and title/category filter")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<ExpenseReportDto>> findExpenses(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) String category,
            Pageable pageable) {
        return ApiResponse.success(expenseReportService.findExpenses(fromDate, toDate, category, pageable));
    }
}
