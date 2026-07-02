package com.mobileshoperp.modules.product.repository;

import com.mobileshoperp.modules.product.entity.Attribute;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttributeRepository extends JpaRepository<Attribute, Long> {

    Optional<Attribute> findByAttributeGroupIdAndNameIgnoreCase(Long attributeGroupId, String name);

    Page<Attribute> findByAttributeGroupIdOrderByNameAsc(Long attributeGroupId, Pageable pageable);

    Page<Attribute> findAllByOrderByNameAsc(Pageable pageable);
}
