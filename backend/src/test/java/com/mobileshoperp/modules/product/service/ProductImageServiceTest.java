package com.mobileshoperp.modules.product.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.product.dto.CreateProductImageRequest;
import com.mobileshoperp.modules.product.entity.ProductVariant;
import com.mobileshoperp.modules.product.mapper.ProductImageMapper;
import com.mobileshoperp.modules.product.repository.ProductImageRepository;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductImageServiceTest {

    @Mock
    private ProductImageRepository productImageRepository;

    @Mock
    private ProductImageMapper productImageMapper;

    @Mock
    private ProductVariantService productVariantService;

    @InjectMocks
    private ProductImageService productImageService;

    @Test
    void createShouldRejectUnsupportedImageFormat() {
        UUID variantId = UUID.randomUUID();
        CreateProductImageRequest request =
                new CreateProductImageRequest("https://cdn.example.com/image.gif", 0);
        when(productVariantService.getActiveProductVariantOrThrow(variantId)).thenReturn(new ProductVariant());

        assertThatThrownBy(() -> productImageService.create(variantId, request))
                .isInstanceOf(BusinessRuleException.class);
    }
}
