package com.mobileshoperp.modules.inventory.service;

import com.mobileshoperp.common.enums.MovementType;
import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.inventory.dto.StockMovementResponse;
import com.mobileshoperp.modules.inventory.entity.StockMovement;
import com.mobileshoperp.modules.inventory.exception.StockMovementNotFoundException;
import com.mobileshoperp.modules.inventory.mapper.StockMovementMapper;
import com.mobileshoperp.modules.inventory.repository.StockMovementRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final StockMovementMapper stockMovementMapper;
    private final StockService stockService;

    public StockMovement recordMovement(
            UUID stockId,
            ReferenceType referenceType,
            UUID referenceId,
            MovementType movementType,
            String remarks) {
        StockMovement movement = new StockMovement();
        movement.setStockId(stockId);
        movement.setReferenceType(referenceType);
        movement.setReferenceId(referenceId);
        movement.setMovementType(movementType);
        movement.setRemarks(remarks);
        return stockMovementRepository.save(movement);
    }

    @Transactional(readOnly = true)
    public Page<StockMovementResponse> findAll(
            UUID stockId,
            ReferenceType referenceType,
            UUID referenceId,
            Instant from,
            Instant to,
            Pageable pageable) {
        validateReferenceFilters(referenceType, referenceId);
        validateDateRange(from, to);

        if (referenceType != null && referenceId != null) {
            return stockMovementRepository
                    .findByReferenceTypeAndReferenceIdOrderByCreatedAtDesc(referenceType, referenceId, pageable)
                    .map(stockMovementMapper::toResponse);
        }
        if (stockId != null) {
            stockService.getStockOrThrow(stockId);
            if (from != null && to != null) {
                return stockMovementRepository
                        .findByStockIdAndCreatedAtBetweenOrderByCreatedAtDesc(stockId, from, to, pageable)
                        .map(stockMovementMapper::toResponse);
            }
            return stockMovementRepository
                    .findByStockIdOrderByCreatedAtDesc(stockId, pageable)
                    .map(stockMovementMapper::toResponse);
        }
        if (from != null && to != null) {
            return stockMovementRepository
                    .findByCreatedAtBetweenOrderByCreatedAtDesc(from, to, pageable)
                    .map(stockMovementMapper::toResponse);
        }
        return stockMovementRepository.findAll(pageable).map(stockMovementMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public StockMovementResponse findById(UUID id) {
        return stockMovementMapper.toResponse(getMovementOrThrow(id));
    }

    @Transactional(readOnly = true)
    public StockMovement getMovementOrThrow(UUID id) {
        return stockMovementRepository.findById(id).orElseThrow(() -> new StockMovementNotFoundException(id));
    }

    private void validateReferenceFilters(ReferenceType referenceType, UUID referenceId) {
        if (referenceType == null && referenceId == null) {
            return;
        }
        if (referenceType == null || referenceId == null) {
            throw new BusinessRuleException("Both referenceType and referenceId are required for reference lookup");
        }
    }

    private void validateDateRange(Instant from, Instant to) {
        if (from == null && to == null) {
            return;
        }
        if (from == null || to == null) {
            throw new BusinessRuleException("Both from and to are required for date range lookup");
        }
        if (from.isAfter(to)) {
            throw new BusinessRuleException("'from' must be before or equal to 'to'");
        }
    }
}
