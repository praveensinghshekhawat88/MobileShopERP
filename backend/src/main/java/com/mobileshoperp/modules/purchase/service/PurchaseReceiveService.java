package com.mobileshoperp.modules.purchase.service;

import com.mobileshoperp.common.enums.MovementType;
import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.common.enums.StockStatus;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.inventory.entity.Stock;
import com.mobileshoperp.modules.inventory.repository.StockRepository;
import com.mobileshoperp.modules.inventory.service.StockMovementService;
import com.mobileshoperp.modules.purchase.dto.PurchaseResponse;
import com.mobileshoperp.modules.purchase.dto.ReceivePurchaseLineRequest;
import com.mobileshoperp.modules.purchase.dto.ReceivePurchaseRequest;
import com.mobileshoperp.modules.purchase.entity.Purchase;
import com.mobileshoperp.modules.purchase.entity.PurchaseItem;
import com.mobileshoperp.modules.purchase.exception.PurchaseAlreadyReceivedException;
import com.mobileshoperp.modules.purchase.mapper.PurchaseMapper;
import com.mobileshoperp.modules.purchase.repository.PurchaseItemRepository;
import com.mobileshoperp.modules.purchase.repository.PurchaseRepository;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseReceiveService {

    private final PurchaseRepository purchaseRepository;
    private final PurchaseItemRepository purchaseItemRepository;
    private final StockRepository stockRepository;
    private final StockMovementService stockMovementService;
    private final PurchaseService purchaseService;
    private final PurchaseMapper purchaseMapper;

    public PurchaseResponse receive(UUID purchaseId, ReceivePurchaseRequest request) {
        Purchase purchase = purchaseService.getPurchaseOrThrow(purchaseId);
        if (purchase.getPaymentStatus() == PaymentStatus.CANCELLED) {
            throw new BusinessRuleException("Cancelled purchase cannot be received");
        }

        List<PurchaseItem> items = purchaseItemRepository.findByPurchaseIdOrderByCreatedAtAsc(purchaseId);
        if (items.isEmpty()) {
            throw new BusinessRuleException("Purchase has no line items to receive");
        }
        if (items.stream().anyMatch(item -> stockRepository.existsByPurchaseItemId(item.getId()))) {
            throw new PurchaseAlreadyReceivedException(purchaseId);
        }

        Map<UUID, ReceivePurchaseLineRequest> linesByItemId = request.lines().stream()
                .collect(Collectors.toMap(ReceivePurchaseLineRequest::purchaseItemId, Function.identity()));
        if (linesByItemId.size() != items.size()
                || items.stream().anyMatch(item -> !linesByItemId.containsKey(item.getId()))) {
            throw new BusinessRuleException("Receive request must include all purchase line items");
        }

        for (PurchaseItem item : items) {
            createStockForLine(purchase, item, linesByItemId.get(item.getId()));
        }

        if (request.paymentStatus() != null) {
            purchase.setPaymentStatus(request.paymentStatus());
        }
        return purchaseMapper.toResponse(purchaseRepository.save(purchase));
    }

    private void createStockForLine(Purchase purchase, PurchaseItem item, ReceivePurchaseLineRequest line) {
        List<String> imeis = line.imeis();
        if (imeis != null && !imeis.isEmpty()) {
            if (imeis.size() != item.getQuantity()) {
                throw new BusinessRuleException("IMEI count must match line quantity for item " + item.getId());
            }
            Set<String> uniqueImeis = new HashSet<>();
            for (String imei : imeis) {
                validateImei(imei, uniqueImeis);
                Stock stock = saveStock(item, imei, null);
                recordPurchaseMovement(purchase.getId(), stock.getId());
            }
            return;
        }

        for (int unit = 0; unit < item.getQuantity(); unit++) {
            Stock stock = saveStock(item, null, null);
            recordPurchaseMovement(purchase.getId(), stock.getId());
        }
    }

    private void validateImei(String imei, Set<String> uniqueImeis) {
        if (!StringUtils.hasText(imei)) {
            throw new BusinessRuleException("IMEI cannot be blank for serialized items");
        }
        if (!uniqueImeis.add(imei.trim())) {
            throw new BusinessRuleException("Duplicate IMEI in request: " + imei);
        }
        if (stockRepository.findByImei(imei.trim()).isPresent()) {
            throw new BusinessRuleException("IMEI already exists: " + imei);
        }
    }

    private Stock saveStock(PurchaseItem item, String imei, String serialNumber) {
        Stock stock = new Stock();
        stock.setPurchaseItemId(item.getId());
        stock.setVariantId(item.getVariantId());
        stock.setImei(StringUtils.hasText(imei) ? imei.trim() : null);
        stock.setSerialNumber(serialNumber);
        stock.setStockStatus(StockStatus.AVAILABLE);
        return stockRepository.save(stock);
    }

    private void recordPurchaseMovement(UUID purchaseId, UUID stockId) {
        stockMovementService.recordMovement(
                stockId,
                ReferenceType.PURCHASE,
                purchaseId,
                MovementType.PURCHASE,
                "Purchase received");
    }
}
