package com.mobileshoperp.modules.utility.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mobileshoperp.common.enums.AuditAction;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.utility.dto.AuditLogResponse;
import com.mobileshoperp.modules.utility.entity.AuditLog;
import com.mobileshoperp.modules.utility.exception.AuditLogNotFoundException;
import com.mobileshoperp.modules.utility.mapper.AuditLogMapper;
import com.mobileshoperp.modules.utility.repository.AuditLogRepository;
import java.time.Instant;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuditLogService {

    private static final Set<String> SENSITIVE_FIELDS =
            Set.of("password", "accessToken", "refreshToken", "token", "secret");

    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;
    private final ObjectMapper objectMapper;

    public void recordCreate(
            String moduleName, String tableName, UUID recordId, Object newData, UUID userId, String ipAddress) {
        save(buildLog(moduleName, tableName, recordId, AuditAction.CREATE, null, newData, userId, ipAddress));
    }

    public void recordUpdate(
            String moduleName,
            String tableName,
            UUID recordId,
            Object oldData,
            Object newData,
            UUID userId,
            String ipAddress) {
        save(buildLog(moduleName, tableName, recordId, AuditAction.UPDATE, oldData, newData, userId, ipAddress));
    }

    public void recordDelete(
            String moduleName, String tableName, UUID recordId, Object oldData, UUID userId, String ipAddress) {
        save(buildLog(moduleName, tableName, recordId, AuditAction.DELETE, oldData, null, userId, ipAddress));
    }

    public void recordLogin(UUID userId, String ipAddress) {
        save(buildLog("auth", "users", userId, AuditAction.LOGIN, null, null, userId, ipAddress));
    }

    @Transactional(readOnly = true)
    public Page<AuditLogResponse> search(
            String moduleName,
            String tableName,
            AuditAction action,
            UUID userId,
            UUID recordId,
            Instant from,
            Instant to,
            Pageable pageable) {
        validateDateRange(from, to);
        return auditLogRepository
                .search(moduleName, tableName, action, userId, recordId, from, to, pageable)
                .map(auditLogMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public AuditLogResponse findById(UUID id) {
        return auditLogMapper.toResponse(getAuditLogOrThrow(id));
    }

    @Transactional(readOnly = true)
    public AuditLog getAuditLogOrThrow(UUID id) {
        return auditLogRepository.findById(id).orElseThrow(() -> new AuditLogNotFoundException(id));
    }

    private AuditLog buildLog(
            String moduleName,
            String tableName,
            UUID recordId,
            AuditAction action,
            Object oldData,
            Object newData,
            UUID userId,
            String ipAddress) {
        AuditLog log = new AuditLog();
        log.setModuleName(moduleName);
        log.setTableName(tableName);
        log.setRecordId(recordId);
        log.setAction(action);
        log.setOldData(toSafeJson(oldData));
        log.setNewData(toSafeJson(newData));
        log.setUserId(userId);
        log.setIpAddress(ipAddress);
        log.setCreatedAt(Instant.now());
        return log;
    }

    private void save(AuditLog auditLog) {
        auditLogRepository.save(auditLog);
    }

    private String toSafeJson(Object data) {
        if (data == null) {
            return null;
        }
        try {
            JsonNode node = objectMapper.valueToTree(data);
            sanitize(node);
            return objectMapper.writeValueAsString(node);
        } catch (JsonProcessingException ex) {
            throw new BusinessRuleException("Unable to serialize audit payload");
        }
    }

    private void sanitize(JsonNode node) {
        if (node == null) {
            return;
        }
        if (node.isObject()) {
            ObjectNode objectNode = (ObjectNode) node;
            Iterator<Map.Entry<String, JsonNode>> fields = objectNode.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> field = fields.next();
                if (SENSITIVE_FIELDS.contains(field.getKey())) {
                    objectNode.put(field.getKey(), "[REDACTED]");
                } else {
                    sanitize(field.getValue());
                }
            }
            return;
        }
        if (node.isArray()) {
            node.forEach(this::sanitize);
        }
    }

    private void validateDateRange(Instant from, Instant to) {
        if (from == null && to == null) {
            return;
        }
        if (from == null || to == null) {
            throw new BusinessRuleException("Both from and to are required for date range filter");
        }
        if (from.isAfter(to)) {
            throw new BusinessRuleException("'from' must be before or equal to 'to'");
        }
    }
}
