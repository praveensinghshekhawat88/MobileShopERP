package com.mobileshoperp.modules.purchase.service;

import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.business.service.SupplierService;
import com.mobileshoperp.modules.purchase.dto.CreatePurchaseRequest;
import com.mobileshoperp.modules.purchase.dto.PurchaseResponse;
import com.mobileshoperp.modules.purchase.dto.UpdatePurchaseRequest;
import com.mobileshoperp.modules.purchase.entity.Purchase;
import com.mobileshoperp.modules.purchase.exception.DuplicateInvoiceNumberException;
import com.mobileshoperp.modules.purchase.exception.PurchaseNotFoundException;
import com.mobileshoperp.modules.purchase.mapper.PurchaseMapper;
import com.mobileshoperp.modules.purchase.repository.PurchaseRepository;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final PurchaseMapper purchaseMapper;
    private final SupplierService supplierService;

    @Transactional(readOnly = true)
    public Page<PurchaseResponse> findAll(UUID supplierId, Pageable pageable) {
        Page<Purchase> page = supplierId == null
                ? purchaseRepository.findAllByOrderByInvoiceDateDesc(pageable)
                : purchaseRepository.findBySupplierIdOrderByInvoiceDateDesc(supplierId, pageable);
        return page.map(purchaseMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public PurchaseResponse findById(UUID id) {
        return purchaseMapper.toResponse(getPurchaseOrThrow(id));
    }

    public PurchaseResponse create(CreatePurchaseRequest request) {
        supplierService.getActiveSupplierOrThrow(request.supplierId());
        validateUniqueInvoiceNumber(request.invoiceNumber(), null);
        validateTotalAmount(request.totalAmount());
        Purchase purchase = purchaseMapper.toEntity(request);
        if (request.paymentStatus() != null) {
            purchase.setPaymentStatus(request.paymentStatus());
        }
        return purchaseMapper.toResponse(purchaseRepository.save(purchase));
    }

    public PurchaseResponse update(UUID id, UpdatePurchaseRequest request) {
        Purchase purchase = getPurchaseOrThrow(id);
        if (request.supplierId() != null) {
            supplierService.getActiveSupplierOrThrow(request.supplierId());
        }
        if (request.invoiceNumber() != null) {
            validateUniqueInvoiceNumber(request.invoiceNumber(), id);
        }
        if (request.totalAmount() != null) {
            validateTotalAmount(request.totalAmount());
        }
        purchaseMapper.updateEntity(request, purchase);
        return purchaseMapper.toResponse(purchaseRepository.save(purchase));
    }

    @Transactional(readOnly = true)
    public Purchase getPurchaseOrThrow(UUID id) {
        return purchaseRepository.findById(id).orElseThrow(() -> new PurchaseNotFoundException(id));
    }

    private void validateUniqueInvoiceNumber(String invoiceNumber, UUID excludeId) {
        purchaseRepository.findByInvoiceNumberIgnoreCase(invoiceNumber).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new DuplicateInvoiceNumberException(invoiceNumber);
            }
        });
    }

    private void validateTotalAmount(BigDecimal totalAmount) {
        if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessRuleException("Purchase total amount cannot be negative");
        }
    }
}
