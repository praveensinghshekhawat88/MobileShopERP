package com.mobileshoperp.modules.sales.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record CreateSaleItemRequest(
        @NotNull UUID stockId,
        @DecimalMin(value = "0.01") BigDecimal sellingPrice,
        @DecimalMin(value = "0.0") BigDecimal discount,
        @DecimalMin(value = "0.0") BigDecimal taxAmount) {
}
