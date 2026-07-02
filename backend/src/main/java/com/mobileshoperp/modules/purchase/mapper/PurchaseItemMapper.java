package com.mobileshoperp.modules.purchase.mapper;

import com.mobileshoperp.modules.purchase.dto.PurchaseItemResponse;
import com.mobileshoperp.modules.purchase.entity.PurchaseItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PurchaseItemMapper {

    PurchaseItemResponse toResponse(PurchaseItem purchaseItem);
}
