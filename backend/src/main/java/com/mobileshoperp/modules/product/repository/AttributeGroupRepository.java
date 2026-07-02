package com.mobileshoperp.modules.product.repository;

import com.mobileshoperp.modules.product.entity.AttributeGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttributeGroupRepository extends JpaRepository<AttributeGroup, Long> {

    boolean existsByNameIgnoreCase(String name);

    Page<AttributeGroup> findAllByOrderByNameAsc(Pageable pageable);
}
