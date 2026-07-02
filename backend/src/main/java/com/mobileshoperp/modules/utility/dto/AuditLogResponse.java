package com.mobileshoperp.modules.utility.dto;

import com.mobileshoperp.common.enums.AuditAction;
import java.time.Instant;
import java.util.UUID;

public record AuditLogResponse(
        UUID id,
        String moduleName,
        String tableName,
        UUID recordId,
        AuditAction action,
        String oldData,
        String newData,
        UUID userId,
        String ipAddress,
        Instant createdAt) {
}
