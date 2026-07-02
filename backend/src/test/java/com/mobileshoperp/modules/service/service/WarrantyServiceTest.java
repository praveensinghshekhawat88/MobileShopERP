package com.mobileshoperp.modules.service.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.common.enums.ClaimStatus;
import com.mobileshoperp.common.enums.StockStatus;
import com.mobileshoperp.modules.inventory.entity.Stock;
import com.mobileshoperp.modules.inventory.service.StockService;
import com.mobileshoperp.modules.sales.entity.Sale;
import com.mobileshoperp.modules.sales.entity.SaleItem;
import com.mobileshoperp.modules.sales.repository.SaleItemRepository;
import com.mobileshoperp.modules.sales.service.SaleService;
import com.mobileshoperp.modules.service.dto.CreateWarrantyRequest;
import com.mobileshoperp.modules.service.dto.WarrantyResponse;
import com.mobileshoperp.modules.service.entity.Warranty;
import com.mobileshoperp.modules.service.exception.DuplicateWarrantyException;
import com.mobileshoperp.modules.service.exception.WarrantyExpiredException;
import com.mobileshoperp.modules.service.mapper.WarrantyMapper;
import com.mobileshoperp.modules.service.repository.WarrantyRepository;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class WarrantyServiceTest {

    @Mock
    private WarrantyRepository warrantyRepository;

    @Mock
    private SaleItemRepository saleItemRepository;

    @Mock
    private WarrantyMapper warrantyMapper;

    @Mock
    private WarrantyExpiryService warrantyExpiryService;

    @Mock
    private SaleService saleService;

    @Mock
    private StockService stockService;

    @InjectMocks
    private WarrantyService warrantyService;

    @Test
    void create_calculatesExpiryFromSaleDate() {
        UUID saleItemId = UUID.randomUUID();
        UUID saleId = UUID.randomUUID();
        UUID stockId = UUID.randomUUID();
        LocalDate invoiceDate = LocalDate.of(2025, 6, 1);

        SaleItem saleItem = new SaleItem();
        saleItem.setId(saleItemId);
        saleItem.setSaleId(saleId);
        saleItem.setStockId(stockId);

        Sale sale = new Sale();
        sale.setId(saleId);
        sale.setInvoiceDate(invoiceDate);

        Stock stock = new Stock();
        stock.setId(stockId);
        stock.setStockStatus(StockStatus.SOLD);

        CreateWarrantyRequest request = new CreateWarrantyRequest(saleItemId, 12);

        when(saleItemRepository.findById(saleItemId)).thenReturn(Optional.of(saleItem));
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);
        when(saleService.getSaleOrThrow(saleId)).thenReturn(sale);
        when(warrantyRepository.findBySaleItemId(saleItemId)).thenReturn(Optional.empty());
        when(warrantyExpiryService.calculateEndDate(invoiceDate, 12)).thenReturn(LocalDate.of(2026, 6, 1));
        when(warrantyRepository.save(any(Warranty.class))).thenAnswer(invocation -> {
            Warranty saved = invocation.getArgument(0);
            saved.setId(UUID.randomUUID());
            return saved;
        });
        when(warrantyExpiryService.isExpired(any(Warranty.class))).thenReturn(false);
        when(warrantyMapper.toResponse(any(Warranty.class), any(Boolean.class)))
                .thenReturn(new WarrantyResponse(
                        UUID.randomUUID(),
                        saleItemId,
                        12,
                        invoiceDate,
                        LocalDate.of(2026, 6, 1),
                        ClaimStatus.ACTIVE,
                        false));

        WarrantyResponse response = warrantyService.create(request);

        assertThat(response.warrantyMonths()).isEqualTo(12);
        assertThat(response.startDate()).isEqualTo(invoiceDate);
        assertThat(response.endDate()).isEqualTo(LocalDate.of(2026, 6, 1));
        verify(warrantyExpiryService).calculateEndDate(invoiceDate, 12);
    }

    @Test
    void create_rejectsDuplicateWarranty() {
        UUID saleItemId = UUID.randomUUID();
        UUID saleId = UUID.randomUUID();
        UUID stockId = UUID.randomUUID();

        SaleItem saleItem = new SaleItem();
        saleItem.setId(saleItemId);
        saleItem.setSaleId(saleId);
        saleItem.setStockId(stockId);

        Stock stock = new Stock();
        stock.setStockStatus(StockStatus.SOLD);

        when(saleItemRepository.findById(saleItemId)).thenReturn(Optional.of(saleItem));
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);
        when(saleService.getSaleOrThrow(saleId)).thenReturn(new Sale());
        when(warrantyRepository.findBySaleItemId(saleItemId)).thenReturn(Optional.of(new Warranty()));

        assertThatThrownBy(() -> warrantyService.create(new CreateWarrantyRequest(saleItemId, 6)))
                .isInstanceOf(DuplicateWarrantyException.class);
    }

    @Test
    void submitClaim_rejectsExpiredWarranty() {
        UUID warrantyId = UUID.randomUUID();
        Warranty warranty = new Warranty();
        warranty.setId(warrantyId);
        warranty.setClaimStatus(ClaimStatus.ACTIVE);
        warranty.setEndDate(LocalDate.of(2020, 1, 1));

        when(warrantyRepository.findById(warrantyId)).thenReturn(Optional.of(warranty));
        when(warrantyExpiryService.isExpired(warranty)).thenReturn(true);

        assertThatThrownBy(() -> warrantyService.submitClaim(warrantyId)).isInstanceOf(WarrantyExpiredException.class);
    }
}
