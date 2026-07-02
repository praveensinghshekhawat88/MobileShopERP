package com.mobileshoperp.modules.utility.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mobileshoperp.common.enums.AuditAction;
import com.mobileshoperp.modules.utility.entity.AuditLog;
import com.mobileshoperp.modules.utility.mapper.AuditLogMapper;
import com.mobileshoperp.modules.utility.repository.AuditLogRepository;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AuditLogServiceTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @Mock
    private AuditLogMapper auditLogMapper;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private AuditLogService auditLogService;

    @Test
    void recordLogin_persistsLoginAudit() {
        UUID userId = UUID.randomUUID();
        when(auditLogRepository.save(any(AuditLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        auditLogService.recordLogin(userId, "127.0.0.1");

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(captor.capture());
        AuditLog saved = captor.getValue();
        assertThat(saved.getAction()).isEqualTo(AuditAction.LOGIN);
        assertThat(saved.getUserId()).isEqualTo(userId);
        assertThat(saved.getModuleName()).isEqualTo("auth");
        assertThat(saved.getIpAddress()).isEqualTo("127.0.0.1");
    }

    @Test
    void recordCreate_redactsSensitiveFields() {
        UUID recordId = UUID.randomUUID();
        when(auditLogRepository.save(any(AuditLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        auditLogService.recordCreate(
                "auth",
                "users",
                recordId,
                Map.of("mobile", "9999999999", "password", "secret"),
                UUID.randomUUID(),
                "10.0.0.1");

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(captor.capture());
        assertThat(captor.getValue().getNewData()).contains("[REDACTED]");
        assertThat(captor.getValue().getNewData()).doesNotContain("secret");
    }
}
