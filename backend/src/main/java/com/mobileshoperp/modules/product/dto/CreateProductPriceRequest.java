package com.mobileshoperp.modules.product.dto;

import com.mobileshoperp.common.enums.PriceType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreateProductPriceRequest(
        @NotNull UUID variantId,
        @NotNull PriceType priceType,
        @NotNull @Positive BigDecimal price,
        @NotNull LocalDate effectiveFrom,
        LocalDate effectiveTo,
        Boolean active) {
}
