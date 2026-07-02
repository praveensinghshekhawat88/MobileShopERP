package com.mobileshoperp.modules.product.repository;

import com.mobileshoperp.common.enums.PriceType;
import com.mobileshoperp.modules.product.entity.ProductPrice;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductPriceRepository extends JpaRepository<ProductPrice, UUID> {

    List<ProductPrice> findByVariantIdOrderByEffectiveFromDescCreatedAtDesc(UUID variantId);

    List<ProductPrice> findByVariantIdAndPriceTypeAndActiveTrue(UUID variantId, PriceType priceType);

    Optional<ProductPrice> findFirstByVariantIdAndPriceTypeAndActiveTrueOrderByEffectiveFromDesc(
            UUID variantId, PriceType priceType);
}
