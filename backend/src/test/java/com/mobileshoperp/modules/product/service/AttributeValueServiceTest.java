package com.mobileshoperp.modules.product.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.modules.product.dto.CreateAttributeValueRequest;
import com.mobileshoperp.modules.product.entity.Attribute;
import com.mobileshoperp.modules.product.entity.AttributeValue;
import com.mobileshoperp.modules.product.exception.DuplicateAttributeValueException;
import com.mobileshoperp.modules.product.mapper.AttributeValueMapper;
import com.mobileshoperp.modules.product.repository.AttributeValueRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AttributeValueServiceTest {

    @Mock
    private AttributeValueRepository attributeValueRepository;

    @Mock
    private AttributeValueMapper attributeValueMapper;

    @Mock
    private AttributeService attributeService;

    @InjectMocks
    private AttributeValueService attributeValueService;

    @Test
    void createShouldRejectDuplicateValueForAttribute() {
        CreateAttributeValueRequest request = new CreateAttributeValueRequest(1L, "Black", 0, true);
        when(attributeService.getAttributeOrThrow(1L)).thenReturn(Attribute.builder().id(1L).build());
        when(attributeValueRepository.findByAttributeIdAndValueIgnoreCase(1L, "Black"))
                .thenReturn(Optional.of(AttributeValue.builder().id(5L).build()));

        assertThatThrownBy(() -> attributeValueService.create(request))
                .isInstanceOf(DuplicateAttributeValueException.class);
    }

    @Test
    void deactivateShouldSetInactive() {
        AttributeValue attributeValue =
                AttributeValue.builder().id(1L).attributeId(1L).value("Black").active(true).build();
        when(attributeValueRepository.findById(1L)).thenReturn(Optional.of(attributeValue));
        when(attributeValueRepository.save(attributeValue)).thenReturn(attributeValue);

        attributeValueService.deactivate(1L);

        assertThat(attributeValue.isActive()).isFalse();
        verify(attributeValueRepository).save(attributeValue);
    }
}
