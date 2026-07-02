package com.mobileshoperp.modules.report.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.common.enums.RepairStatus;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.repository.RepairReportRepository;
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
class RepairReportServiceTest {

    @Mock
    private RepairReportRepository repairReportRepository;

    @InjectMocks
    private RepairReportService repairReportService;

    @Test
    void getSummary_aggregatesOpenAndDeliveredCounts() {
        LocalDate from = LocalDate.of(2026, 1, 1);
        LocalDate to = LocalDate.of(2026, 1, 31);
        when(repairReportRepository.countOpenByStatus())
                .thenReturn(List.of(
                        new RepairReportRepository.StatusCountRow(RepairStatus.RECEIVED, 2L),
                        new RepairReportRepository.StatusCountRow(RepairStatus.REPAIRING, 1L)));
        when(repairReportRepository.summarizeDelivered(from, to))
                .thenReturn(new RepairReportRepository.DeliveredSummaryRow(5L, new BigDecimal("7500.00")));

        var summary = repairReportService.getSummary(from, to);

        assertThat(summary.totalOpenRepairs()).isEqualTo(3L);
        assertThat(summary.openByStatus()).hasSize(2);
        assertThat(summary.deliveredCount()).isEqualTo(5L);
        assertThat(summary.totalDeliveredCost()).isEqualByComparingTo("7500.00");
    }

    @Test
    void findRepairs_delegatesToRepository() {
        PageRequest pageable = PageRequest.of(0, 20);
        when(repairReportRepository.findRepairs(RepairStatus.DELIVERED, null, null, pageable))
                .thenReturn(new PageImpl<>(List.of()));

        repairReportService.findRepairs(RepairStatus.DELIVERED, null, null, pageable);

        verify(repairReportRepository).findRepairs(RepairStatus.DELIVERED, null, null, pageable);
    }

    @Test
    void getSummary_requiresDateRange() {
        assertThatThrownBy(() -> repairReportService.getSummary(LocalDate.now(), null))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("fromDate");
    }
}
