package com.mobileshoperp.modules.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.domain.Page;

public record CustomerHistoryReportDto(
        UUID customerId,
        String customerName,
        String customerMobile,
        boolean customerDeleted,
        LocalDate fromDate,
        LocalDate toDate,
        long saleCount,
        BigDecimal totalAmount,
        Page<CustomerSaleHistoryItemDto> sales) {}
