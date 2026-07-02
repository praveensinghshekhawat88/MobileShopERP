package com.mobileshoperp.modules.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseSummaryBucketDto(LocalDate periodStart, long expenseCount, BigDecimal totalAmount) {}
