package com.mobileshoperp.modules.inventory.repository;

import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.modules.inventory.entity.StockMovement;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockMovementRepository extends JpaRepository<StockMovement, UUID> {

    Page<StockMovement> findByStockIdOrderByCreatedAtDesc(UUID stockId, Pageable pageable);

    Page<StockMovement> findByStockIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            UUID stockId, Instant from, Instant to, Pageable pageable);

    Page<StockMovement> findByCreatedAtBetweenOrderByCreatedAtDesc(
            Instant from, Instant to, Pageable pageable);

    Page<StockMovement> findByReferenceTypeAndReferenceIdOrderByCreatedAtDesc(
            ReferenceType referenceType, UUID referenceId, Pageable pageable);
}
