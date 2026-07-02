package com.mobileshoperp.modules.purchase.service;

import com.mobileshoperp.common.enums.MovementType;
import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.common.enums.StockStatus;
import com.mobileshoperp.modules.inventory.entity.Stock;
import com.mobileshoperp.modules.inventory.repository.StockRepository;
import com.mobileshoperp.modules.inventory.service.StockMovementService;
import com.mobileshoperp.modules.purchase.dto.PurchaseResponse;
import com.mobileshoperp.modules.purchase.entity.Purchase;
import com.mobileshoperp.modules.purchase.entity.PurchaseItem;
import com.mobileshoperp.modules.purchase.exception.PurchaseCannotBeCancelledException;
import com.mobileshoperp.modules.purchase.mapper.PurchaseMapper;
import com.mobileshoperp.modules.purchase.repository.PurchaseItemRepository;
import com.mobileshoperp.modules.purchase.repository.PurchaseRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseCancelService {

    private final PurchaseRepository purchaseRepository;
    private final PurchaseItemRepository purchaseItemRepository;
    private final StockRepository stockRepository;
    private final StockMovementService stockMovementService;
    private final PurchaseService purchaseService;
    private final PurchaseMapper purchaseMapper;

    public PurchaseResponse cancel(UUID purchaseId) {
        Purchase purchase = purchaseService.getPurchaseOrThrow(purchaseId);
        if (purchase.getPaymentStatus() == PaymentStatus.CANCELLED) {
            throw new PurchaseCannotBeCancelledException(purchaseId, "Purchase is already cancelled");
        }

        List<PurchaseItem> items = purchaseItemRepository.findByPurchaseIdOrderByCreatedAtAsc(purchaseId);
        List<UUID> itemIds = items.stream().map(PurchaseItem::getId).toList();
        List<Stock> stockRecords = stockRepository.findByPurchaseItemIdIn(itemIds);

        if (stockRecords.isEmpty()) {
            throw new PurchaseCannotBeCancelledException(purchaseId, "Purchase has not been received");
        }

        for (Stock stock : stockRecords) {
            if (stock.getStockStatus() == StockStatus.SOLD) {
                throw new PurchaseCannotBeCancelledException(purchaseId, "Stock has already been sold");
            }
        }

        Instant deletedAt = Instant.now();
        for (Stock stock : stockRecords) {
            stockMovementService.recordMovement(
                    stock.getId(),
                    ReferenceType.PURCHASE,
                    purchaseId,
                    MovementType.ADJUSTMENT,
                    "Purchase cancelled");
            stock.setDeletedAt(deletedAt);
            stockRepository.save(stock);
        }

        purchase.setPaymentStatus(PaymentStatus.CANCELLED);
        return purchaseMapper.toResponse(purchaseRepository.save(purchase));
    }
}
