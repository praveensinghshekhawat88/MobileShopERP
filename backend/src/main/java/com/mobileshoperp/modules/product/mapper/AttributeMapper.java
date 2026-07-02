package com.mobileshoperp.modules.product.mapper;

import com.mobileshoperp.modules.product.dto.AttributeResponse;
import com.mobileshoperp.modules.product.dto.CreateAttributeRequest;
import com.mobileshoperp.modules.product.dto.UpdateAttributeRequest;
import com.mobileshoperp.modules.product.entity.Attribute;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface AttributeMapper {

    AttributeResponse toResponse(Attribute attribute);

    @Mapping(target = "id", ignore = true)
    Attribute toEntity(CreateAttributeRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    void updateEntity(UpdateAttributeRequest request, @MappingTarget Attribute attribute);
}
