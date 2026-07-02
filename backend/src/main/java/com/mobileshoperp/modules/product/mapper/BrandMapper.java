package com.mobileshoperp.modules.product.mapper;

import com.mobileshoperp.modules.product.dto.BrandResponse;
import com.mobileshoperp.modules.product.dto.CreateBrandRequest;
import com.mobileshoperp.modules.product.dto.UpdateBrandRequest;
import com.mobileshoperp.modules.product.entity.Brand;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface BrandMapper {

    BrandResponse toResponse(Brand brand);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", defaultValue = "true")
    Brand toEntity(CreateBrandRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    void updateEntity(UpdateBrandRequest request, @MappingTarget Brand brand);
}
