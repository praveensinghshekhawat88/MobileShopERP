package com.mobileshoperp.modules.service.dto;

import com.mobileshoperp.common.enums.RepairStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateRepairStatusRequest(
        @NotNull RepairStatus repairStatus, @Size(max = 500) String reason) {
}
