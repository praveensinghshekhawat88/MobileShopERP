package com.mobileshoperp.modules.report.service;

import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.dto.CustomerHistoryReportDto;
import com.mobileshoperp.modules.report.dto.CustomerSaleHistoryItemDto;
import com.mobileshoperp.modules.report.dto.TopCustomerReportDto;
import com.mobileshoperp.modules.report.repository.CustomerReportRepository;
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
public class CustomerReportService {

    private final CustomerReportRepository customerReportRepository;

    public Page<TopCustomerReportDto> findTopCustomers(LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        validateOptionalDateRange(fromDate, toDate);
        return customerReportRepository.findTopCustomers(fromDate, toDate, pageable).map(row -> new TopCustomerReportDto(
                row.customerId(),
                row.customerName(),
                row.customerMobile(),
                row.customerDeleted(),
                row.saleCount(),
                row.totalRevenue()));
    }

    /**
     * Customer purchase ledger for a date range. Resolves soft-deleted customers (BR-050) so history
     * remains available after customer deactivation.
     */
    public CustomerHistoryReportDto getCustomerHistory(
            UUID customerId, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        validateDateRange(fromDate, toDate);
        CustomerReportRepository.CustomerRow customer =
                customerReportRepository.findCustomerIncludingDeleted(customerId);
        CustomerReportRepository.CustomerHistorySummaryRow summary =
                customerReportRepository.summarizeCustomerHistory(customerId, fromDate, toDate);
        Page<CustomerSaleHistoryItemDto> sales = customerReportRepository
                .findCustomerHistory(customerId, fromDate, toDate, pageable)
                .map(row -> new CustomerSaleHistoryItemDto(
                        row.id(), row.invoiceNumber(), row.invoiceDate(), row.totalAmount(), row.paymentStatus()));
        return new CustomerHistoryReportDto(
                customer.id(),
                customer.name(),
                customer.mobile(),
                customer.customerDeleted(),
                fromDate,
                toDate,
                summary.saleCount(),
                defaultZero(summary.totalAmount()),
                sales);
    }

    private BigDecimal defaultZero(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private void validateDateRange(LocalDate fromDate, LocalDate toDate) {
        if (fromDate == null || toDate == null) {
            throw new BusinessRuleException("fromDate and toDate are required");
        }
        if (fromDate.isAfter(toDate)) {
            throw new BusinessRuleException("fromDate must be on or before toDate");
        }
    }

    private void validateOptionalDateRange(LocalDate fromDate, LocalDate toDate) {
        if (fromDate == null && toDate == null) {
            return;
        }
        validateDateRange(fromDate, toDate);
    }
}
