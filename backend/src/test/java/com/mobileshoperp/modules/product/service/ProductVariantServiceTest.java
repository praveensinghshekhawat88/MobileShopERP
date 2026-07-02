package com.mobileshoperp.modules.product.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.modules.product.dto.CreateProductVariantRequest;
import com.mobileshoperp.modules.product.entity.Product;
import com.mobileshoperp.modules.product.entity.ProductVariant;
import com.mobileshoperp.modules.product.exception.DuplicateSkuException;
import com.mobileshoperp.modules.product.mapper.ProductVariantMapper;
import com.mobileshoperp.modules.product.repository.ProductVariantRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductVariantServiceTest {

    @Mock
    private ProductVariantRepository productVariantRepository;

    @Mock
    private ProductVariantMapper productVariantMapper;

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductVariantService productVariantService;

    @Test
    void createShouldRejectDuplicateSku() {
        UUID productId = UUID.randomUUID();
        CreateProductVariantRequest request =
                new CreateProductVariantRequest(productId, "SKU-001", "BAR-001", true);
        when(productService.getActiveProductOrThrow(productId)).thenReturn(new Product());
        when(productVariantRepository.findBySkuIgnoreCase("SKU-001"))
                .thenReturn(Optional.of(new ProductVariant()));

        assertThatThrownBy(() -> productVariantService.create(request)).isInstanceOf(DuplicateSkuException.class);
    }

    @Test
    void softDeleteShouldSetDeletedAtAndInactive() {
        UUID id = UUID.randomUUID();
        ProductVariant variant = new ProductVariant();
        variant.setId(id);
        variant.setProductId(UUID.randomUUID());
        variant.setSku("SKU-001");
        variant.setActive(true);
        when(productVariantRepository.findById(id)).thenReturn(Optional.of(variant));
        when(productVariantRepository.save(variant)).thenReturn(variant);

        productVariantService.softDelete(id);

        assertThat(variant.getDeletedAt()).isNotNull();
        assertThat(variant.isActive()).isFalse();
        verify(productVariantRepository).save(variant);
    }
}
