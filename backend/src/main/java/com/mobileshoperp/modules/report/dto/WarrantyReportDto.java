package com.mobileshoperp.modules.report.dto;

import com.mobileshoperp.common.enums.ClaimStatus;
import java.time.LocalDate;
import java.util.UUID;

public record WarrantyReportDto(
        UUID id,
        UUID saleItemId,
        UUID saleId,
        String invoiceNumber,
        UUID customerId,
        String customerName,
        String customerMobile,
        String imei,
        int warrantyMonths,
        LocalDate startDate,
        LocalDate endDate,
        ClaimStatus claimStatus,
        boolean expired) {}
