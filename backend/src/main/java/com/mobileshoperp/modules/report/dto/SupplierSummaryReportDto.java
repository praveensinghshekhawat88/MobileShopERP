package com.mobileshoperp.modules.report.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record SupplierSummaryReportDto(
        UUID supplierId,
        String supplierName,
        String supplierMobile,
        boolean supplierDeleted,
        long purchaseCount,
        BigDecimal totalSpend,
        BigDecimal outstandingAmount,
        BigDecimal paidAmount) {}
