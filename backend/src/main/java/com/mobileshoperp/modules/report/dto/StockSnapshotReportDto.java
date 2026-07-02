package com.mobileshoperp.modules.report.dto;

import com.mobileshoperp.common.enums.StockStatus;
import java.util.UUID;

public record StockSnapshotReportDto(
        UUID variantId,
        String variantSku,
        String productName,
        StockStatus stockStatus,
        long quantity) {}
