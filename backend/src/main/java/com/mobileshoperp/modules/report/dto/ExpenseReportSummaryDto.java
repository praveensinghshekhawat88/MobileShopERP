package com.mobileshoperp.modules.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ExpenseReportSummaryDto(
        LocalDate fromDate,
        LocalDate toDate,
        ExpenseSummaryGroupBy groupBy,
        long totalExpenseCount,
        BigDecimal totalAmount,
        List<ExpenseSummaryBucketDto> buckets) {}
