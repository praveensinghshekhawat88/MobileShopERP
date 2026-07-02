package com.mobileshoperp.modules.inventory.dto;

import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.common.enums.StockStatus;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record StockStatusUpdateRequest(
        @NotNull StockStatus newStatus,
        String reason,
        ReferenceType referenceType,
        UUID referenceId) {
}
