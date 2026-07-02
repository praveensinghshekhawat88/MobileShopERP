package com.mobileshoperp.modules.purchase.mapper;

import com.mobileshoperp.modules.purchase.dto.CreatePurchaseRequest;
import com.mobileshoperp.modules.purchase.dto.PurchaseResponse;
import com.mobileshoperp.modules.purchase.dto.UpdatePurchaseRequest;
import com.mobileshoperp.modules.purchase.entity.Purchase;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface PurchaseMapper {

    PurchaseResponse toResponse(Purchase purchase);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "paymentStatus", defaultValue = "PENDING")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    Purchase toEntity(CreatePurchaseRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntity(UpdatePurchaseRequest request, @MappingTarget Purchase purchase);
}
