package com.mobileshoperp.modules.product.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.common.enums.AttributeType;
import com.mobileshoperp.modules.product.dto.CreateAttributeRequest;
import com.mobileshoperp.modules.product.entity.Attribute;
import com.mobileshoperp.modules.product.entity.AttributeGroup;
import com.mobileshoperp.modules.product.exception.DuplicateAttributeNameException;
import com.mobileshoperp.modules.product.mapper.AttributeMapper;
import com.mobileshoperp.modules.product.repository.AttributeRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AttributeServiceTest {

    @Mock
    private AttributeRepository attributeRepository;

    @Mock
    private AttributeMapper attributeMapper;

    @Mock
    private AttributeGroupService attributeGroupService;

    @InjectMocks
    private AttributeService attributeService;

    @Test
    void createShouldRejectDuplicateNameInGroup() {
        CreateAttributeRequest request = new CreateAttributeRequest(1L, "Color", AttributeType.VARIANT);
        when(attributeGroupService.getAttributeGroupOrThrow(1L))
                .thenReturn(AttributeGroup.builder().id(1L).name("Appearance").build());
        when(attributeRepository.findByAttributeGroupIdAndNameIgnoreCase(1L, "Color"))
                .thenReturn(Optional.of(Attribute.builder().id(5L).build()));

        assertThatThrownBy(() -> attributeService.create(request))
                .isInstanceOf(DuplicateAttributeNameException.class);
    }

    @Test
    void deleteShouldRemoveExistingAttribute() {
        Attribute attribute = Attribute.builder()
                .id(1L)
                .attributeGroupId(1L)
                .name("Color")
                .attributeType(AttributeType.VARIANT)
                .build();
        when(attributeRepository.findById(1L)).thenReturn(Optional.of(attribute));

        attributeService.delete(1L);

        verify(attributeRepository).delete(attribute);
    }
}
