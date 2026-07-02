package com.mobileshoperp.modules.report.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record TopCustomerReportDto(
        UUID customerId,
        String customerName,
        String customerMobile,
        boolean customerDeleted,
        long saleCount,
        BigDecimal totalRevenue) {}
