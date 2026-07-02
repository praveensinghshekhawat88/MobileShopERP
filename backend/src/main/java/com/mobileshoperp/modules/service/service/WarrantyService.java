package com.mobileshoperp.modules.service.service;

import com.mobileshoperp.common.enums.ClaimStatus;
import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.common.enums.StockStatus;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.inventory.entity.Stock;
import com.mobileshoperp.modules.inventory.service.StockService;
import com.mobileshoperp.modules.sales.entity.Sale;
import com.mobileshoperp.modules.sales.entity.SaleItem;
import com.mobileshoperp.modules.sales.exception.SaleItemNotFoundException;
import com.mobileshoperp.modules.sales.service.SaleService;
import com.mobileshoperp.modules.service.dto.CreateWarrantyRequest;
import com.mobileshoperp.modules.service.dto.WarrantyResponse;
import com.mobileshoperp.modules.service.entity.Warranty;
import com.mobileshoperp.modules.service.exception.DuplicateWarrantyException;
import com.mobileshoperp.modules.service.exception.WarrantyExpiredException;
import com.mobileshoperp.modules.service.exception.WarrantyNotFoundException;
import com.mobileshoperp.modules.service.mapper.WarrantyMapper;
import com.mobileshoperp.modules.service.repository.WarrantyRepository;
import com.mobileshoperp.modules.sales.repository.SaleItemRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class WarrantyService {

    private final WarrantyRepository warrantyRepository;
    private final SaleItemRepository saleItemRepository;
    private final WarrantyMapper warrantyMapper;
    private final WarrantyExpiryService warrantyExpiryService;
    private final SaleService saleService;
    private final StockService stockService;

    @Transactional(readOnly = true)
    public Page<WarrantyResponse> findAll(Pageable pageable) {
        return warrantyRepository.findAllByOrderByStartDateDesc(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public WarrantyResponse findById(UUID id) {
        return toResponse(getWarrantyOrThrow(id));
    }

    @Transactional(readOnly = true)
    public WarrantyResponse findBySaleItemId(UUID saleItemId) {
        return warrantyRepository
                .findBySaleItemId(saleItemId)
                .map(this::toResponse)
                .orElseThrow(() -> new WarrantyNotFoundException("Warranty not found for sale item: " + saleItemId));
    }

    public WarrantyResponse create(CreateWarrantyRequest request) {
        SaleItem saleItem = getSaleItemOrThrow(request.saleItemId());
        validateSoldItem(saleItem);
        validateSaleEligible(saleItem.getSaleId());

        if (warrantyRepository.findBySaleItemId(request.saleItemId()).isPresent()) {
            throw new DuplicateWarrantyException(request.saleItemId());
        }

        Sale sale = saleService.getSaleOrThrow(saleItem.getSaleId());
        Warranty warranty = new Warranty();
        warranty.setSaleItemId(request.saleItemId());
        warranty.setWarrantyMonths(request.warrantyMonths());
        warranty.setStartDate(sale.getInvoiceDate());
        warranty.setEndDate(warrantyExpiryService.calculateEndDate(sale.getInvoiceDate(), request.warrantyMonths()));
        warranty.setClaimStatus(ClaimStatus.ACTIVE);

        return toResponse(warrantyRepository.save(warranty));
    }

    public WarrantyResponse submitClaim(UUID id) {
        Warranty warranty = getWarrantyOrThrow(id);
        if (warranty.getClaimStatus() != ClaimStatus.ACTIVE) {
            throw new BusinessRuleException("Warranty claim is not in an active state: " + id);
        }
        if (warrantyExpiryService.isExpired(warranty)) {
            throw new WarrantyExpiredException(id);
        }

        warranty.setClaimStatus(ClaimStatus.CLAIMED);
        return toResponse(warrantyRepository.save(warranty));
    }

    @Transactional(readOnly = true)
    public Warranty getWarrantyOrThrow(UUID id) {
        return warrantyRepository.findById(id).orElseThrow(() -> new WarrantyNotFoundException(id));
    }

    private SaleItem getSaleItemOrThrow(UUID saleItemId) {
        return saleItemRepository.findById(saleItemId).orElseThrow(() -> new SaleItemNotFoundException(saleItemId));
    }

    private void validateSaleEligible(UUID saleId) {
        Sale sale = saleService.getSaleOrThrow(saleId);
        if (sale.getDeletedAt() != null || sale.getPaymentStatus() == PaymentStatus.REFUNDED) {
            throw new BusinessRuleException("Warranty cannot be created for a cancelled sale");
        }
    }

    private void validateSoldItem(SaleItem saleItem) {
        Stock stock = stockService.getStockOrThrow(saleItem.getStockId());
        if (stock.getStockStatus() != StockStatus.SOLD && stock.getStockStatus() != StockStatus.REPAIR) {
            throw new BusinessRuleException("Warranty can only be created for sold items");
        }
    }

    private WarrantyResponse toResponse(Warranty warranty) {
        return warrantyMapper.toResponse(warranty, warrantyExpiryService.isExpired(warranty));
    }
}
