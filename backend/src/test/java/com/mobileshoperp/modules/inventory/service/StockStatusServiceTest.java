package com.mobileshoperp.modules.inventory.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class StockStatusServiceTest {

    @Mock
    private StockRepository stockRepository;

    @Mock
    private StockMapper stockMapper;

    @Mock
    private StockMovementService stockMovementService;

    @Mock
    private StockService stockService;

    @InjectMocks
    private StockStatusService stockStatusService;

    private UUID stockId;
    private Stock stock;

    @BeforeEach
    void setUp() {
        stockId = UUID.randomUUID();
        stock = new Stock();
        stock.setId(stockId);
        stock.setStockStatus(StockStatus.AVAILABLE);
    }

    @Test
    void updateStatus_validTransition_recordsMovement() {
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);
        when(stockRepository.save(stock)).thenReturn(stock);
        when(stockMapper.toResponse(stock)).thenReturn(new StockResponse(
                stockId, UUID.randomUUID(), UUID.randomUUID(), null, null, StockStatus.RESERVED));

        stockStatusService.updateStatus(
                stockId, new StockStatusUpdateRequest(StockStatus.RESERVED, "Hold for customer", null, null));

        assertThat(stock.getStockStatus()).isEqualTo(StockStatus.RESERVED);
        verify(stockMovementService)
                .recordMovement(
                        eq(stockId),
                        eq(ReferenceType.PURCHASE),
                        eq(stockId),
                        eq(MovementType.ADJUSTMENT),
                        eq("Status change: AVAILABLE -> RESERVED — Hold for customer"));
    }

    @Test
    void updateStatus_toSold_usesSaleReferenceWhenProvided() {
        UUID saleId = UUID.randomUUID();
        stock.setStockStatus(StockStatus.RESERVED);
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);
        when(stockRepository.save(stock)).thenReturn(stock);
        when(stockMapper.toResponse(stock)).thenReturn(new StockResponse(
                stockId, UUID.randomUUID(), UUID.randomUUID(), "123456789012345", null, StockStatus.SOLD));

        stockStatusService.updateStatus(
                stockId,
                new StockStatusUpdateRequest(StockStatus.SOLD, "Invoice #1001", ReferenceType.SALE, saleId));

        verify(stockMovementService)
                .recordMovement(
                        eq(stockId),
                        eq(ReferenceType.SALE),
                        eq(saleId),
                        eq(MovementType.SALE),
                        any());
    }

    @ParameterizedTest
    @EnumSource(
            value = StockStatus.class,
            names = {"SOLD", "REPAIR", "RETURNED", "DAMAGED", "LOST"})
    void updateStatus_toSold_fromUnavailable_throws(StockStatus unavailableStatus) {
        stock.setStockStatus(unavailableStatus);
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);

        assertThatThrownBy(() -> stockStatusService.updateStatus(
                        stockId, new StockStatusUpdateRequest(StockStatus.SOLD, null, null, null)))
                .isInstanceOf(InvalidStockTransitionException.class);

        verify(stockMovementService, never()).recordMovement(any(), any(), any(), any(), any());
    }

    @Test
    void assertAvailableForSale_whenAvailable_passes() {
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);

        stockStatusService.assertAvailableForSale(stockId);
    }

    @Test
    void assertAvailableForSale_whenSold_throws() {
        stock.setStockStatus(StockStatus.SOLD);
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);

        assertThatThrownBy(() -> stockStatusService.assertAvailableForSale(stockId))
                .isInstanceOf(StockNotAvailableException.class);
    }

    @Test
    void updateStatus_fromDamaged_isTerminal() {
        stock.setStockStatus(StockStatus.DAMAGED);
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);

        assertThatThrownBy(() -> stockStatusService.updateStatus(
                        stockId, new StockStatusUpdateRequest(StockStatus.AVAILABLE, null, null, null)))
                .isInstanceOf(InvalidStockTransitionException.class);
    }

    @Test
    void updateStatus_fromLost_isTerminal() {
        stock.setStockStatus(StockStatus.LOST);
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);

        assertThatThrownBy(() -> stockStatusService.updateStatus(
                        stockId, new StockStatusUpdateRequest(StockStatus.AVAILABLE, null, null, null)))
                .isInstanceOf(InvalidStockTransitionException.class);
    }

    @Test
    void updateStatus_sameStatus_rejected() {
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);

        assertThatThrownBy(() -> stockStatusService.updateStatus(
                        stockId, new StockStatusUpdateRequest(StockStatus.AVAILABLE, null, null, null)))
                .isInstanceOf(InvalidStockTransitionException.class);
    }

    @Test
    void updateStatus_soldToRepair_usesRepairMovement() {
        stock.setStockStatus(StockStatus.SOLD);
        UUID repairId = UUID.randomUUID();
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);
        when(stockRepository.save(stock)).thenReturn(stock);
        when(stockMapper.toResponse(stock)).thenReturn(new StockResponse(
                stockId, UUID.randomUUID(), UUID.randomUUID(), "123456789012345", null, StockStatus.REPAIR));

        stockStatusService.updateStatus(
                stockId,
                new StockStatusUpdateRequest(StockStatus.REPAIR, "Screen repair", ReferenceType.REPAIR, repairId));

        verify(stockMovementService)
                .recordMovement(
                        eq(stockId),
                        eq(ReferenceType.REPAIR),
                        eq(repairId),
                        eq(MovementType.REPAIR),
                        any());
    }

    @Test
    void updateStatus_returnedToAvailable_recordsReturnAdjustment() {
        stock.setStockStatus(StockStatus.RETURNED);
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);
        when(stockRepository.save(stock)).thenReturn(stock);
        when(stockMapper.toResponse(stock)).thenReturn(new StockResponse(
                stockId, UUID.randomUUID(), UUID.randomUUID(), "123456789012345", null, StockStatus.AVAILABLE));

        stockStatusService.updateStatus(
                stockId, new StockStatusUpdateRequest(StockStatus.AVAILABLE, "Restocked", null, null));

        verify(stockMovementService)
                .recordMovement(
                        eq(stockId),
                        eq(ReferenceType.SALE),
                        eq(stockId),
                        eq(MovementType.RETURN),
                        any());
    }
}
