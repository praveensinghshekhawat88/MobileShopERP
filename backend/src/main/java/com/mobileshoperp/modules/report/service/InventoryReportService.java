package com.mobileshoperp.modules.report.service;

import com.mobileshoperp.common.enums.MovementType;
import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.common.enums.StockStatus;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.dto.LowStockReportDto;
import com.mobileshoperp.modules.report.dto.StockMovementReportDto;
import com.mobileshoperp.modules.report.dto.StockSnapshotReportDto;
import com.mobileshoperp.modules.report.dto.StockUnitReportDto;
import com.mobileshoperp.modules.report.repository.InventoryReportRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryReportService {

    private final InventoryReportRepository inventoryReportRepository;

    public Page<StockSnapshotReportDto> findCurrentSnapshot(
            UUID variantId, StockStatus stockStatus, Pageable pageable) {
        return inventoryReportRepository.findCurrentSnapshot(variantId, stockStatus, pageable).map(row ->
                new StockSnapshotReportDto(
                        row.variantId(), row.variantSku(), row.productName(), row.stockStatus(), row.quantity()));
    }

    public Page<StockUnitReportDto> findCurrentByImei(String imei, Pageable pageable) {
        if (!StringUtils.hasText(imei)) {
            throw new BusinessRuleException("imei is required for IMEI search");
        }
        return inventoryReportRepository.findCurrentByImei(imei, pageable).map(row -> new StockUnitReportDto(
                row.id(),
                row.variantId(),
                row.variantSku(),
                row.productName(),
                row.imei(),
                row.serialNumber(),
                row.stockStatus()));
    }

    public Page<StockMovementReportDto> findMovements(
            UUID stockId,
            UUID variantId,
            String imei,
            ReferenceType referenceType,
            UUID referenceId,
            MovementType movementType,
            Instant from,
            Instant to,
            Pageable pageable) {
        validateReferenceFilters(referenceType, referenceId);
        validateDateRange(from, to);
        return inventoryReportRepository
                .findMovements(
                        stockId, variantId, imei, referenceType, referenceId, movementType, from, to, pageable)
                .map(row -> new StockMovementReportDto(
                        row.id(),
                        row.stockId(),
                        row.imei(),
                        row.variantId(),
                        row.variantSku(),
                        row.productName(),
                        row.referenceType(),
                        row.referenceId(),
                        row.movementType(),
                        row.remarks(),
                        row.createdAt()));
    }

    public Page<LowStockReportDto> findLowStock(int threshold, Pageable pageable) {
        if (threshold < 0) {
            throw new BusinessRuleException("threshold must be zero or greater");
        }
        return inventoryReportRepository.findLowStock(threshold, pageable).map(row -> new LowStockReportDto(
                row.variantId(), row.variantSku(), row.productName(), row.availableCount(), threshold));
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
