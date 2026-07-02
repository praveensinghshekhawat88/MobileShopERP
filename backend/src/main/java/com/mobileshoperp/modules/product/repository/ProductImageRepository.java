package com.mobileshoperp.modules.product.repository;

import com.mobileshoperp.modules.product.entity.ProductImage;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, UUID> {

    List<ProductImage> findByVariantIdOrderByDisplayOrderAscCreatedAtAsc(UUID variantId);
}
