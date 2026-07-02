package com.mobileshoperp.modules.auth.mapper;

import com.mobileshoperp.modules.auth.dto.SettingsResponse;
import com.mobileshoperp.modules.auth.dto.UpdateSettingsRequest;
import com.mobileshoperp.modules.auth.entity.Settings;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface SettingsMapper {

    SettingsResponse toResponse(Settings settings);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    void updateEntity(UpdateSettingsRequest request, @MappingTarget Settings settings);
}
