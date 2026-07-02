package com.mobileshoperp.modules.product.mapper;

import com.mobileshoperp.modules.product.dto.CreateProductVariantRequest;
import com.mobileshoperp.modules.product.dto.ProductVariantResponse;
import com.mobileshoperp.modules.product.dto.UpdateProductVariantRequest;
import com.mobileshoperp.modules.product.entity.ProductVariant;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ProductVariantMapper {

    ProductVariantResponse toResponse(ProductVariant productVariant);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", defaultValue = "true")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    ProductVariant toEntity(CreateProductVariantRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "productId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntity(UpdateProductVariantRequest request, @MappingTarget ProductVariant productVariant);
}
