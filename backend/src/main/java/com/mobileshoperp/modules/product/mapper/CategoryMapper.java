package com.mobileshoperp.modules.product.mapper;

import com.mobileshoperp.modules.product.dto.CategoryResponse;
import com.mobileshoperp.modules.product.dto.CreateCategoryRequest;
import com.mobileshoperp.modules.product.dto.UpdateCategoryRequest;
import com.mobileshoperp.modules.product.entity.Category;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryResponse toResponse(Category category);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", defaultValue = "true")
    Category toEntity(CreateCategoryRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    void updateEntity(UpdateCategoryRequest request, @MappingTarget Category category);
}
