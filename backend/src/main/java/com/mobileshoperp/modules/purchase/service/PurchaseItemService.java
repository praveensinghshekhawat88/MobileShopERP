package com.mobileshoperp.modules.purchase.service;

import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.product.service.ProductVariantService;
import com.mobileshoperp.modules.purchase.dto.CreatePurchaseItemRequest;
import com.mobileshoperp.modules.purchase.dto.PurchaseItemResponse;
import com.mobileshoperp.modules.purchase.dto.UpdatePurchaseItemRequest;
import com.mobileshoperp.modules.purchase.entity.Purchase;
import com.mobileshoperp.modules.purchase.entity.PurchaseItem;
import com.mobileshoperp.modules.purchase.exception.PurchaseItemNotFoundException;
import com.mobileshoperp.modules.purchase.mapper.PurchaseItemMapper;
import com.mobileshoperp.modules.purchase.repository.PurchaseItemRepository;
import com.mobileshoperp.modules.purchase.repository.PurchaseRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseItemService {

    private final PurchaseItemRepository purchaseItemRepository;
    private final PurchaseRepository purchaseRepository;
    private final PurchaseItemMapper purchaseItemMapper;
    private final PurchaseService purchaseService;
    private final ProductVariantService productVariantService;

    @Transactional(readOnly = true)
    public List<PurchaseItemResponse> findByPurchaseId(UUID purchaseId) {
        purchaseService.getPurchaseOrThrow(purchaseId);
        return purchaseItemRepository.findByPurchaseIdOrderByCreatedAtAsc(purchaseId).stream()
                .map(purchaseItemMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PurchaseItemResponse findById(UUID purchaseId, UUID itemId) {
        return purchaseItemMapper.toResponse(getItemForPurchaseOrThrow(purchaseId, itemId));
    }

    public PurchaseItemResponse create(UUID purchaseId, CreatePurchaseItemRequest request) {
        purchaseService.getPurchaseOrThrow(purchaseId);
        productVariantService.getActiveProductVariantOrThrow(request.variantId());
        validatePositivePrice(request.purchasePrice());

        BigDecimal taxAmount = request.taxAmount() != null ? request.taxAmount() : BigDecimal.ZERO;
        if (taxAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessRuleException("Tax amount cannot be negative");
        }

        PurchaseItem item = new PurchaseItem();
        item.setPurchaseId(purchaseId);
        item.setVariantId(request.variantId());
        item.setQuantity(request.quantity());
        item.setPurchasePrice(request.purchasePrice());
        item.setTaxAmount(taxAmount);
        item.setTotalAmount(calculateLineTotal(request.quantity(), request.purchasePrice(), taxAmount));

        PurchaseItem saved = purchaseItemRepository.save(item);
        recalculatePurchaseTotal(purchaseId);
        return purchaseItemMapper.toResponse(saved);
    }

    public PurchaseItemResponse update(UUID purchaseId, UUID itemId, UpdatePurchaseItemRequest request) {
        PurchaseItem item = getItemForPurchaseOrThrow(purchaseId, itemId);
        if (request.variantId() != null) {
            productVariantService.getActiveProductVariantOrThrow(request.variantId());
            item.setVariantId(request.variantId());
        }
        if (request.quantity() != null) {
            item.setQuantity(request.quantity());
        }
        if (request.purchasePrice() != null) {
            validatePositivePrice(request.purchasePrice());
            item.setPurchasePrice(request.purchasePrice());
        }
        if (request.taxAmount() != null) {
            if (request.taxAmount().compareTo(BigDecimal.ZERO) < 0) {
                throw new BusinessRuleException("Tax amount cannot be negative");
            }
            item.setTaxAmount(request.taxAmount());
        }

        item.setTotalAmount(calculateLineTotal(item.getQuantity(), item.getPurchasePrice(), item.getTaxAmount()));
        PurchaseItem saved = purchaseItemRepository.save(item);
        recalculatePurchaseTotal(purchaseId);
        return purchaseItemMapper.toResponse(saved);
    }

    public void softDelete(UUID purchaseId, UUID itemId) {
        PurchaseItem item = getItemForPurchaseOrThrow(purchaseId, itemId);
        item.setDeletedAt(Instant.now());
        purchaseItemRepository.save(item);
        recalculatePurchaseTotal(purchaseId);
    }

    private PurchaseItem getItemForPurchaseOrThrow(UUID purchaseId, UUID itemId) {
        PurchaseItem item = purchaseItemRepository
                .findById(itemId)
                .orElseThrow(() -> new PurchaseItemNotFoundException(itemId));
        if (!item.getPurchaseId().equals(purchaseId)) {
            throw new PurchaseItemNotFoundException(itemId);
        }
        return item;
    }

    private void recalculatePurchaseTotal(UUID purchaseId) {
        BigDecimal total = purchaseItemRepository.findByPurchaseIdOrderByCreatedAtAsc(purchaseId).stream()
                .map(PurchaseItem::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Purchase purchase = purchaseService.getPurchaseOrThrow(purchaseId);
        purchase.setTotalAmount(total);
        purchaseRepository.save(purchase);
    }

    private BigDecimal calculateLineTotal(int quantity, BigDecimal purchasePrice, BigDecimal taxAmount) {
        return purchasePrice
                .multiply(BigDecimal.valueOf(quantity))
                .add(taxAmount);
    }

    private void validatePositivePrice(BigDecimal price) {
        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleException("Purchase price must be positive");
        }
    }
}
