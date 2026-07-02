package com.mobileshoperp.modules.service.dto;

import com.mobileshoperp.common.enums.ClaimStatus;
import java.time.LocalDate;
import java.util.UUID;

public record WarrantyResponse(
        UUID id,
        UUID saleItemId,
        int warrantyMonths,
        LocalDate startDate,
        LocalDate endDate,
        ClaimStatus claimStatus,
        boolean expired) {
}
