package com.mobileshoperp.modules.inventory.service;

import com.mobileshoperp.common.enums.StockStatus;
import com.mobileshoperp.common.validation.ImeiValidator;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.inventory.dto.StockResponse;
import com.mobileshoperp.modules.inventory.dto.UpdateStockRequest;
import com.mobileshoperp.modules.inventory.entity.Stock;
import com.mobileshoperp.modules.inventory.exception.DuplicateImeiException;
import com.mobileshoperp.modules.inventory.exception.StockNotFoundException;
import com.mobileshoperp.modules.inventory.mapper.StockMapper;
import com.mobileshoperp.modules.inventory.repository.StockRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional
public class StockService {

    private final StockRepository stockRepository;
    private final StockMapper stockMapper;

    @Transactional(readOnly = true)
    public Page<StockResponse> findAll(UUID variantId, StockStatus stockStatus, Pageable pageable) {
        Page<Stock> page;
        if (variantId != null && stockStatus != null) {
            page = stockRepository.findByVariantIdAndStockStatusOrderByCreatedAtAsc(
                    variantId, stockStatus, pageable);
        } else if (variantId != null) {
            page = stockRepository.findByVariantIdOrderByCreatedAtAsc(variantId, pageable);
        } else if (stockStatus != null) {
            page = stockRepository.findByStockStatusOrderByCreatedAtAsc(stockStatus, pageable);
        } else {
            page = stockRepository.findAllByOrderByCreatedAtAsc(pageable);
        }
        return page.map(stockMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public StockResponse findById(UUID id) {
        return stockMapper.toResponse(getStockOrThrow(id));
    }

    @Transactional(readOnly = true)
    public StockResponse findByImei(String imei) {
        ImeiValidator.validateOrThrow(imei);
        return stockMapper.toResponse(stockRepository
                .findByImei(imei.trim())
                .orElseThrow(() -> new StockNotFoundException(imei)));
    }

    public StockResponse update(UUID id, UpdateStockRequest request) {
        Stock stock = getStockOrThrow(id);
        if (request.imei() != null) {
            updateImei(stock, request.imei());
        }
        stockMapper.updateEntity(request, stock);
        if (request.serialNumber() != null) {
            stock.setSerialNumber(
                    StringUtils.hasText(request.serialNumber()) ? request.serialNumber().trim() : null);
        }
        return stockMapper.toResponse(stockRepository.save(stock));
    }

    @Transactional(readOnly = true)
    public Stock getStockOrThrow(UUID id) {
        return stockRepository.findById(id).orElseThrow(() -> new StockNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public Stock getAvailableStockOrThrow(UUID id) {
        Stock stock = getStockOrThrow(id);
        if (stock.getStockStatus() != StockStatus.AVAILABLE) {
            throw new BusinessRuleException("Stock is not available: " + id);
        }
        return stock;
    }

    private void updateImei(Stock stock, String imei) {
        if (!StringUtils.hasText(imei)) {
            if (stock.getImei() != null) {
                throw new BusinessRuleException("IMEI cannot be removed from serialized stock");
            }
            stock.setImei(null);
            return;
        }
        if (stock.getImei() == null) {
            throw new BusinessRuleException("IMEI cannot be added to accessory stock");
        }
        String normalized = imei.trim();
        ImeiValidator.validateOrThrow(normalized);
        stockRepository.findByImei(normalized).ifPresent(existing -> {
            if (!existing.getId().equals(stock.getId())) {
                throw new DuplicateImeiException(normalized);
            }
        });
        stock.setImei(normalized);
    }
}
