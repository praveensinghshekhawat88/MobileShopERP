package com.mobileshoperp.modules.sales.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.modules.inventory.entity.Stock;
import com.mobileshoperp.modules.inventory.exception.StockNotAvailableException;
import com.mobileshoperp.modules.inventory.service.StockService;
import com.mobileshoperp.modules.inventory.service.StockStatusService;
import com.mobileshoperp.modules.product.service.ProductPriceService;
import com.mobileshoperp.modules.sales.dto.CreateSaleItemRequest;
import com.mobileshoperp.modules.sales.entity.Sale;
import com.mobileshoperp.modules.sales.entity.SaleItem;
import com.mobileshoperp.modules.sales.exception.StockAlreadyOnSaleException;
import com.mobileshoperp.modules.sales.mapper.SaleItemMapper;
import com.mobileshoperp.modules.sales.repository.SaleItemRepository;
import com.mobileshoperp.modules.sales.repository.SaleRepository;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SaleItemServiceTest {

    @Mock
    private SaleItemRepository saleItemRepository;

    @Mock
    private SaleRepository saleRepository;

    @Mock
    private SaleItemMapper saleItemMapper;

    @Mock
    private SaleService saleService;

    @Mock
    private StockService stockService;

    @Mock
    private StockStatusService stockStatusService;

    @Mock
    private ProductPriceService productPriceService;

    @InjectMocks
    private SaleItemService saleItemService;

    @Test
    void createShouldRejectUnavailableStock() {
        UUID saleId = UUID.randomUUID();
        UUID stockId = UUID.randomUUID();
        CreateSaleItemRequest request =
                new CreateSaleItemRequest(stockId, new BigDecimal("15000.00"), null, null);

        when(saleService.getSaleOrThrow(saleId)).thenReturn(new Sale());
        org.mockito.Mockito.doThrow(new StockNotAvailableException(stockId))
                .when(stockStatusService)
                .assertAvailableForSale(stockId);

        assertThatThrownBy(() -> saleItemService.create(saleId, request))
                .isInstanceOf(StockNotAvailableException.class);
        verify(saleItemRepository, never()).save(any());
    }

    @Test
    void createShouldRejectDuplicateStock() {
        UUID saleId = UUID.randomUUID();
        UUID stockId = UUID.randomUUID();
        CreateSaleItemRequest request =
                new CreateSaleItemRequest(stockId, new BigDecimal("15000.00"), null, null);

        when(saleService.getSaleOrThrow(saleId)).thenReturn(new Sale());
        when(saleItemRepository.findByStockId(stockId)).thenReturn(Optional.of(new SaleItem()));

        assertThatThrownBy(() -> saleItemService.create(saleId, request))
                .isInstanceOf(StockAlreadyOnSaleException.class);
        verify(saleItemRepository, never()).save(any());
    }
}
