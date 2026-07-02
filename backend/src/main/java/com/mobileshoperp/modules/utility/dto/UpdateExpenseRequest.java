package com.mobileshoperp.modules.utility.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateExpenseRequest(
        @Size(max = 200) String title,
        @DecimalMin(value = "0.01") BigDecimal amount,
        LocalDate expenseDate,
        String remarks) {
}
