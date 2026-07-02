package com.mobileshoperp.modules.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ExpenseReportDto(
        UUID id, String title, BigDecimal amount, LocalDate expenseDate, String remarks) {}
