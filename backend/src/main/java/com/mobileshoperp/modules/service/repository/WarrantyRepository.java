package com.mobileshoperp.modules.service.repository;

import com.mobileshoperp.modules.service.entity.Warranty;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarrantyRepository extends JpaRepository<Warranty, UUID> {

    Optional<Warranty> findBySaleItemId(UUID saleItemId);

    Page<Warranty> findAllByOrderByStartDateDesc(Pageable pageable);
}
