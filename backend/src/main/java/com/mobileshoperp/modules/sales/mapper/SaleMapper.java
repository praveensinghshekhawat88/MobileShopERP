package com.mobileshoperp.modules.sales.mapper;

import com.mobileshoperp.modules.sales.dto.CreateSaleRequest;
import com.mobileshoperp.modules.sales.dto.SaleResponse;
import com.mobileshoperp.modules.sales.dto.UpdateSaleRequest;
import com.mobileshoperp.modules.sales.entity.Sale;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface SaleMapper {

    SaleResponse toResponse(Sale sale);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "invoiceNumber", ignore = true)
    @Mapping(target = "totalAmount", defaultValue = "0")
    @Mapping(target = "paymentStatus", defaultValue = "PENDING")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    Sale toEntity(CreateSaleRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntity(UpdateSaleRequest request, @MappingTarget Sale sale);
}
