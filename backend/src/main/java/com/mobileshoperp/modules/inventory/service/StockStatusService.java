package com.mobileshoperp.modules.inventory.service;

import com.mobileshoperp.common.enums.MovementType;
import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.common.enums.StockStatus;
import com.mobileshoperp.modules.inventory.dto.StockResponse;
import com.mobileshoperp.modules.inventory.dto.StockStatusUpdateRequest;
import com.mobileshoperp.modules.inventory.entity.Stock;
import com.mobileshoperp.modules.inventory.exception.InvalidStockTransitionException;
import com.mobileshoperp.modules.inventory.exception.StockNotAvailableException;
import com.mobileshoperp.modules.inventory.mapper.StockMapper;
import com.mobileshoperp.modules.inventory.repository.StockRepository;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional
public class StockStatusService {

    private static final Map<StockStatus, Set<StockStatus>> ALLOWED_TRANSITIONS = buildTransitions();

    private final StockRepository stockRepository;
    private final StockMapper stockMapper;
    private final StockMovementService stockMovementService;
    private final StockService stockService;

    public StockResponse updateStatus(UUID stockId, StockStatusUpdateRequest request) {
        return updateStatus(
                stockId,
                request.newStatus(),
                request.reason(),
                request.referenceType(),
                request.referenceId());
    }

    public StockResponse updateStatus(
            UUID stockId,
            StockStatus newStatus,
            String reason,
            ReferenceType referenceType,
            UUID referenceId) {
        Stock stock = stockService.getStockOrThrow(stockId);
        StockStatus currentStatus = stock.getStockStatus();
        validateTransition(currentStatus, newStatus);
        if (newStatus == StockStatus.SOLD) {
            assertAvailableForSale(stock);
        }

        stock.setStockStatus(newStatus);
        Stock saved = stockRepository.save(stock);

        ReferenceType resolvedReferenceType = resolveReferenceType(currentStatus, newStatus, referenceType);
        UUID resolvedReferenceId = referenceId != null ? referenceId : stockId;
        MovementType movementType = resolveMovementType(currentStatus, newStatus);
        String remarks = buildRemarks(currentStatus, newStatus, reason);

        stockMovementService.recordMovement(
                stockId, resolvedReferenceType, resolvedReferenceId, movementType, remarks);

        return stockMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public void assertAvailableForSale(UUID stockId) {
        Stock stock = stockService.getStockOrThrow(stockId);
        assertAvailableForSale(stock);
    }

    private void assertAvailableForSale(Stock stock) {
        StockStatus status = stock.getStockStatus();
        if (status != StockStatus.AVAILABLE && status != StockStatus.RESERVED) {
            throw new StockNotAvailableException(stock.getId());
        }
    }

    private void validateTransition(StockStatus from, StockStatus to) {
        if (from == to) {
            throw new InvalidStockTransitionException(from, to);
        }
        Set<StockStatus> allowed = ALLOWED_TRANSITIONS.get(from);
        if (allowed == null || !allowed.contains(to)) {
            throw new InvalidStockTransitionException(from, to);
        }
    }

    private ReferenceType resolveReferenceType(
            StockStatus from, StockStatus to, ReferenceType provided) {
        if (provided != null) {
            return provided;
        }
        if (to == StockStatus.REPAIR || from == StockStatus.REPAIR) {
            return ReferenceType.REPAIR;
        }
        if (to == StockStatus.SOLD || to == StockStatus.RETURNED || from == StockStatus.RETURNED) {
            return ReferenceType.SALE;
        }
        return ReferenceType.PURCHASE;
    }

    private MovementType resolveMovementType(StockStatus from, StockStatus to) {
        if (to == StockStatus.REPAIR || from == StockStatus.REPAIR) {
            return MovementType.REPAIR;
        }
        if (to == StockStatus.RETURNED || from == StockStatus.RETURNED) {
            return MovementType.RETURN;
        }
        if (to == StockStatus.SOLD) {
            return MovementType.SALE;
        }
        return MovementType.ADJUSTMENT;
    }

    private String buildRemarks(StockStatus from, StockStatus to, String reason) {
        String base = "Status change: " + from + " -> " + to;
        if (StringUtils.hasText(reason)) {
            return base + " — " + reason.trim();
        }
        return base;
    }

    private static Map<StockStatus, Set<StockStatus>> buildTransitions() {
        Map<StockStatus, Set<StockStatus>> map = new EnumMap<>(StockStatus.class);
        map.put(StockStatus.AVAILABLE, EnumSet.of(
                StockStatus.RESERVED, StockStatus.SOLD, StockStatus.DAMAGED, StockStatus.LOST));
        map.put(StockStatus.RESERVED, EnumSet.of(StockStatus.AVAILABLE, StockStatus.SOLD));
        map.put(StockStatus.SOLD, EnumSet.of(StockStatus.RETURNED, StockStatus.REPAIR));
        map.put(StockStatus.REPAIR, EnumSet.of(StockStatus.AVAILABLE, StockStatus.DAMAGED));
        map.put(StockStatus.RETURNED, EnumSet.of(StockStatus.AVAILABLE, StockStatus.DAMAGED));
        map.put(StockStatus.DAMAGED, EnumSet.noneOf(StockStatus.class));
        map.put(StockStatus.LOST, EnumSet.noneOf(StockStatus.class));
        return Map.copyOf(map);
    }
}
