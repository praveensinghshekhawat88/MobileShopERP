package com.mobileshoperp.modules.purchase.repository;

import com.mobileshoperp.modules.purchase.entity.PurchaseItem;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseItemRepository extends JpaRepository<PurchaseItem, UUID> {

    List<PurchaseItem> findByPurchaseIdOrderByCreatedAtAsc(UUID purchaseId);
}
