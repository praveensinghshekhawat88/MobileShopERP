package com.mobileshoperp.modules.report.dto;

import java.time.LocalDate;

public record WarrantyReportSummaryDto(
        LocalDate asOfDate,
        int daysWithin,
        long activeCount,
        long expiredCount,
        long expiringSoonCount) {}
