package com.mobileshoperp.modules.service.mapper;

import com.mobileshoperp.modules.service.dto.WarrantyResponse;
import com.mobileshoperp.modules.service.entity.Warranty;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WarrantyMapper {

    default WarrantyResponse toResponse(Warranty warranty, boolean expired) {
        return new WarrantyResponse(
                warranty.getId(),
                warranty.getSaleItemId(),
                warranty.getWarrantyMonths(),
                warranty.getStartDate(),
                warranty.getEndDate(),
                warranty.getClaimStatus(),
                expired);
    }
}
