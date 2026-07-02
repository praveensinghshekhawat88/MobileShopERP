package com.mobileshoperp.modules.product.mapper;

import com.mobileshoperp.modules.product.dto.CreateProductImageRequest;
import com.mobileshoperp.modules.product.dto.ProductImageResponse;
import com.mobileshoperp.modules.product.dto.UpdateProductImageRequest;
import com.mobileshoperp.modules.product.entity.ProductImage;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ProductImageMapper {

    ProductImageResponse toResponse(ProductImage productImage);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "variantId", ignore = true)
    @Mapping(target = "displayOrder", defaultValue = "0")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    ProductImage toEntity(CreateProductImageRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "variantId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntity(UpdateProductImageRequest request, @MappingTarget ProductImage productImage);
}
