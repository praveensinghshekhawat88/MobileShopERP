package com.mobileshoperp.modules.service.entity;

import com.mobileshoperp.common.entity.BaseUuidEntity;
import com.mobileshoperp.common.enums.ClaimStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "warranty")
public class Warranty extends BaseUuidEntity {

    @Column(name = "sale_item_id", nullable = false, unique = true)
    private UUID saleItemId;

    @Column(name = "warranty_months", nullable = false)
    private int warrantyMonths;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "claim_status", nullable = false, length = 30)
    private ClaimStatus claimStatus = ClaimStatus.ACTIVE;
}
