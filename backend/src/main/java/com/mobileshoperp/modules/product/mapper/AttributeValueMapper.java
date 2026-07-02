package com.mobileshoperp.modules.product.mapper;

import com.mobileshoperp.modules.product.dto.AttributeValueResponse;
import com.mobileshoperp.modules.product.dto.CreateAttributeValueRequest;
import com.mobileshoperp.modules.product.dto.UpdateAttributeValueRequest;
import com.mobileshoperp.modules.product.entity.AttributeValue;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface AttributeValueMapper {

    AttributeValueResponse toResponse(AttributeValue attributeValue);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "displayOrder", defaultValue = "0")
    @Mapping(target = "active", defaultValue = "true")
    AttributeValue toEntity(CreateAttributeValueRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "attributeId", ignore = true)
    void updateEntity(UpdateAttributeValueRequest request, @MappingTarget AttributeValue attributeValue);
}
