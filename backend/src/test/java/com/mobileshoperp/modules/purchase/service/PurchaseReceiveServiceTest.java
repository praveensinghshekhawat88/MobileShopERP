package com.mobileshoperp.modules.purchase.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.modules.purchase.dto.ReceivePurchaseLineRequest;
import com.mobileshoperp.modules.purchase.dto.ReceivePurchaseRequest;
import com.mobileshoperp.modules.purchase.entity.Purchase;
import com.mobileshoperp.modules.purchase.entity.PurchaseItem;
import com.mobileshoperp.modules.purchase.exception.PurchaseAlreadyReceivedException;
import com.mobileshoperp.modules.purchase.mapper.PurchaseMapper;
import com.mobileshoperp.modules.purchase.repository.PurchaseItemRepository;
import com.mobileshoperp.modules.purchase.repository.PurchaseRepository;
import com.mobileshoperp.modules.inventory.repository.StockRepository;
import com.mobileshoperp.modules.inventory.service.StockMovementService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PurchaseReceiveServiceTest {

    @Mock
    private PurchaseRepository purchaseRepository;

    @Mock
    private PurchaseItemRepository purchaseItemRepository;

    @Mock
    private StockRepository stockRepository;

    @Mock
    private StockMovementService stockMovementService;

    @Mock
    private PurchaseService purchaseService;

    @Mock
    private PurchaseMapper purchaseMapper;

    @InjectMocks
    private PurchaseReceiveService purchaseReceiveService;

    @Test
    void receiveShouldRejectAlreadyReceivedPurchase() {
        UUID purchaseId = UUID.randomUUID();
        UUID itemId = UUID.randomUUID();
        Purchase purchase = new Purchase();
        purchase.setId(purchaseId);
        purchase.setPaymentStatus(PaymentStatus.PENDING);

        PurchaseItem item = new PurchaseItem();
        item.setId(itemId);
        item.setPurchaseId(purchaseId);
        item.setQuantity(1);

        when(purchaseService.getPurchaseOrThrow(purchaseId)).thenReturn(purchase);
        when(purchaseItemRepository.findByPurchaseIdOrderByCreatedAtAsc(purchaseId)).thenReturn(List.of(item));
        when(stockRepository.existsByPurchaseItemId(itemId)).thenReturn(true);

        ReceivePurchaseRequest request =
                new ReceivePurchaseRequest(List.of(new ReceivePurchaseLineRequest(itemId, List.of("123456789012345"))), null);

        assertThatThrownBy(() -> purchaseReceiveService.receive(purchaseId, request))
                .isInstanceOf(PurchaseAlreadyReceivedException.class);
    }
}
