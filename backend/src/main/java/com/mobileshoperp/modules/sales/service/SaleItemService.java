package com.mobileshoperp.modules.sales.service;

import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.inventory.entity.Stock;
import com.mobileshoperp.modules.inventory.service.StockService;
import com.mobileshoperp.modules.inventory.service.StockStatusService;
import com.mobileshoperp.modules.product.service.ProductPriceService;
import com.mobileshoperp.modules.sales.dto.CreateSaleItemRequest;
import com.mobileshoperp.modules.sales.dto.SaleItemResponse;
import com.mobileshoperp.modules.sales.dto.UpdateSaleItemRequest;
import com.mobileshoperp.modules.sales.entity.Sale;
import com.mobileshoperp.modules.sales.entity.SaleItem;
import com.mobileshoperp.modules.sales.exception.SaleItemNotFoundException;
import com.mobileshoperp.modules.sales.exception.StockAlreadyOnSaleException;
import com.mobileshoperp.modules.sales.mapper.SaleItemMapper;
import com.mobileshoperp.modules.sales.repository.SaleItemRepository;
import com.mobileshoperp.modules.sales.repository.SaleRepository;
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
public class SaleItemService {

    private final SaleItemRepository saleItemRepository;
    private final SaleRepository saleRepository;
    private final SaleItemMapper saleItemMapper;
    private final SaleService saleService;
    private final StockService stockService;
    private final StockStatusService stockStatusService;
    private final ProductPriceService productPriceService;

    @Transactional(readOnly = true)
    public List<SaleItemResponse> findBySaleId(UUID saleId) {
        saleService.getSaleOrThrow(saleId);
        return saleItemRepository.findBySaleIdOrderByCreatedAtAsc(saleId).stream()
                .map(saleItemMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SaleItemResponse findById(UUID saleId, UUID itemId) {
        return saleItemMapper.toResponse(getItemForSaleOrThrow(saleId, itemId));
    }

    public SaleItemResponse create(UUID saleId, CreateSaleItemRequest request) {
        saleService.getSaleOrThrow(saleId);
        stockStatusService.assertAvailableForSale(request.stockId());
        validateStockNotAlreadyOnSale(request.stockId());

        Stock stock = stockService.getStockOrThrow(request.stockId());
        BigDecimal sellingPrice = resolveSellingPrice(stock.getVariantId(), request.sellingPrice());
        BigDecimal discount = request.discount() != null ? request.discount() : BigDecimal.ZERO;
        BigDecimal taxAmount = request.taxAmount() != null ? request.taxAmount() : BigDecimal.ZERO;
        validateAmounts(sellingPrice, discount, taxAmount);

        SaleItem item = new SaleItem();
        item.setSaleId(saleId);
        item.setStockId(request.stockId());
        item.setSellingPrice(sellingPrice);
        item.setDiscount(discount);
        item.setTaxAmount(taxAmount);

        SaleItem saved = saleItemRepository.save(item);
        recalculateSaleTotal(saleId);
        return saleItemMapper.toResponse(saved);
    }

    public SaleItemResponse update(UUID saleId, UUID itemId, UpdateSaleItemRequest request) {
        SaleItem item = getItemForSaleOrThrow(saleId, itemId);
        if (request.sellingPrice() != null) {
            validatePositivePrice(request.sellingPrice());
            item.setSellingPrice(request.sellingPrice());
        }
        if (request.discount() != null) {
            item.setDiscount(request.discount());
        }
        if (request.taxAmount() != null) {
            item.setTaxAmount(request.taxAmount());
        }
        validateAmounts(item.getSellingPrice(), item.getDiscount(), item.getTaxAmount());

        SaleItem saved = saleItemRepository.save(item);
        recalculateSaleTotal(saleId);
        return saleItemMapper.toResponse(saved);
    }

    public void softDelete(UUID saleId, UUID itemId) {
        SaleItem item = getItemForSaleOrThrow(saleId, itemId);
        item.setDeletedAt(Instant.now());
        saleItemRepository.save(item);
        recalculateSaleTotal(saleId);
    }

    private SaleItem getItemForSaleOrThrow(UUID saleId, UUID itemId) {
        SaleItem item = saleItemRepository.findById(itemId).orElseThrow(() -> new SaleItemNotFoundException(itemId));
        if (!item.getSaleId().equals(saleId)) {
            throw new SaleItemNotFoundException(itemId);
        }
        return item;
    }

    private void validateStockNotAlreadyOnSale(UUID stockId) {
        saleItemRepository.findByStockId(stockId).ifPresent(existing -> {
            throw new StockAlreadyOnSaleException(stockId);
        });
    }

    private BigDecimal resolveSellingPrice(UUID variantId, BigDecimal requestedPrice) {
        if (requestedPrice != null) {
            validatePositivePrice(requestedPrice);
            return requestedPrice;
        }
        return productPriceService.getActiveRetailPrice(variantId).price();
    }

    private void recalculateSaleTotal(UUID saleId) {
        BigDecimal total = saleItemRepository.findBySaleIdOrderByCreatedAtAsc(saleId).stream()
                .map(saleItemMapper::calculateLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Sale sale = saleService.getSaleOrThrow(saleId);
        sale.setTotalAmount(total);
        saleRepository.save(sale);
    }

    private void validateAmounts(BigDecimal sellingPrice, BigDecimal discount, BigDecimal taxAmount) {
        validatePositivePrice(sellingPrice);
        if (discount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessRuleException("Discount cannot be negative");
        }
        if (discount.compareTo(sellingPrice) > 0) {
            throw new BusinessRuleException("Discount cannot exceed selling price");
        }
        if (taxAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessRuleException("Tax amount cannot be negative");
        }
    }

    private void validatePositivePrice(BigDecimal price) {
        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleException("Selling price must be positive");
        }
    }
}
