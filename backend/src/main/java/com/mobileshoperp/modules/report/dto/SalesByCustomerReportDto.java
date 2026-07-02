package com.mobileshoperp.modules.report.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record SalesByCustomerReportDto(
        UUID customerId,
        String customerName,
        String customerMobile,
        long saleCount,
        BigDecimal totalAmount) {}
