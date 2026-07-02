package com.mobileshoperp.modules.product.repository;

import com.mobileshoperp.modules.product.entity.AttributeValue;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttributeValueRepository extends JpaRepository<AttributeValue, Long> {

    Optional<AttributeValue> findByAttributeIdAndValueIgnoreCase(Long attributeId, String value);

    Page<AttributeValue> findByAttributeIdAndActiveTrueOrderByDisplayOrderAscValueAsc(
            Long attributeId, Pageable pageable);

    Page<AttributeValue> findByActiveTrueOrderByDisplayOrderAscValueAsc(Pageable pageable);

    List<AttributeValue> findByAttributeIdAndActiveTrueOrderByDisplayOrderAscValueAsc(Long attributeId);
}
