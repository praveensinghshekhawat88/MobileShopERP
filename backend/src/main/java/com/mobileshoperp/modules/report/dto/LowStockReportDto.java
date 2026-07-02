package com.mobileshoperp.modules.report.dto;

import java.util.UUID;

public record LowStockReportDto(
        UUID variantId,
        String variantSku,
        String productName,
        long availableCount,
        int threshold) {}
