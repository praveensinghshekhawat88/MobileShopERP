package com.mobileshoperp.modules.inventory.repository;

import com.mobileshoperp.common.enums.StockStatus;
import com.mobileshoperp.modules.inventory.entity.Stock;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<Stock, UUID> {

    boolean existsByPurchaseItemId(UUID purchaseItemId);

    List<Stock> findByPurchaseItemId(UUID purchaseItemId);

    List<Stock> findByPurchaseItemIdIn(List<UUID> purchaseItemIds);

    Optional<Stock> findByImei(String imei);

    Page<Stock> findByVariantIdAndStockStatusOrderByCreatedAtAsc(
            UUID variantId, StockStatus stockStatus, Pageable pageable);

    Page<Stock> findByVariantIdOrderByCreatedAtAsc(UUID variantId, Pageable pageable);

    Page<Stock> findByStockStatusOrderByCreatedAtAsc(StockStatus stockStatus, Pageable pageable);

    Page<Stock> findAllByOrderByCreatedAtAsc(Pageable pageable);
}
