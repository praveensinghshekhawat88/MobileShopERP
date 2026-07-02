package com.mobileshoperp.modules.service.repository;

import com.mobileshoperp.common.enums.RepairStatus;
import com.mobileshoperp.modules.service.entity.Repair;
import java.util.Collection;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RepairRepository extends JpaRepository<Repair, UUID> {

    Page<Repair> findByCustomerIdOrderByCreatedAtDesc(UUID customerId, Pageable pageable);

    Page<Repair> findByRepairStatusOrderByCreatedAtDesc(RepairStatus repairStatus, Pageable pageable);

    Page<Repair> findByCustomerIdAndRepairStatusOrderByCreatedAtDesc(
            UUID customerId, RepairStatus repairStatus, Pageable pageable);

    Page<Repair> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query(
            """
            SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END
            FROM Repair r
            WHERE r.stockId = :stockId
              AND r.repairStatus NOT IN :terminalStatuses
              AND (:excludeId IS NULL OR r.id <> :excludeId)
            """)
    boolean existsActiveRepairForStock(
            @Param("stockId") UUID stockId,
            @Param("terminalStatuses") Collection<RepairStatus> terminalStatuses,
            @Param("excludeId") UUID excludeId);
}
