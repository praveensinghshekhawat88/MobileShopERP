package com.mobileshoperp.modules.inventory.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.common.enums.MovementType;
import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.inventory.dto.StockMovementResponse;
import com.mobileshoperp.modules.inventory.entity.Stock;
import com.mobileshoperp.modules.inventory.entity.StockMovement;
import com.mobileshoperp.modules.inventory.mapper.StockMovementMapper;
import com.mobileshoperp.modules.inventory.repository.StockMovementRepository;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
class StockMovementServiceTest {

    @Mock
    private StockMovementRepository stockMovementRepository;

    @Mock
    private StockMovementMapper stockMovementMapper;

    @Mock
    private StockService stockService;

    @InjectMocks
    private StockMovementService stockMovementService;

    @Test
    void findAll_byStockId_validatesStockExists() {
        UUID stockId = UUID.randomUUID();
        Pageable pageable = PageRequest.of(0, 20);
        StockMovement movement = new StockMovement();
        movement.setId(UUID.randomUUID());
        StockMovementResponse response = new StockMovementResponse(
                movement.getId(), stockId, ReferenceType.PURCHASE, UUID.randomUUID(),
                MovementType.PURCHASE, "received", Instant.now());

        when(stockService.getStockOrThrow(stockId)).thenReturn(new Stock());
        when(stockMovementRepository.findByStockIdOrderByCreatedAtDesc(stockId, pageable))
                .thenReturn(new PageImpl<>(java.util.List.of(movement)));
        when(stockMovementMapper.toResponse(movement)).thenReturn(response);

        var result = stockMovementService.findAll(stockId, null, null, null, null, pageable);

        assertThat(result.getContent()).containsExactly(response);
        verify(stockService).getStockOrThrow(stockId);
    }

    @Test
    void findAll_rejectsPartialReferenceFilters() {
        assertThatThrownBy(() -> stockMovementService.findAll(
                        null, ReferenceType.PURCHASE, null, null, null, PageRequest.of(0, 20)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("referenceType and referenceId");
    }

    @Test
    void findAll_rejectsPartialDateRange() {
        assertThatThrownBy(() -> stockMovementService.findAll(
                        null, null, null, Instant.now(), null, PageRequest.of(0, 20)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("from and to");
    }

    @Test
    void recordMovement_persistsMovement() {
        UUID stockId = UUID.randomUUID();
        UUID referenceId = UUID.randomUUID();
        when(stockMovementRepository.save(any(StockMovement.class))).thenAnswer(invocation -> {
            StockMovement saved = invocation.getArgument(0);
            saved.setId(UUID.randomUUID());
            return saved;
        });

        StockMovement result = stockMovementService.recordMovement(
                stockId, ReferenceType.PURCHASE, referenceId, MovementType.PURCHASE, "Purchase receive");

        assertThat(result.getStockId()).isEqualTo(stockId);
        assertThat(result.getReferenceType()).isEqualTo(ReferenceType.PURCHASE);
        assertThat(result.getReferenceId()).isEqualTo(referenceId);
        assertThat(result.getMovementType()).isEqualTo(MovementType.PURCHASE);
        verify(stockMovementRepository).save(any(StockMovement.class));
    }
}
