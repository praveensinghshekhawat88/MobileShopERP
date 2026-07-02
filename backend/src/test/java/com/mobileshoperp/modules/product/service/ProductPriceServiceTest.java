package com.mobileshoperp.modules.product.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.common.enums.PriceType;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.product.dto.CreateProductPriceRequest;
import com.mobileshoperp.modules.product.dto.ProductPriceResponse;
import com.mobileshoperp.modules.product.entity.ProductPrice;
import com.mobileshoperp.modules.product.entity.ProductVariant;
import com.mobileshoperp.modules.product.mapper.ProductPriceMapper;
import com.mobileshoperp.modules.product.repository.ProductPriceRepository;
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
class ProductPriceServiceTest {

    @Mock
    private ProductPriceRepository productPriceRepository;

    @Mock
    private ProductPriceMapper productPriceMapper;

    @Mock
    private ProductVariantService productVariantService;

    @InjectMocks
    private ProductPriceService productPriceService;

    @Test
    void createShouldRejectNonPositivePrice() {
        UUID variantId = UUID.randomUUID();
        CreateProductPriceRequest request = new CreateProductPriceRequest(
                variantId, PriceType.RETAIL, BigDecimal.ZERO, LocalDate.now(), null, true);
        when(productVariantService.getActiveProductVariantOrThrow(variantId)).thenReturn(new ProductVariant());

        assertThatThrownBy(() -> productPriceService.create(request)).isInstanceOf(BusinessRuleException.class);
    }

    @Test
    void createShouldCloseExistingActiveRetailPrice() {
        UUID variantId = UUID.randomUUID();
        LocalDate effectiveFrom = LocalDate.of(2026, 7, 1);
        CreateProductPriceRequest request = new CreateProductPriceRequest(
                variantId, PriceType.RETAIL, new BigDecimal("999.99"), effectiveFrom, null, true);

        ProductPrice existing = new ProductPrice();
        existing.setId(UUID.randomUUID());
        existing.setVariantId(variantId);
        existing.setPriceType(PriceType.RETAIL);
        existing.setPrice(new BigDecimal("899.99"));
        existing.setEffectiveFrom(LocalDate.of(2026, 1, 1));
        existing.setActive(true);

        ProductPrice newPrice = new ProductPrice();
        newPrice.setId(UUID.randomUUID());
        newPrice.setVariantId(variantId);
        newPrice.setPriceType(PriceType.RETAIL);
        newPrice.setPrice(new BigDecimal("999.99"));
        newPrice.setEffectiveFrom(effectiveFrom);
        newPrice.setActive(true);

        when(productVariantService.getActiveProductVariantOrThrow(variantId)).thenReturn(new ProductVariant());
        when(productPriceRepository.findByVariantIdAndPriceTypeAndActiveTrue(variantId, PriceType.RETAIL))
                .thenReturn(List.of(existing));
        when(productPriceMapper.toEntity(request)).thenReturn(newPrice);
        when(productPriceRepository.save(any(ProductPrice.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(productPriceMapper.toResponse(any(ProductPrice.class)))
                .thenReturn(new ProductPriceResponse(
                        newPrice.getId(),
                        variantId,
                        PriceType.RETAIL,
                        new BigDecimal("999.99"),
                        effectiveFrom,
                        null,
                        true));

        productPriceService.create(request);

        assertThat(existing.isActive()).isFalse();
        assertThat(existing.getEffectiveTo()).isEqualTo(effectiveFrom.minusDays(1));
        verify(productPriceRepository).save(existing);
    }
}
