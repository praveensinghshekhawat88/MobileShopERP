package com.mobileshoperp.modules.sales.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record SaleItemResponse(
        UUID id,
        UUID saleId,
        UUID stockId,
        BigDecimal sellingPrice,
        BigDecimal discount,
        BigDecimal taxAmount,
        BigDecimal lineTotal) {
}
