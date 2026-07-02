package com.mobileshoperp.modules.report.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.dto.ExpenseSummaryGroupBy;
import com.mobileshoperp.modules.report.repository.ExpenseReportRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

@ExtendWith(MockitoExtension.class)
class ExpenseReportServiceTest {

    @Mock
    private ExpenseReportRepository expenseReportRepository;

    @InjectMocks
    private ExpenseReportService expenseReportService;

    @Test
    void getSummary_returnsTotalsAndBuckets() {
        LocalDate from = LocalDate.of(2026, 1, 1);
        LocalDate to = LocalDate.of(2026, 1, 31);
        when(expenseReportRepository.summarizeTotals(from, to))
                .thenReturn(new ExpenseReportRepository.ExpenseTotalsRow(3L, new BigDecimal("4500.00")));
        when(expenseReportRepository.summarizeBuckets(from, to, ExpenseSummaryGroupBy.DAY))
                .thenReturn(List.of(new ExpenseReportRepository.ExpenseBucketRow(
                        from, 1L, new BigDecimal("1500.00"))));

        var summary = expenseReportService.getSummary(from, to, ExpenseSummaryGroupBy.DAY);

        assertThat(summary.totalExpenseCount()).isEqualTo(3L);
        assertThat(summary.totalAmount()).isEqualByComparingTo("4500.00");
        assertThat(summary.buckets()).hasSize(1);
        assertThat(summary.groupBy()).isEqualTo(ExpenseSummaryGroupBy.DAY);
    }

    @Test
    void findExpenses_delegatesToRepository() {
        PageRequest pageable = PageRequest.of(0, 20);
        when(expenseReportRepository.findExpenses(null, null, "Rent", pageable))
                .thenReturn(new PageImpl<>(List.of()));

        expenseReportService.findExpenses(null, null, "Rent", pageable);

        verify(expenseReportRepository).findExpenses(null, null, "Rent", pageable);
    }

    @Test
    void getSummary_requiresDateRange() {
        assertThatThrownBy(() -> expenseReportService.getSummary(LocalDate.now(), null, ExpenseSummaryGroupBy.DAY))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("fromDate");
    }
}
