package com.mobileshoperp.modules.service.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.UUID;

public record UpdateRepairRequest(
        UUID stockId,
        UUID customerId,
        @Size(max = 5000) String issueDescription,
        @DecimalMin(value = "0.0") BigDecimal estimatedCost,
        @DecimalMin(value = "0.0") BigDecimal actualCost) {
}
