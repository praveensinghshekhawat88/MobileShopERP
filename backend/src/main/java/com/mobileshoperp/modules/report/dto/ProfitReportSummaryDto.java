package com.mobileshoperp.modules.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProfitReportSummaryDto(
        LocalDate fromDate,
        LocalDate toDate,
        BigDecimal totalRevenue,
        BigDecimal totalCogs,
        BigDecimal totalExpenses,
        BigDecimal grossProfit,
        BigDecimal netProfit) {}
