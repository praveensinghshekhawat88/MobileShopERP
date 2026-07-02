package com.mobileshoperp.modules.report.dto;

import com.mobileshoperp.common.enums.StockStatus;
import java.util.UUID;

public record StockUnitReportDto(
        UUID id,
        UUID variantId,
        String variantSku,
        String productName,
        String imei,
        String serialNumber,
        StockStatus stockStatus) {}
