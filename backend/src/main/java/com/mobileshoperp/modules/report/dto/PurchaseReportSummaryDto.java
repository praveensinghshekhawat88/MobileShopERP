package com.mobileshoperp.modules.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PurchaseReportSummaryDto(
        LocalDate fromDate,
        LocalDate toDate,
        long purchaseCount,
        BigDecimal totalAmount) {}
