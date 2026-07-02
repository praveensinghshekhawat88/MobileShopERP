package com.mobileshoperp.modules.product.entity;

import com.mobileshoperp.common.entity.BaseUuidEntity;
import com.mobileshoperp.common.enums.PriceType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product_prices")
public class ProductPrice extends BaseUuidEntity {

    @Column(name = "variant_id", nullable = false)
    private UUID variantId;

    @Enumerated(EnumType.STRING)
    @Column(name = "price_type", nullable = false, length = 30)
    private PriceType priceType;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;
}
