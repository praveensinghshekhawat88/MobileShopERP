package com.mobileshoperp.modules.product.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.mobileshoperp.modules.product.dto.CreateVariantAttributeRequest;
import com.mobileshoperp.modules.product.entity.Attribute;
import com.mobileshoperp.modules.product.entity.AttributeValue;
import com.mobileshoperp.modules.product.entity.ProductVariant;
import com.mobileshoperp.modules.product.entity.ProductVariantAttribute;
import com.mobileshoperp.modules.product.exception.DuplicateVariantAttributeException;
import com.mobileshoperp.modules.product.repository.AttributeValueRepository;
import com.mobileshoperp.modules.product.repository.ProductVariantAttributeRepository;
import com.mobileshoperp.common.enums.AttributeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductVariantAttributeServiceTest {

    @Mock
    private ProductVariantAttributeRepository variantAttributeRepository;

    @Mock
    private AttributeValueRepository attributeValueRepository;

    @Mock
    private ProductVariantService productVariantService;

    @Mock
    private AttributeService attributeService;

    @Mock
    private AttributeGroupService attributeGroupService;

    @InjectMocks
    private ProductVariantAttributeService variantAttributeService;

    @Test
    void assignShouldRejectDuplicateAttributeOnVariant() {
        UUID variantId = UUID.randomUUID();
        CreateVariantAttributeRequest request = new CreateVariantAttributeRequest(variantId, 2L);

        ProductVariantAttribute existing = new ProductVariantAttribute();
        existing.setId(UUID.randomUUID());
        existing.setVariantId(variantId);
        existing.setAttributeValueId(1L);

        AttributeValue existingValue = AttributeValue.builder()
                .id(1L)
                .attributeId(10L)
                .value("Black")
                .active(true)
                .build();
        AttributeValue newValue = AttributeValue.builder()
                .id(2L)
                .attributeId(10L)
                .value("Blue")
                .active(true)
                .build();

        when(productVariantService.getActiveProductVariantOrThrow(variantId)).thenReturn(new ProductVariant());
        when(attributeValueRepository.findById(2L)).thenReturn(Optional.of(newValue));
        when(variantAttributeRepository.findByVariantIdAndAttributeValueId(variantId, 2L))
                .thenReturn(Optional.empty());
        when(variantAttributeRepository.findByVariantIdOrderByCreatedAtAsc(variantId))
                .thenReturn(List.of(existing));
        when(attributeValueRepository.findById(1L)).thenReturn(Optional.of(existingValue));
        when(attributeService.getAttributeOrThrow(10L))
                .thenReturn(Attribute.builder()
                        .id(10L)
                        .attributeGroupId(1L)
                        .name("Color")
                        .attributeType(AttributeType.VARIANT)
                        .build());

        assertThatThrownBy(() -> variantAttributeService.assign(request))
                .isInstanceOf(DuplicateVariantAttributeException.class);
    }
}
