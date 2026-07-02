package com.mobileshoperp.modules.report.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.common.enums.ClaimStatus;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.repository.WarrantyReportRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

@ExtendWith(MockitoExtension.class)
class WarrantyReportServiceTest {

    @Mock
    private WarrantyReportRepository warrantyReportRepository;

    @InjectMocks
    private WarrantyReportService warrantyReportService;

    @Test
    void getSummary_returnsCounts() {
        when(warrantyReportRepository.summarize(LocalDate.now(), 30))
                .thenReturn(new WarrantyReportRepository.WarrantySummaryRow(10L, 5L, 3L));

        var summary = warrantyReportService.getSummary(30);

        assertThat(summary.activeCount()).isEqualTo(10L);
        assertThat(summary.expiredCount()).isEqualTo(5L);
        assertThat(summary.expiringSoonCount()).isEqualTo(3L);
        assertThat(summary.daysWithin()).isEqualTo(30);
    }

    @Test
    void getSummary_rejectsNegativeDaysWithin() {
        assertThatThrownBy(() -> warrantyReportService.getSummary(-1))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("daysWithin");
    }

    @Test
    void findWarranties_delegatesToRepository() {
        UUID customerId = UUID.randomUUID();
        PageRequest pageable = PageRequest.of(0, 20);
        when(warrantyReportRepository.findWarranties(
                        ClaimStatus.ACTIVE, customerId, null, null, null, pageable))
                .thenReturn(new PageImpl<>(List.of()));

        warrantyReportService.findWarranties(ClaimStatus.ACTIVE, customerId, null, null, null, pageable);

        verify(warrantyReportRepository)
                .findWarranties(ClaimStatus.ACTIVE, customerId, null, null, null, pageable);
    }

    @Test
    void findWarranties_rejectsPartialDateRange() {
        assertThatThrownBy(() -> warrantyReportService.findWarranties(
                        null, null, null, LocalDate.now(), null, PageRequest.of(0, 10)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("fromDate");
    }
}
