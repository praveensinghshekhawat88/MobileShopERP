package com.mobileshoperp.modules.product.mapper;

import com.mobileshoperp.modules.product.dto.CreateProductPriceRequest;
import com.mobileshoperp.modules.product.dto.ProductPriceResponse;
import com.mobileshoperp.modules.product.entity.ProductPrice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductPriceMapper {

    ProductPriceResponse toResponse(ProductPrice productPrice);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", defaultValue = "true")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    ProductPrice toEntity(CreateProductPriceRequest request);
}
