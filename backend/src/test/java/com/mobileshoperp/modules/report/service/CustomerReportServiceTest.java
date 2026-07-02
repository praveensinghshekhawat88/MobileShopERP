package com.mobileshoperp.modules.report.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.repository.CustomerReportRepository;
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
class CustomerReportServiceTest {

    @Mock
    private CustomerReportRepository customerReportRepository;

    @InjectMocks
    private CustomerReportService customerReportService;

    @Test
    void findTopCustomers_delegatesToRepository() {
        PageRequest pageable = PageRequest.of(0, 10);
        CustomerReportRepository.TopCustomerRow row = new CustomerReportRepository.TopCustomerRow(
                UUID.randomUUID(), "Jane Doe", "9999999999", false, 5L, new BigDecimal("25000.00"));
        when(customerReportRepository.findTopCustomers(null, null, pageable))
                .thenReturn(new PageImpl<>(List.of(row)));

        var page = customerReportService.findTopCustomers(null, null, pageable);

        assertThat(page.getContent()).hasSize(1);
        assertThat(page.getContent().getFirst().totalRevenue()).isEqualByComparingTo("25000.00");
    }

    @Test
    void getCustomerHistory_returnsLedger() {
        UUID customerId = UUID.randomUUID();
        LocalDate from = LocalDate.of(2026, 1, 1);
        LocalDate to = LocalDate.of(2026, 1, 31);
        PageRequest pageable = PageRequest.of(0, 20);
        when(customerReportRepository.findCustomerIncludingDeleted(customerId))
                .thenReturn(new CustomerReportRepository.CustomerRow(customerId, "Jane Doe", "9999999999", true));
        when(customerReportRepository.summarizeCustomerHistory(customerId, from, to))
                .thenReturn(new CustomerReportRepository.CustomerHistorySummaryRow(2L, new BigDecimal("5000.00")));
        when(customerReportRepository.findCustomerHistory(customerId, from, to, pageable))
                .thenReturn(new PageImpl<>(List.of(new CustomerReportRepository.CustomerSaleHistoryRow(
                        UUID.randomUUID(),
                        "INV-202601-0001",
                        from,
                        new BigDecimal("2500.00"),
                        PaymentStatus.PAID))));

        var history = customerReportService.getCustomerHistory(customerId, from, to, pageable);

        assertThat(history.customerDeleted()).isTrue();
        assertThat(history.saleCount()).isEqualTo(2L);
        assertThat(history.totalAmount()).isEqualByComparingTo("5000.00");
        assertThat(history.sales().getContent()).hasSize(1);
        verify(customerReportRepository).findCustomerIncludingDeleted(customerId);
    }

    @Test
    void getCustomerHistory_requiresDateRange() {
        assertThatThrownBy(() -> customerReportService.getCustomerHistory(
                        UUID.randomUUID(), null, LocalDate.now(), PageRequest.of(0, 10)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("fromDate");
    }
}
