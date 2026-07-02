package com.mobileshoperp.modules.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.domain.Page;

public record SupplierPurchasesReportDto(
        UUID supplierId,
        String supplierName,
        String supplierMobile,
        boolean supplierDeleted,
        LocalDate fromDate,
        LocalDate toDate,
        long purchaseCount,
        BigDecimal totalSpend,
        BigDecimal outstandingAmount,
        BigDecimal paidAmount,
        Page<SupplierPurchaseItemDto> purchases) {}
