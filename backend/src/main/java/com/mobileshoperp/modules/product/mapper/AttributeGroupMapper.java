package com.mobileshoperp.modules.product.mapper;

import com.mobileshoperp.modules.product.dto.AttributeGroupResponse;
import com.mobileshoperp.modules.product.dto.CreateAttributeGroupRequest;
import com.mobileshoperp.modules.product.dto.UpdateAttributeGroupRequest;
import com.mobileshoperp.modules.product.entity.AttributeGroup;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface AttributeGroupMapper {

    AttributeGroupResponse toResponse(AttributeGroup attributeGroup);

    @Mapping(target = "id", ignore = true)
    AttributeGroup toEntity(CreateAttributeGroupRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    void updateEntity(UpdateAttributeGroupRequest request, @MappingTarget AttributeGroup attributeGroup);
}
