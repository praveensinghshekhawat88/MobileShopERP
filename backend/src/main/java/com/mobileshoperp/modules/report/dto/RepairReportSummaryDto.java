package com.mobileshoperp.modules.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record RepairReportSummaryDto(
        LocalDate fromDate,
        LocalDate toDate,
        long totalOpenRepairs,
        List<RepairStatusCountDto> openByStatus,
        long deliveredCount,
        BigDecimal totalDeliveredCost) {}
