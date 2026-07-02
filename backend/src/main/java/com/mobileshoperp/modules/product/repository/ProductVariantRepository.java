package com.mobileshoperp.modules.product.repository;

import com.mobileshoperp.modules.product.entity.ProductVariant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, UUID> {

    Optional<ProductVariant> findBySkuIgnoreCase(String sku);

    Optional<ProductVariant> findByBarcodeIgnoreCase(String barcode);

    Page<ProductVariant> findByActiveTrueOrderBySkuAsc(Pageable pageable);

    Page<ProductVariant> findByProductIdAndActiveTrueOrderBySkuAsc(UUID productId, Pageable pageable);

    List<ProductVariant> findByProductIdAndActiveTrueOrderBySkuAsc(UUID productId);
}
