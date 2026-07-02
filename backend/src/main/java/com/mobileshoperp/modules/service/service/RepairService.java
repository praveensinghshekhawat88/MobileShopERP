package com.mobileshoperp.modules.service.service;

import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.common.enums.RepairStatus;
import com.mobileshoperp.common.enums.StockStatus;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.business.service.CustomerService;
import com.mobileshoperp.modules.inventory.entity.Stock;
import com.mobileshoperp.modules.inventory.service.StockService;
import com.mobileshoperp.modules.inventory.service.StockStatusService;
import com.mobileshoperp.modules.sales.repository.SaleItemRepository;
import com.mobileshoperp.modules.service.dto.CreateRepairRequest;
import com.mobileshoperp.modules.service.dto.RepairResponse;
import com.mobileshoperp.modules.service.dto.UpdateRepairRequest;
import com.mobileshoperp.modules.service.dto.UpdateRepairStatusRequest;
import com.mobileshoperp.modules.service.entity.Repair;
import com.mobileshoperp.modules.service.exception.InvalidRepairTransitionException;
import com.mobileshoperp.modules.service.exception.RepairNotFoundException;
import com.mobileshoperp.modules.service.mapper.RepairMapper;
import com.mobileshoperp.modules.service.repository.RepairRepository;
import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RepairService {

    private static final Set<RepairStatus> TERMINAL_STATUSES = EnumSet.of(RepairStatus.DELIVERED, RepairStatus.CANCELLED);
    private static final Map<RepairStatus, Set<RepairStatus>> ALLOWED_TRANSITIONS = buildTransitions();

    private final RepairRepository repairRepository;
    private final RepairMapper repairMapper;
    private final CustomerService customerService;
    private final StockService stockService;
    private final StockStatusService stockStatusService;
    private final SaleItemRepository saleItemRepository;

    @Transactional(readOnly = true)
    public Page<RepairResponse> findAll(UUID customerId, RepairStatus repairStatus, Pageable pageable) {
        Page<Repair> page;
        if (customerId != null && repairStatus != null) {
            page = repairRepository.findByCustomerIdAndRepairStatusOrderByCreatedAtDesc(
                    customerId, repairStatus, pageable);
        } else if (customerId != null) {
            page = repairRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable);
        } else if (repairStatus != null) {
            page = repairRepository.findByRepairStatusOrderByCreatedAtDesc(repairStatus, pageable);
        } else {
            page = repairRepository.findAllByOrderByCreatedAtDesc(pageable);
        }
        return page.map(repairMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public RepairResponse findById(UUID id) {
        return repairMapper.toResponse(getRepairOrThrow(id));
    }

    public RepairResponse create(CreateRepairRequest request) {
        customerService.getActiveCustomerOrThrow(request.customerId());
        validateCost(request.estimatedCost());

        if (request.stockId() != null) {
            validateStockForRepair(request.stockId(), null);
        }

        Repair repair = repairMapper.toEntity(request);
        Repair saved = repairRepository.save(repair);

        if (request.stockId() != null) {
            moveStockToRepair(request.stockId(), saved.getId());
        }

        return repairMapper.toResponse(saved);
    }

    public RepairResponse update(UUID id, UpdateRepairRequest request) {
        Repair repair = getRepairOrThrow(id);
        assertModifiable(repair);

        if (request.customerId() != null) {
            customerService.getActiveCustomerOrThrow(request.customerId());
        }
        if (request.stockId() != null) {
            validateStockForRepair(request.stockId(), id);
        }
        if (request.estimatedCost() != null) {
            validateCost(request.estimatedCost());
        }
        if (request.actualCost() != null) {
            validateCost(request.actualCost());
        }

        repairMapper.updateEntity(request, repair);
        return repairMapper.toResponse(repairRepository.save(repair));
    }

    public RepairResponse updateStatus(UUID id, UpdateRepairStatusRequest request) {
        Repair repair = getRepairOrThrow(id);
        assertModifiable(repair);

        RepairStatus currentStatus = repair.getRepairStatus();
        RepairStatus newStatus = request.repairStatus();
        validateTransition(currentStatus, newStatus);

        repair.setRepairStatus(newStatus);
        Repair saved = repairRepository.save(repair);

        if (repair.getStockId() != null
                && (newStatus == RepairStatus.DELIVERED || newStatus == RepairStatus.CANCELLED)) {
            restoreStockAfterRepair(repair.getStockId(), saved.getId());
        }

        return repairMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Repair getRepairOrThrow(UUID id) {
        return repairRepository.findById(id).orElseThrow(() -> new RepairNotFoundException(id));
    }

    private void validateStockForRepair(UUID stockId, UUID excludeRepairId) {
        Stock stock = stockService.getStockOrThrow(stockId);
        if (stock.getStockStatus() != StockStatus.SOLD
                && stock.getStockStatus() != StockStatus.REPAIR
                && stock.getStockStatus() != StockStatus.AVAILABLE) {
            throw new BusinessRuleException("Stock is not eligible for repair: " + stockId);
        }
        if (repairRepository.existsActiveRepairForStock(stockId, TERMINAL_STATUSES, excludeRepairId)) {
            throw new BusinessRuleException("Stock already has an active repair: " + stockId);
        }
    }

    private void moveStockToRepair(UUID stockId, UUID repairId) {
        Stock stock = stockService.getStockOrThrow(stockId);
        if (stock.getStockStatus() == StockStatus.SOLD) {
            stockStatusService.updateStatus(
                    stockId, StockStatus.REPAIR, "Repair received", ReferenceType.REPAIR, repairId);
        }
    }

    private void restoreStockAfterRepair(UUID stockId, UUID repairId) {
        Stock stock = stockService.getStockOrThrow(stockId);
        if (stock.getStockStatus() != StockStatus.REPAIR) {
            return;
        }

        String reason = "Repair closed";
        stockStatusService.updateStatus(stockId, StockStatus.AVAILABLE, reason, ReferenceType.REPAIR, repairId);

        if (saleItemRepository.findByStockId(stockId).isPresent()) {
            stockStatusService.updateStatus(
                    stockId, StockStatus.SOLD, "Device returned after repair", ReferenceType.REPAIR, repairId);
        }
    }

    private void assertModifiable(Repair repair) {
        if (TERMINAL_STATUSES.contains(repair.getRepairStatus())) {
            throw new BusinessRuleException("Repair in terminal status cannot be modified: " + repair.getId());
        }
    }

    private void validateTransition(RepairStatus from, RepairStatus to) {
        if (from == to) {
            throw new InvalidRepairTransitionException(from, to);
        }
        Set<RepairStatus> allowed = ALLOWED_TRANSITIONS.get(from);
        if (allowed == null || !allowed.contains(to)) {
            throw new InvalidRepairTransitionException(from, to);
        }
    }

    private void validateCost(BigDecimal cost) {
        if (cost != null && cost.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessRuleException("Repair cost cannot be negative");
        }
    }

    private static Map<RepairStatus, Set<RepairStatus>> buildTransitions() {
        Map<RepairStatus, Set<RepairStatus>> map = new EnumMap<>(RepairStatus.class);
        map.put(RepairStatus.RECEIVED, EnumSet.of(RepairStatus.CHECKING, RepairStatus.CANCELLED));
        map.put(
                RepairStatus.CHECKING,
                EnumSet.of(RepairStatus.WAITING_PARTS, RepairStatus.REPAIRING, RepairStatus.CANCELLED));
        map.put(RepairStatus.WAITING_PARTS, EnumSet.of(RepairStatus.REPAIRING, RepairStatus.CANCELLED));
        map.put(
                RepairStatus.REPAIRING,
                EnumSet.of(RepairStatus.READY, RepairStatus.WAITING_PARTS, RepairStatus.CANCELLED));
        map.put(RepairStatus.READY, EnumSet.of(RepairStatus.DELIVERED, RepairStatus.REPAIRING));
        map.put(RepairStatus.DELIVERED, EnumSet.noneOf(RepairStatus.class));
        map.put(RepairStatus.CANCELLED, EnumSet.noneOf(RepairStatus.class));
        return Map.copyOf(map);
    }
}
