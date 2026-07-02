package com.mobileshoperp.modules.service.mapper;

import com.mobileshoperp.modules.service.dto.CreateRepairRequest;
import com.mobileshoperp.modules.service.dto.RepairResponse;
import com.mobileshoperp.modules.service.dto.UpdateRepairRequest;
import com.mobileshoperp.modules.service.entity.Repair;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface RepairMapper {

    RepairResponse toResponse(Repair repair);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "repairStatus", constant = "RECEIVED")
    @Mapping(target = "actualCost", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    Repair toEntity(CreateRepairRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "repairStatus", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntity(UpdateRepairRequest request, @MappingTarget Repair repair);
}
