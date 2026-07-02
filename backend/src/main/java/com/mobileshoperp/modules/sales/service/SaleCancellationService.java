package com.mobileshoperp.modules.sales.service;

import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.common.enums.StockStatus;
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
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class SaleCancellationService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final SaleService saleService;
    private final StockService stockService;
    private final StockStatusService stockStatusService;
    private final PaymentService paymentService;

    public SaleCompletionResponse cancelSale(UUID saleId) {
        Sale sale = saleService.getSaleOrThrow(saleId);
        if (sale.getDeletedAt() != null || sale.getPaymentStatus() == PaymentStatus.REFUNDED) {
            throw new SaleCannotBeModifiedException(saleId, "Sale is already cancelled");
        }
        if (sale.getPaymentStatus() == PaymentStatus.PAID) {
            throw new SaleCannotBeModifiedException(saleId, "Fully paid sale cannot be cancelled");
        }

        List<SaleItem> items = saleItemRepository.findBySaleIdOrderByCreatedAtAsc(saleId);
        restoreStockIfFinalized(saleId, items);

        Instant deletedAt = Instant.now();
        for (SaleItem item : items) {
            item.setDeletedAt(deletedAt);
            saleItemRepository.save(item);
        }

        sale.setPaymentStatus(PaymentStatus.REFUNDED);
        sale.setDeletedAt(deletedAt);
        saleRepository.save(sale);

        return buildResponse(sale, items.size());
    }

    private void restoreStockIfFinalized(UUID saleId, List<SaleItem> items) {
        for (SaleItem item : items) {
            Stock stock = stockService.getStockOrThrow(item.getStockId());
            if (stock.getStockStatus() != StockStatus.SOLD) {
                continue;
            }
            stockStatusService.updateStatus(
                    item.getStockId(),
                    StockStatus.RETURNED,
                    "Sale cancelled",
                    ReferenceType.SALE,
                    saleId);
            stockStatusService.updateStatus(
                    item.getStockId(),
                    StockStatus.AVAILABLE,
                    "Sale cancelled - stock restored",
                    ReferenceType.SALE,
                    saleId);
        }
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
}
