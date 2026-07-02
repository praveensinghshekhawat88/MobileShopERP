package com.mobileshoperp.modules.report.dto;

import com.mobileshoperp.common.enums.MovementType;
import com.mobileshoperp.common.enums.ReferenceType;
import java.time.Instant;
import java.util.UUID;

public record StockMovementReportDto(
        UUID id,
        UUID stockId,
        String imei,
        UUID variantId,
        String variantSku,
        String productName,
        ReferenceType referenceType,
        UUID referenceId,
        MovementType movementType,
        String remarks,
        Instant createdAt) {}
