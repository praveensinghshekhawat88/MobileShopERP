package com.mobileshoperp.modules.report.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.dto.ProfitReportSummaryDto;
import com.mobileshoperp.modules.report.repository.ProfitReportRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProfitReportServiceTest {

    @Mock
    private ProfitReportRepository profitReportRepository;

    @InjectMocks
    private ProfitReportService profitReportService;

    @Test
    void getSummary_calculatesGrossAndNetProfit() {
        LocalDate from = LocalDate.of(2026, 1, 1);
        LocalDate to = LocalDate.of(2026, 1, 31);
        when(profitReportRepository.summarize(from, to))
                .thenReturn(new ProfitReportRepository.ProfitSummaryRow(
                        new BigDecimal("100000.00"),
                        new BigDecimal("70000.00"),
                        new BigDecimal("5000.00")));

        ProfitReportSummaryDto summary = profitReportService.getSummary(from, to);

        assertThat(summary.totalRevenue()).isEqualByComparingTo("100000.00");
        assertThat(summary.totalCogs()).isEqualByComparingTo("70000.00");
        assertThat(summary.totalExpenses()).isEqualByComparingTo("5000.00");
        assertThat(summary.grossProfit()).isEqualByComparingTo("30000.00");
        assertThat(summary.netProfit()).isEqualByComparingTo("25000.00");
        assertThat(summary.fromDate()).isEqualTo(from);
        assertThat(summary.toDate()).isEqualTo(to);
    }

    @Test
    void getSummary_rejectsInvalidDateRange() {
        LocalDate from = LocalDate.of(2026, 2, 1);
        LocalDate to = LocalDate.of(2026, 1, 1);

        assertThatThrownBy(() -> profitReportService.getSummary(from, to))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("fromDate");
    }
}
