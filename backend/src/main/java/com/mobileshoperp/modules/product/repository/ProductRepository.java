package com.mobileshoperp.modules.product.repository;

import com.mobileshoperp.modules.product.entity.Product;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    Optional<Product> findByBrandIdAndNameIgnoreCase(Long brandId, String name);

    Page<Product> findByActiveTrueOrderByNameAsc(Pageable pageable);

    Page<Product> findByBrandIdAndActiveTrueOrderByNameAsc(Long brandId, Pageable pageable);

    Page<Product> findByCategoryIdAndActiveTrueOrderByNameAsc(Long categoryId, Pageable pageable);

    Page<Product> findByBrandIdAndCategoryIdAndActiveTrueOrderByNameAsc(
            Long brandId, Long categoryId, Pageable pageable);
}
