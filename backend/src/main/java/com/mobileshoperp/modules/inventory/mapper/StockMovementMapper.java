package com.mobileshoperp.modules.inventory.mapper;

import com.mobileshoperp.modules.inventory.dto.StockMovementResponse;
import com.mobileshoperp.modules.inventory.entity.StockMovement;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StockMovementMapper {

    StockMovementResponse toResponse(StockMovement stockMovement);
}
