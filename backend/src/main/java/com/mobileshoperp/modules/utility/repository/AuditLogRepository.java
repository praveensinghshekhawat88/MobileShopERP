package com.mobileshoperp.modules.utility.repository;

import com.mobileshoperp.common.enums.AuditAction;
import com.mobileshoperp.modules.utility.entity.AuditLog;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    Page<AuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query(
            """
            SELECT a FROM AuditLog a
            WHERE (:moduleName IS NULL OR a.moduleName = :moduleName)
              AND (:tableName IS NULL OR a.tableName = :tableName)
              AND (:action IS NULL OR a.action = :action)
              AND (:userId IS NULL OR a.userId = :userId)
              AND (:recordId IS NULL OR a.recordId = :recordId)
              AND (:from IS NULL OR a.createdAt >= :from)
              AND (:to IS NULL OR a.createdAt <= :to)
            ORDER BY a.createdAt DESC
            """)
    Page<AuditLog> search(
            @Param("moduleName") String moduleName,
            @Param("tableName") String tableName,
            @Param("action") AuditAction action,
            @Param("userId") UUID userId,
            @Param("recordId") UUID recordId,
            @Param("from") Instant from,
            @Param("to") Instant to,
            Pageable pageable);
}
