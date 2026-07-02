package com.mobileshoperp.modules.utility.mapper;

import com.mobileshoperp.modules.utility.dto.AuditLogResponse;
import com.mobileshoperp.modules.utility.entity.AuditLog;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AuditLogMapper {

    AuditLogResponse toResponse(AuditLog auditLog);
}
