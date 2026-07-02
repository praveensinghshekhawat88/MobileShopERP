package com.mobileshoperp.modules.service.dto;

import com.mobileshoperp.common.enums.RepairStatus;
import java.math.BigDecimal;
import java.util.UUID;

public record RepairResponse(
        UUID id,
        UUID stockId,
        UUID customerId,
        RepairStatus repairStatus,
        String issueDescription,
        BigDecimal estimatedCost,
        BigDecimal actualCost) {
}
