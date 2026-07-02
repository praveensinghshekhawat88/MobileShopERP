package com.mobileshoperp.modules.report.service;

import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.dto.ExpenseReportDto;
import com.mobileshoperp.modules.report.dto.ExpenseReportSummaryDto;
import com.mobileshoperp.modules.report.dto.ExpenseSummaryBucketDto;
import com.mobileshoperp.modules.report.dto.ExpenseSummaryGroupBy;
import com.mobileshoperp.modules.report.repository.ExpenseReportRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExpenseReportService {

    private final ExpenseReportRepository expenseReportRepository;

    public ExpenseReportSummaryDto getSummary(
            LocalDate fromDate, LocalDate toDate, ExpenseSummaryGroupBy groupBy) {
        validateDateRange(fromDate, toDate);
        ExpenseSummaryGroupBy bucketGroup = groupBy != null ? groupBy : ExpenseSummaryGroupBy.DAY;
        ExpenseReportRepository.ExpenseTotalsRow totals =
                expenseReportRepository.summarizeTotals(fromDate, toDate);
        var buckets = expenseReportRepository.summarizeBuckets(fromDate, toDate, bucketGroup).stream()
                .map(row -> new ExpenseSummaryBucketDto(
                        row.periodStart(), row.expenseCount(), defaultZero(row.totalAmount())))
                .toList();
        return new ExpenseReportSummaryDto(
                fromDate,
                toDate,
                bucketGroup,
                totals.expenseCount(),
                defaultZero(totals.totalAmount()),
                buckets);
    }

    public Page<ExpenseReportDto> findExpenses(
            LocalDate fromDate, LocalDate toDate, String category, Pageable pageable) {
        validateOptionalDateRange(fromDate, toDate);
        return expenseReportRepository.findExpenses(fromDate, toDate, category, pageable).map(row -> new ExpenseReportDto(
                row.id(), row.title(), row.amount(), row.expenseDate(), row.remarks()));
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
