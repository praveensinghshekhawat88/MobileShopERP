package com.mobileshoperp.modules.purchase.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.mobileshoperp.modules.business.entity.Supplier;
import com.mobileshoperp.modules.business.service.SupplierService;
import com.mobileshoperp.modules.purchase.dto.CreatePurchaseRequest;
import com.mobileshoperp.modules.purchase.entity.Purchase;
import com.mobileshoperp.modules.purchase.exception.DuplicateInvoiceNumberException;
import com.mobileshoperp.modules.purchase.mapper.PurchaseMapper;
import com.mobileshoperp.modules.purchase.repository.PurchaseRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PurchaseServiceTest {

    @Mock
    private PurchaseRepository purchaseRepository;

    @Mock
    private PurchaseMapper purchaseMapper;

    @Mock
    private SupplierService supplierService;

    @InjectMocks
    private PurchaseService purchaseService;

    @Test
    void createShouldRejectDuplicateInvoiceNumber() {
        UUID supplierId = UUID.randomUUID();
        CreatePurchaseRequest request = new CreatePurchaseRequest(
                supplierId, "INV-001", LocalDate.now(), BigDecimal.ZERO, null);
        when(supplierService.getActiveSupplierOrThrow(supplierId)).thenReturn(new Supplier());
        when(purchaseRepository.findByInvoiceNumberIgnoreCase("INV-001"))
                .thenReturn(Optional.of(new Purchase()));

        assertThatThrownBy(() -> purchaseService.create(request))
                .isInstanceOf(DuplicateInvoiceNumberException.class);
    }
}
