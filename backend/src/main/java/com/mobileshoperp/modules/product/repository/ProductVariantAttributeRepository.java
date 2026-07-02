package com.mobileshoperp.modules.product.repository;

import com.mobileshoperp.modules.product.entity.ProductVariantAttribute;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductVariantAttributeRepository extends JpaRepository<ProductVariantAttribute, UUID> {

    List<ProductVariantAttribute> findByVariantIdOrderByCreatedAtAsc(UUID variantId);

    Optional<ProductVariantAttribute> findByVariantIdAndAttributeValueId(UUID variantId, Long attributeValueId);

    @Modifying
    @Query("DELETE FROM ProductVariantAttribute pva WHERE pva.variantId = :variantId")
    void deleteAllByVariantId(@Param("variantId") UUID variantId);
}
