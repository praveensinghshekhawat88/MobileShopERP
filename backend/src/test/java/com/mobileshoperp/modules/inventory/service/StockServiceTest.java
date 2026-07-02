package com.mobileshoperp.modules.inventory.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.mobileshoperp.modules.inventory.dto.UpdateStockRequest;
import com.mobileshoperp.modules.inventory.entity.Stock;
import com.mobileshoperp.modules.inventory.exception.DuplicateImeiException;
import com.mobileshoperp.modules.inventory.mapper.StockMapper;
import com.mobileshoperp.modules.inventory.repository.StockRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class StockServiceTest {

    @Mock
    private StockRepository stockRepository;

    @Mock
    private StockMapper stockMapper;

    @InjectMocks
    private StockService stockService;

    @Test
    void updateShouldRejectDuplicateImei() {
        UUID id = UUID.randomUUID();
        Stock stock = new Stock();
        stock.setId(id);
        stock.setImei("123456789012345");

        Stock other = new Stock();
        other.setId(UUID.randomUUID());
        other.setImei("987654321098765");

        when(stockRepository.findById(id)).thenReturn(Optional.of(stock));
        when(stockRepository.findByImei("987654321098765")).thenReturn(Optional.of(other));

        UpdateStockRequest request = new UpdateStockRequest("987654321098765", null);

        assertThatThrownBy(() -> stockService.update(id, request)).isInstanceOf(DuplicateImeiException.class);
    }
}
