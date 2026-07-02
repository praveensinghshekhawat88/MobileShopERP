package com.mobileshoperp.modules.report.dto;

import com.mobileshoperp.common.enums.RepairStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record RepairReportDto(
        UUID id,
        UUID customerId,
        String customerName,
        String customerMobile,
        UUID stockId,
        String imei,
        RepairStatus repairStatus,
        String issueDescription,
        BigDecimal estimatedCost,
        BigDecimal actualCost,
        Instant createdAt,
        Instant updatedAt) {}
