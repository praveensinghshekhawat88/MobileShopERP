package com.mobileshoperp.modules.sales.repository;

import com.mobileshoperp.modules.sales.entity.SaleItem;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleItemRepository extends JpaRepository<SaleItem, UUID> {

    List<SaleItem> findBySaleIdOrderByCreatedAtAsc(UUID saleId);

    Optional<SaleItem> findByStockId(UUID stockId);
}
