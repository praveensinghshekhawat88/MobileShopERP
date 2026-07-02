package com.mobileshoperp.modules.report.service;

import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.dto.ProfitReportSummaryDto;
import com.mobileshoperp.modules.report.repository.ProfitReportRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Read-only profit reporting.
 *
 * <p>Calculation contract (date range applies to {@code sales.invoice_date} for revenue/COGS and
 * {@code expenses.expense_date} for expenses):
 *
 * <pre>
 * Revenue      = SUM(sale_items.selling_price - discount + tax_amount)
 * COGS         = SUM(purchase_items.purchase_price) via sale_items → stock → purchase_items
 * Expenses     = SUM(expenses.amount)
 * Gross Profit = Revenue - COGS
 * Net Profit   = Gross Profit - Expenses
 * </pre>
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProfitReportService {

    private final ProfitReportRepository profitReportRepository;

    public ProfitReportSummaryDto getSummary(LocalDate fromDate, LocalDate toDate) {
        validateDateRange(fromDate, toDate);
        ProfitReportRepository.ProfitSummaryRow row = profitReportRepository.summarize(fromDate, toDate);
        BigDecimal revenue = defaultZero(row.totalRevenue());
        BigDecimal cogs = defaultZero(row.totalCogs());
        BigDecimal expenses = defaultZero(row.totalExpenses());
        BigDecimal grossProfit = revenue.subtract(cogs);
        BigDecimal netProfit = grossProfit.subtract(expenses);
        return new ProfitReportSummaryDto(fromDate, toDate, revenue, cogs, expenses, grossProfit, netProfit);
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
}
