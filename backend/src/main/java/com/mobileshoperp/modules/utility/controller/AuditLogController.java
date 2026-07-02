package com.mobileshoperp.modules.utility.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.common.enums.AuditAction;
import com.mobileshoperp.modules.utility.dto.AuditLogResponse;
import com.mobileshoperp.modules.utility.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Audit Logs")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @Operation(summary = "Search audit logs (paginated, admin only)")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Page<AuditLogResponse>> search(
            @RequestParam(required = false) String moduleName,
            @RequestParam(required = false) String tableName,
            @RequestParam(required = false) AuditAction action,
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) UUID recordId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            Pageable pageable) {
        return ApiResponse.success(
                auditLogService.search(moduleName, tableName, action, userId, recordId, from, to, pageable));
    }

    @Operation(summary = "Get audit log by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AuditLogResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(auditLogService.findById(id));
    }
}
