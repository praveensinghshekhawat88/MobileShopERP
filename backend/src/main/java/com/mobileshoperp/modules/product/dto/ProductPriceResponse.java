package com.mobileshoperp.modules.product.dto;

import com.mobileshoperp.common.enums.PriceType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ProductPriceResponse(
        UUID id,
        UUID variantId,
        PriceType priceType,
        BigDecimal price,
        LocalDate effectiveFrom,
        LocalDate effectiveTo,
        boolean active) {
}
