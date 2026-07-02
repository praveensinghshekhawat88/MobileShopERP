package com.mobileshoperp.modules.utility.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ExpenseResponse(
        UUID id, String title, BigDecimal amount, LocalDate expenseDate, String remarks) {
}
