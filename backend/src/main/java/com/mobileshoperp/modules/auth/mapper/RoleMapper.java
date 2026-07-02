package com.mobileshoperp.modules.auth.mapper;

import com.mobileshoperp.modules.auth.dto.CreateRoleRequest;
import com.mobileshoperp.modules.auth.dto.RoleResponse;
import com.mobileshoperp.modules.auth.dto.UpdateRoleRequest;
import com.mobileshoperp.modules.auth.entity.Role;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    RoleResponse toResponse(Role role);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", defaultValue = "true")
    Role toEntity(CreateRoleRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    void updateEntity(UpdateRoleRequest request, @MappingTarget Role role);
}
