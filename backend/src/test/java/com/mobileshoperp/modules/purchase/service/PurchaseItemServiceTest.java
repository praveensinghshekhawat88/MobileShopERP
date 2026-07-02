package com.mobileshoperp.modules.purchase.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.product.entity.ProductVariant;
import com.mobileshoperp.modules.product.service.ProductVariantService;
import com.mobileshoperp.modules.purchase.dto.CreatePurchaseItemRequest;
import com.mobileshoperp.modules.purchase.dto.PurchaseItemResponse;
import com.mobileshoperp.modules.purchase.entity.Purchase;
import com.mobileshoperp.modules.purchase.entity.PurchaseItem;
import com.mobileshoperp.modules.purchase.mapper.PurchaseItemMapper;
import com.mobileshoperp.modules.purchase.repository.PurchaseItemRepository;
import com.mobileshoperp.modules.purchase.repository.PurchaseRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PurchaseItemServiceTest {

    @Mock
    private PurchaseItemRepository purchaseItemRepository;

    @Mock
    private PurchaseRepository purchaseRepository;

    @Mock
    private PurchaseItemMapper purchaseItemMapper;

    @Mock
    private PurchaseService purchaseService;

    @Mock
    private ProductVariantService productVariantService;

    @InjectMocks
    private PurchaseItemService purchaseItemService;

    @Test
    void createShouldCalculateLineTotalAndRecalculatePurchaseTotal() {
        UUID purchaseId = UUID.randomUUID();
        UUID variantId = UUID.randomUUID();
        CreatePurchaseItemRequest request =
                new CreatePurchaseItemRequest(variantId, 2, new BigDecimal("100.00"), new BigDecimal("18.00"));

        Purchase purchase = new Purchase();
        purchase.setId(purchaseId);
        purchase.setTotalAmount(BigDecimal.ZERO);

        PurchaseItem savedItem = new PurchaseItem();
        savedItem.setId(UUID.randomUUID());
        savedItem.setPurchaseId(purchaseId);
        savedItem.setVariantId(variantId);
        savedItem.setQuantity(2);
        savedItem.setPurchasePrice(new BigDecimal("100.00"));
        savedItem.setTaxAmount(new BigDecimal("18.00"));
        savedItem.setTotalAmount(new BigDecimal("218.00"));

        when(purchaseService.getPurchaseOrThrow(purchaseId)).thenReturn(purchase);
        when(productVariantService.getActiveProductVariantOrThrow(variantId)).thenReturn(new ProductVariant());
        when(purchaseItemRepository.save(any(PurchaseItem.class))).thenReturn(savedItem);
        when(purchaseItemRepository.findByPurchaseIdOrderByCreatedAtAsc(purchaseId)).thenReturn(List.of(savedItem));
        when(purchaseItemMapper.toResponse(savedItem))
                .thenReturn(new PurchaseItemResponse(
                        savedItem.getId(),
                        purchaseId,
                        variantId,
                        2,
                        new BigDecimal("100.00"),
                        new BigDecimal("18.00"),
                        new BigDecimal("218.00")));

        PurchaseItemResponse response = purchaseItemService.create(purchaseId, request);

        assertThat(response.totalAmount()).isEqualByComparingTo("218.00");
        assertThat(purchase.getTotalAmount()).isEqualByComparingTo("218.00");
        verify(purchaseRepository).save(purchase);
    }

    @Test
    void createShouldRejectNonPositivePurchasePrice() {
        UUID purchaseId = UUID.randomUUID();
        CreatePurchaseItemRequest request =
                new CreatePurchaseItemRequest(UUID.randomUUID(), 1, BigDecimal.ZERO, BigDecimal.ZERO);
        when(purchaseService.getPurchaseOrThrow(purchaseId)).thenReturn(new Purchase());
        when(productVariantService.getActiveProductVariantOrThrow(any())).thenReturn(new ProductVariant());

        assertThatThrownBy(() -> purchaseItemService.create(purchaseId, request))
                .isInstanceOf(BusinessRuleException.class);
    }
}
