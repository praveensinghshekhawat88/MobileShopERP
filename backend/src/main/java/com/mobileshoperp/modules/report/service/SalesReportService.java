package com.mobileshoperp.modules.report.service;

import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.dto.SalesByCustomerReportDto;
import com.mobileshoperp.modules.report.dto.SalesReportDto;
import com.mobileshoperp.modules.report.dto.SalesReportSummaryDto;
import com.mobileshoperp.modules.report.repository.SalesReportRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SalesReportService {

    private final SalesReportRepository salesReportRepository;

    public SalesReportSummaryDto getSummary(LocalDate fromDate, LocalDate toDate) {
        validateDateRange(fromDate, toDate);
        SalesReportRepository.SalesSummaryRow summary = salesReportRepository.summarize(fromDate, toDate);
        return new SalesReportSummaryDto(fromDate, toDate, summary.saleCount(), summary.totalAmount());
    }

    public Page<SalesReportDto> findSales(
            LocalDate fromDate,
            LocalDate toDate,
            UUID customerId,
            PaymentStatus paymentStatus,
            Pageable pageable) {
        validateDateRange(fromDate, toDate);
        return salesReportRepository
                .findSalesReport(fromDate, toDate, customerId, paymentStatus, pageable)
                .map(row -> new SalesReportDto(
                        row.id(),
                        row.invoiceNumber(),
                        row.invoiceDate(),
                        row.customerId(),
                        row.customerName(),
                        row.customerMobile(),
                        row.totalAmount(),
                        row.paymentStatus()));
    }

    public Page<SalesByCustomerReportDto> findSalesByCustomer(
            LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        validateDateRange(fromDate, toDate);
        return salesReportRepository.findSalesByCustomer(fromDate, toDate, pageable).map(row -> new SalesByCustomerReportDto(
                row.customerId(),
                row.customerName(),
                row.customerMobile(),
                row.saleCount(),
                row.totalAmount()));
    }

    private void validateDateRange(LocalDate fromDate, LocalDate toDate) {
        if (fromDate == null || toDate == null) {
            throw new BusinessRuleException("fromDate and toDate are required");
        }
        if (fromDate.isAfter(toDate)) {
            throw new BusinessRuleException("fromDate must be on or before toDate");
        }
    }
}
