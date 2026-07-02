package com.mobileshoperp.modules.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record SalesReportSummaryDto(
        LocalDate fromDate,
        LocalDate toDate,
        long saleCount,
        BigDecimal totalAmount) {}
