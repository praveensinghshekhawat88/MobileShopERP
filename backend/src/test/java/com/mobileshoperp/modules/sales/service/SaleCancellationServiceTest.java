package com.mobileshoperp.modules.sales.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.common.enums.StockStatus;
import com.mobileshoperp.modules.inventory.dto.StockResponse;
import com.mobileshoperp.modules.inventory.entity.Stock;
import com.mobileshoperp.modules.inventory.service.StockService;
import com.mobileshoperp.modules.inventory.service.StockStatusService;
import com.mobileshoperp.modules.sales.dto.SaleCompletionResponse;
import com.mobileshoperp.modules.sales.entity.Sale;
import com.mobileshoperp.modules.sales.entity.SaleItem;
import com.mobileshoperp.modules.sales.exception.SaleCannotBeModifiedException;
import com.mobileshoperp.modules.sales.repository.SaleItemRepository;
import com.mobileshoperp.modules.sales.repository.SaleRepository;
import com.mobileshoperp.modules.utility.service.PaymentService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SaleCancellationServiceTest {

    @Mock
    private SaleRepository saleRepository;

    @Mock
    private SaleItemRepository saleItemRepository;

    @Mock
    private SaleService saleService;

    @Mock
    private StockService stockService;

    @Mock
    private StockStatusService stockStatusService;

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private SaleCancellationService saleCancellationService;

    @Test
    void cancelSale_restoresSoldStock() {
        UUID saleId = UUID.randomUUID();
        UUID stockId = UUID.randomUUID();

        Sale sale = new Sale();
        sale.setId(saleId);
        sale.setCustomerId(UUID.randomUUID());
        sale.setInvoiceNumber("INV-202506-0003");
        sale.setInvoiceDate(LocalDate.now());
        sale.setTotalAmount(new BigDecimal("15000.00"));
        sale.setPaymentStatus(PaymentStatus.PENDING);

        SaleItem item = new SaleItem();
        item.setStockId(stockId);

        Stock stock = new Stock();
        stock.setId(stockId);
        stock.setStockStatus(StockStatus.SOLD);

        when(saleService.getSaleOrThrow(saleId)).thenReturn(sale);
        when(saleItemRepository.findBySaleIdOrderByCreatedAtAsc(saleId)).thenReturn(List.of(item));
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);
        when(saleItemRepository.save(item)).thenReturn(item);
        when(saleRepository.save(sale)).thenReturn(sale);
        when(paymentService.getTotalPaid(ReferenceType.SALE, saleId)).thenReturn(BigDecimal.ZERO);
        when(stockStatusService.updateStatus(any(), any(), any(), any(), any()))
                .thenReturn(new StockResponse(stockId, null, null, null, null, StockStatus.AVAILABLE));

        SaleCompletionResponse response = saleCancellationService.cancelSale(saleId);

        assertThat(response.paymentStatus()).isEqualTo(PaymentStatus.REFUNDED);
        verify(stockStatusService)
                .updateStatus(stockId, StockStatus.RETURNED, "Sale cancelled", ReferenceType.SALE, saleId);
        verify(stockStatusService)
                .updateStatus(
                        stockId,
                        StockStatus.AVAILABLE,
                        "Sale cancelled - stock restored",
                        ReferenceType.SALE,
                        saleId);
    }

    @Test
    void cancelSale_whenFullyPaid_rejects() {
        UUID saleId = UUID.randomUUID();
        Sale sale = new Sale();
        sale.setId(saleId);
        sale.setPaymentStatus(PaymentStatus.PAID);

        when(saleService.getSaleOrThrow(saleId)).thenReturn(sale);

        assertThatThrownBy(() -> saleCancellationService.cancelSale(saleId))
                .isInstanceOf(SaleCannotBeModifiedException.class);
        verify(stockStatusService, never()).updateStatus(any(), any(), any(), any(), any());
    }
}
