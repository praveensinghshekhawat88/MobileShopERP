package com.mobileshoperp.modules.sales.service;

import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.common.enums.StockStatus;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.inventory.entity.Stock;
import com.mobileshoperp.modules.inventory.service.StockService;
import com.mobileshoperp.modules.inventory.service.StockStatusService;
import com.mobileshoperp.modules.sales.dto.FinalizeSaleRequest;
import com.mobileshoperp.modules.sales.dto.SaleCompletionResponse;
import com.mobileshoperp.modules.sales.entity.Sale;
import com.mobileshoperp.modules.sales.entity.SaleItem;
import com.mobileshoperp.modules.sales.exception.SaleCannotBeModifiedException;
import com.mobileshoperp.modules.sales.repository.SaleItemRepository;
import com.mobileshoperp.modules.utility.dto.RecordPaymentRequest;
import com.mobileshoperp.modules.utility.service.PaymentService;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class SaleCompletionService {

    private final SaleItemRepository saleItemRepository;
    private final SaleService saleService;
    private final StockService stockService;
    private final StockStatusService stockStatusService;
    private final PaymentService paymentService;

    public SaleCompletionResponse finalizeSale(UUID saleId, FinalizeSaleRequest request) {
        Sale sale = saleService.getSaleOrThrow(saleId);
        assertSaleOpen(sale);

        List<SaleItem> items = saleItemRepository.findBySaleIdOrderByCreatedAtAsc(saleId);
        if (items.isEmpty()) {
            throw new BusinessRuleException("Sale has no line items to finalize");
        }

        SaleFinalizationState state = resolveFinalizationState(items);
        if (state == SaleFinalizationState.FINALIZED) {
            throw new SaleCannotBeModifiedException(saleId, "Sale is already finalized");
        }
        if (state == SaleFinalizationState.PARTIAL) {
            throw new SaleCannotBeModifiedException(saleId, "Sale has inconsistent stock state");
        }

        for (SaleItem item : items) {
            stockStatusService.assertAvailableForSale(item.getStockId());
            stockStatusService.updateStatus(
                    item.getStockId(),
                    StockStatus.SOLD,
                    "Sale finalized",
                    ReferenceType.SALE,
                    saleId);
        }

        if (request != null && request.initialPayment() != null) {
            FinalizeSaleRequest.InitialPaymentRequest payment = request.initialPayment();
            paymentService.recordPayment(new RecordPaymentRequest(
                    ReferenceType.SALE,
                    saleId,
                    payment.paymentMode(),
                    payment.amount(),
                    payment.transactionNumber(),
                    null));
        }

        sale = saleService.getSaleOrThrow(saleId);
        return buildResponse(sale, items.size());
    }

    private void assertSaleOpen(Sale sale) {
        if (sale.getDeletedAt() != null) {
            throw new SaleCannotBeModifiedException(sale.getId(), "Sale is cancelled");
        }
        if (sale.getPaymentStatus() == PaymentStatus.REFUNDED) {
            throw new SaleCannotBeModifiedException(sale.getId(), "Sale is cancelled");
        }
    }

    private SaleFinalizationState resolveFinalizationState(List<SaleItem> items) {
        int soldCount = 0;
        for (SaleItem item : items) {
            Stock stock = stockService.getStockOrThrow(item.getStockId());
            if (stock.getStockStatus() == StockStatus.SOLD) {
                soldCount++;
            } else if (stock.getStockStatus() != StockStatus.AVAILABLE
                    && stock.getStockStatus() != StockStatus.RESERVED) {
                return SaleFinalizationState.PARTIAL;
            }
        }
        if (soldCount == 0) {
            return SaleFinalizationState.DRAFT;
        }
        if (soldCount == items.size()) {
            return SaleFinalizationState.FINALIZED;
        }
        return SaleFinalizationState.PARTIAL;
    }

    private SaleCompletionResponse buildResponse(Sale sale, int itemCount) {
        BigDecimal paid = paymentService.getTotalPaid(ReferenceType.SALE, sale.getId());
        BigDecimal balance = sale.getTotalAmount().subtract(paid).max(BigDecimal.ZERO);
        return new SaleCompletionResponse(
                sale.getId(),
                sale.getInvoiceNumber(),
                sale.getInvoiceDate(),
                sale.getCustomerId(),
                sale.getTotalAmount(),
                sale.getPaymentStatus(),
                paid,
                balance,
                itemCount);
    }

    private enum SaleFinalizationState {
        DRAFT,
        FINALIZED,
        PARTIAL
    }
}
