package com.mobileshoperp.modules.report.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.dto.SalesReportSummaryDto;
import com.mobileshoperp.modules.report.repository.SalesReportRepository;
import java.math.BigDecimal;
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
class SalesReportServiceTest {

    @Mock
    private SalesReportRepository salesReportRepository;

    @InjectMocks
    private SalesReportService salesReportService;

    @Test
    void getSummary_returnsAggregates() {
        LocalDate from = LocalDate.of(2026, 1, 1);
        LocalDate to = LocalDate.of(2026, 1, 31);
        when(salesReportRepository.summarize(from, to))
                .thenReturn(new SalesReportRepository.SalesSummaryRow(5L, new BigDecimal("12500.00")));

        SalesReportSummaryDto summary = salesReportService.getSummary(from, to);

        assertThat(summary.saleCount()).isEqualTo(5L);
        assertThat(summary.totalAmount()).isEqualByComparingTo("12500.00");
        assertThat(summary.fromDate()).isEqualTo(from);
        assertThat(summary.toDate()).isEqualTo(to);
    }

    @Test
    void getSummary_rejectsInvalidDateRange() {
        LocalDate from = LocalDate.of(2026, 2, 1);
        LocalDate to = LocalDate.of(2026, 1, 1);

        assertThatThrownBy(() -> salesReportService.getSummary(from, to))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("fromDate");
    }

    @Test
    void findSales_delegatesToRepository() {
        LocalDate from = LocalDate.of(2026, 1, 1);
        LocalDate to = LocalDate.of(2026, 1, 31);
        UUID customerId = UUID.randomUUID();
        PageRequest pageable = PageRequest.of(0, 20);
        SalesReportRepository.SalesReportRow row = new SalesReportRepository.SalesReportRow(
                UUID.randomUUID(),
                "INV-202601-0001",
                from,
                customerId,
                "John Doe",
                "9999999999",
                new BigDecimal("2500.00"),
                PaymentStatus.PAID);
        when(salesReportRepository.findSalesReport(from, to, customerId, PaymentStatus.PAID, pageable))
                .thenReturn(new PageImpl<>(List.of(row)));

        var page = salesReportService.findSales(from, to, customerId, PaymentStatus.PAID, pageable);

        assertThat(page.getContent()).hasSize(1);
        assertThat(page.getContent().getFirst().customerName()).isEqualTo("John Doe");
        verify(salesReportRepository).findSalesReport(from, to, customerId, PaymentStatus.PAID, pageable);
    }

    @Test
    void findSalesByCustomer_delegatesToRepository() {
        LocalDate from = LocalDate.of(2026, 1, 1);
        LocalDate to = LocalDate.of(2026, 1, 31);
        PageRequest pageable = PageRequest.of(0, 10);
        when(salesReportRepository.findSalesByCustomer(from, to, pageable))
                .thenReturn(new PageImpl<>(List.of()));

        salesReportService.findSalesByCustomer(from, to, pageable);

        verify(salesReportRepository).findSalesByCustomer(from, to, pageable);
    }
}
