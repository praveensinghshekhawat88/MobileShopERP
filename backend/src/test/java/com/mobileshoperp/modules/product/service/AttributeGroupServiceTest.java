package com.mobileshoperp.modules.product.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.modules.product.dto.CreateAttributeGroupRequest;
import com.mobileshoperp.modules.product.entity.AttributeGroup;
import com.mobileshoperp.modules.product.exception.DuplicateAttributeGroupNameException;
import com.mobileshoperp.modules.product.mapper.AttributeGroupMapper;
import com.mobileshoperp.modules.product.repository.AttributeGroupRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AttributeGroupServiceTest {

    @Mock
    private AttributeGroupRepository attributeGroupRepository;

    @Mock
    private AttributeGroupMapper attributeGroupMapper;

    @InjectMocks
    private AttributeGroupService attributeGroupService;

    @Test
    void createShouldRejectDuplicateName() {
        CreateAttributeGroupRequest request = new CreateAttributeGroupRequest("Color");
        when(attributeGroupRepository.existsByNameIgnoreCase("Color")).thenReturn(true);

        assertThatThrownBy(() -> attributeGroupService.create(request))
                .isInstanceOf(DuplicateAttributeGroupNameException.class);
    }

    @Test
    void deleteShouldRemoveExistingGroup() {
        AttributeGroup group = AttributeGroup.builder().id(1L).name("Color").build();
        when(attributeGroupRepository.findById(1L)).thenReturn(Optional.of(group));

        attributeGroupService.delete(1L);

        verify(attributeGroupRepository).delete(group);
    }
}
