package com.mobileshoperp.modules.report.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PurchaseBySupplierReportDto(
        UUID supplierId,
        String supplierName,
        String supplierMobile,
        long purchaseCount,
        BigDecimal totalAmount) {}
