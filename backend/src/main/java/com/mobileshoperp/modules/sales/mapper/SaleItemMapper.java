package com.mobileshoperp.modules.sales.mapper;

import com.mobileshoperp.modules.sales.dto.SaleItemResponse;
import com.mobileshoperp.modules.sales.entity.SaleItem;
import java.math.BigDecimal;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SaleItemMapper {

    @Mapping(target = "lineTotal", expression = "java(calculateLineTotal(saleItem))")
    SaleItemResponse toResponse(SaleItem saleItem);

    default BigDecimal calculateLineTotal(SaleItem saleItem) {
        BigDecimal discount = saleItem.getDiscount() != null ? saleItem.getDiscount() : BigDecimal.ZERO;
        BigDecimal tax = saleItem.getTaxAmount() != null ? saleItem.getTaxAmount() : BigDecimal.ZERO;
        return saleItem.getSellingPrice().subtract(discount).add(tax);
    }
}
