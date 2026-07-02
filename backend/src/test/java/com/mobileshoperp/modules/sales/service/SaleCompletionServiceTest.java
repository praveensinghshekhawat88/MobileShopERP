package com.mobileshoperp.modules.sales.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.common.enums.PaymentMode;
import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.common.enums.StockStatus;
import com.mobileshoperp.modules.inventory.dto.StockResponse;
import com.mobileshoperp.modules.inventory.entity.Stock;
import com.mobileshoperp.modules.inventory.service.StockService;
import com.mobileshoperp.modules.inventory.service.StockStatusService;
import com.mobileshoperp.modules.sales.dto.FinalizeSaleRequest;
import com.mobileshoperp.modules.sales.dto.SaleCompletionResponse;
import com.mobileshoperp.modules.sales.entity.Sale;
import com.mobileshoperp.modules.sales.entity.SaleItem;
import com.mobileshoperp.modules.sales.exception.SaleCannotBeModifiedException;
import com.mobileshoperp.modules.sales.repository.SaleItemRepository;
import com.mobileshoperp.modules.utility.dto.PaymentResponse;
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
class SaleCompletionServiceTest {

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
    private SaleCompletionService saleCompletionService;

    @Test
    void finalizeSale_marksStockSoldAndReturnsSummary() {
        UUID saleId = UUID.randomUUID();
        UUID stockId = UUID.randomUUID();
        UUID customerId = UUID.randomUUID();

        Sale sale = new Sale();
        sale.setId(saleId);
        sale.setCustomerId(customerId);
        sale.setInvoiceNumber("INV-202506-0001");
        sale.setInvoiceDate(LocalDate.of(2025, 6, 30));
        sale.setTotalAmount(new BigDecimal("15000.00"));
        sale.setPaymentStatus(PaymentStatus.PENDING);

        SaleItem item = new SaleItem();
        item.setStockId(stockId);

        Stock stock = new Stock();
        stock.setId(stockId);
        stock.setStockStatus(StockStatus.AVAILABLE);

        when(saleService.getSaleOrThrow(saleId)).thenReturn(sale);
        when(saleItemRepository.findBySaleIdOrderByCreatedAtAsc(saleId)).thenReturn(List.of(item));
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);
        when(paymentService.getTotalPaid(ReferenceType.SALE, saleId)).thenReturn(BigDecimal.ZERO);
        when(stockStatusService.updateStatus(
                        eq(stockId),
                        eq(StockStatus.SOLD),
                        eq("Sale finalized"),
                        eq(ReferenceType.SALE),
                        eq(saleId)))
                .thenReturn(new StockResponse(stockId, null, null, null, null, StockStatus.SOLD));

        SaleCompletionResponse response = saleCompletionService.finalizeSale(saleId, null);

        assertThat(response.saleId()).isEqualTo(saleId);
        assertThat(response.itemCount()).isEqualTo(1);
        assertThat(response.paymentStatus()).isEqualTo(PaymentStatus.PENDING);
        verify(stockStatusService).assertAvailableForSale(stockId);
        verify(stockStatusService)
                .updateStatus(stockId, StockStatus.SOLD, "Sale finalized", ReferenceType.SALE, saleId);
    }

    @Test
    void finalizeSale_withInitialPayment_recordsPayment() {
        UUID saleId = UUID.randomUUID();
        UUID stockId = UUID.randomUUID();

        Sale sale = new Sale();
        sale.setId(saleId);
        sale.setCustomerId(UUID.randomUUID());
        sale.setInvoiceNumber("INV-202506-0002");
        sale.setInvoiceDate(LocalDate.now());
        sale.setTotalAmount(new BigDecimal("20000.00"));

        SaleItem item = new SaleItem();
        item.setStockId(stockId);

        Stock stock = new Stock();
        stock.setId(stockId);
        stock.setStockStatus(StockStatus.AVAILABLE);

        FinalizeSaleRequest request = new FinalizeSaleRequest(
                new FinalizeSaleRequest.InitialPaymentRequest(PaymentMode.CASH, new BigDecimal("5000.00"), null));

        when(saleService.getSaleOrThrow(saleId)).thenReturn(sale);
        when(saleItemRepository.findBySaleIdOrderByCreatedAtAsc(saleId)).thenReturn(List.of(item));
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);
        when(paymentService.recordPayment(any())).thenReturn(new PaymentResponse(
                UUID.randomUUID(),
                ReferenceType.SALE,
                saleId,
                PaymentMode.CASH,
                new BigDecimal("5000.00"),
                null,
                null));
        when(saleService.getSaleOrThrow(saleId)).thenReturn(sale);
        when(paymentService.getTotalPaid(ReferenceType.SALE, saleId)).thenReturn(new BigDecimal("5000.00"));
        when(stockStatusService.updateStatus(any(), any(), any(), any(), any()))
                .thenReturn(new StockResponse(stockId, null, null, null, null, StockStatus.SOLD));

        sale.setPaymentStatus(PaymentStatus.PARTIAL);
        SaleCompletionResponse response = saleCompletionService.finalizeSale(saleId, request);

        assertThat(response.paymentStatus()).isEqualTo(PaymentStatus.PARTIAL);
        assertThat(response.amountPaid()).isEqualByComparingTo("5000.00");
        verify(paymentService).recordPayment(any());
    }

    @Test
    void finalizeSale_whenAlreadyFinalized_rejects() {
        UUID saleId = UUID.randomUUID();
        UUID stockId = UUID.randomUUID();

        Sale sale = new Sale();
        sale.setId(saleId);

        SaleItem item = new SaleItem();
        item.setStockId(stockId);

        Stock stock = new Stock();
        stock.setId(stockId);
        stock.setStockStatus(StockStatus.SOLD);

        when(saleService.getSaleOrThrow(saleId)).thenReturn(sale);
        when(saleItemRepository.findBySaleIdOrderByCreatedAtAsc(saleId)).thenReturn(List.of(item));
        when(stockService.getStockOrThrow(stockId)).thenReturn(stock);

        assertThatThrownBy(() -> saleCompletionService.finalizeSale(saleId, null))
                .isInstanceOf(SaleCannotBeModifiedException.class);
        verify(stockStatusService, never()).updateStatus(any(), any(), any(), any(), any());
    }
}
