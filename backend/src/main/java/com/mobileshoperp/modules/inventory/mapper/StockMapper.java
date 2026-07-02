package com.mobileshoperp.modules.inventory.mapper;

import com.mobileshoperp.modules.inventory.dto.StockResponse;
import com.mobileshoperp.modules.inventory.dto.UpdateStockRequest;
import com.mobileshoperp.modules.inventory.entity.Stock;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface StockMapper {

    StockResponse toResponse(Stock stock);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "purchaseItemId", ignore = true)
    @Mapping(target = "variantId", ignore = true)
    @Mapping(target = "stockStatus", ignore = true)
    @Mapping(target = "imei", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntity(UpdateStockRequest request, @MappingTarget Stock stock);
}
