package com.mobileshoperp.modules.service.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.common.enums.RepairStatus;
import com.mobileshoperp.common.enums.StockStatus;
import com.mobileshoperp.modules.business.entity.Customer;
import com.mobileshoperp.modules.business.service.CustomerService;
import com.mobileshoperp.modules.inventory.entity.Stock;
import com.mobileshoperp.modules.inventory.service.StockService;
import com.mobileshoperp.modules.inventory.service.StockStatusService;
import com.mobileshoperp.modules.sales.repository.SaleItemRepository;
import com.mobileshoperp.modules.service.dto.CreateRepairRequest;
import com.mobileshoperp.modules.service.dto.RepairResponse;
import com.mobileshoperp.modules.service.dto.UpdateRepairStatusRequest;
import com.mobileshoperp.modules.service.entity.Repair;
import com.mobileshoperp.modules.service.exception.InvalidRepairTransitionException;
import com.mobileshoperp.modules.service.mapper.RepairMapper;
import com.mobileshoperp.modules.service.repository.RepairRepository;
import java.util.EnumSet;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RepairServiceTest {

    @Mock
    private RepairRepository repairRepository;

    @Mock
    private RepairMapper repairMapper;

    @Mock
    private CustomerService customerService;

    @Mock
    private StockService stockService;

    @Mock
    private StockStatusService stockStatusService;

    @Mock
    private SaleItemRepository saleItemRepository;

    @InjectMocks
    private RepairService repairService;

    @Test
    void create_withSoldStock_movesStockToRepair() {
        UUID customerId = UUID.randomUUID();
        UUID stockId = UUID.randomUUID();
        UUID repairId = UUID.randomUUID();

        CreateRepairRequest request = new CreateRepairRequest(stockId, customerId, "Screen broken", null);
        Repair repair = new Repair();
        repair.setId(repairId);
        repair.setStockId(stockId);
        repair.setCustomerId(customerId);
        repair.setRepairStatus(RepairStatus.RECEIVED);

        Stock stock = new Stock();
        stock.setId(stockId);
        stock.setStockStatus(StockStatus.SOLD);

        when(customerService.getActiveCustomerOrThrow(customerId)).thenReturn(new Customer());
        when(repairMapper.toEntity(request)).thenReturn(new Repair());
        when(repairRepository.save(any(Repair.class))).thenReturn(repair);
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);
        when(repairRepository.existsActiveRepairForStock(stockId, EnumSet.of(RepairStatus.DELIVERED, RepairStatus.CANCELLED), null))
                .thenReturn(false);
        when(repairMapper.toResponse(repair))
                .thenReturn(new RepairResponse(
                        repairId, stockId, customerId, RepairStatus.RECEIVED, "Screen broken", null, null));

        repairService.create(request);

        verify(stockStatusService)
                .updateStatus(stockId, StockStatus.REPAIR, "Repair received", ReferenceType.REPAIR, repairId);
    }

    @Test
    void create_externalDevice_omitsStockUpdate() {
        UUID customerId = UUID.randomUUID();
        CreateRepairRequest request = new CreateRepairRequest(null, customerId, "External device", null);
        Repair repair = new Repair();
        repair.setId(UUID.randomUUID());
        repair.setCustomerId(customerId);

        when(customerService.getActiveCustomerOrThrow(customerId)).thenReturn(new Customer());
        when(repairMapper.toEntity(request)).thenReturn(new Repair());
        when(repairRepository.save(any(Repair.class))).thenReturn(repair);
        when(repairMapper.toResponse(repair)).thenReturn(new RepairResponse(
                repair.getId(), null, customerId, RepairStatus.RECEIVED, "External device", null, null));

        repairService.create(request);

        verify(stockStatusService, never()).updateStatus(any(), any(), any(), any(), any());
    }

    @Test
    void updateStatus_invalidTransition_rejects() {
        UUID repairId = UUID.randomUUID();
        Repair repair = new Repair();
        repair.setId(repairId);
        repair.setRepairStatus(RepairStatus.RECEIVED);

        when(repairRepository.findById(repairId)).thenReturn(Optional.of(repair));

        assertThatThrownBy(() -> repairService.updateStatus(
                        repairId, new UpdateRepairStatusRequest(RepairStatus.DELIVERED, null)))
                .isInstanceOf(InvalidRepairTransitionException.class);
    }

    @Test
    void updateStatus_toDelivered_restoresSoldStock() {
        UUID repairId = UUID.randomUUID();
        UUID stockId = UUID.randomUUID();

        Repair repair = new Repair();
        repair.setId(repairId);
        repair.setStockId(stockId);
        repair.setRepairStatus(RepairStatus.READY);

        Stock stock = new Stock();
        stock.setId(stockId);
        stock.setStockStatus(StockStatus.REPAIR);

        when(repairRepository.findById(repairId)).thenReturn(Optional.of(repair));
        when(repairRepository.save(repair)).thenReturn(repair);
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);
        when(saleItemRepository.findByStockId(stockId)).thenReturn(Optional.of(new com.mobileshoperp.modules.sales.entity.SaleItem()));
        when(repairMapper.toResponse(repair))
                .thenReturn(new RepairResponse(
                        repairId, stockId, UUID.randomUUID(), RepairStatus.DELIVERED, null, null, null));

        RepairResponse response = repairService.updateStatus(
                repairId, new UpdateRepairStatusRequest(RepairStatus.DELIVERED, "Picked up"));

        assertThat(response.repairStatus()).isEqualTo(RepairStatus.DELIVERED);
        verify(stockStatusService)
                .updateStatus(stockId, StockStatus.AVAILABLE, "Repair closed", ReferenceType.REPAIR, repairId);
        verify(stockStatusService)
                .updateStatus(
                        eq(stockId),
                        eq(StockStatus.SOLD),
                        eq("Device returned after repair"),
                        eq(ReferenceType.REPAIR),
                        eq(repairId));
    }
}
