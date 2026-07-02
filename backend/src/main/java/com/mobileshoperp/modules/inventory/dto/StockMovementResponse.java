package com.mobileshoperp.modules.inventory.dto;

import com.mobileshoperp.common.enums.MovementType;
import com.mobileshoperp.common.enums.ReferenceType;
import java.time.Instant;
import java.util.UUID;

public record StockMovementResponse(
        UUID id,
        UUID stockId,
        ReferenceType referenceType,
        UUID referenceId,
        MovementType movementType,
        String remarks,
        Instant createdAt) {
}
