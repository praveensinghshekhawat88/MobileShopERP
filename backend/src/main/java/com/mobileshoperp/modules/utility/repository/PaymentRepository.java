package com.mobileshoperp.modules.utility.repository;

import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.modules.utility.entity.Payment;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    List<Payment> findByReferenceTypeAndReferenceIdOrderByPaymentDateDescCreatedAtDesc(
            ReferenceType referenceType, UUID referenceId);

    @Query(
            """
            SELECT COALESCE(SUM(p.amount), 0)
            FROM Payment p
            WHERE p.referenceType = :referenceType AND p.referenceId = :referenceId
            """)
    BigDecimal sumAmountByReference(
            @Param("referenceType") ReferenceType referenceType, @Param("referenceId") UUID referenceId);
}
