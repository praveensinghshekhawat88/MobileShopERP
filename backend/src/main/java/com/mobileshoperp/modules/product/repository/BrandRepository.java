package com.mobileshoperp.modules.product.repository;

import com.mobileshoperp.modules.product.entity.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, Long> {

    boolean existsByNameIgnoreCase(String name);

    Page<Brand> findByActiveTrue(Pageable pageable);
}
