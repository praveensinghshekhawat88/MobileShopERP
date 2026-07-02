package com.mobileshoperp.modules.sales.dto;

import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;

public record UpdateSaleItemRequest(
        @DecimalMin(value = "0.01") BigDecimal sellingPrice,
        @DecimalMin(value = "0.0") BigDecimal discount,
        @DecimalMin(value = "0.0") BigDecimal taxAmount) {
}
