package com.mobileshoperp.modules.report.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.repository.SupplierReportRepository;
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
class SupplierReportServiceTest {

    @Mock
    private SupplierReportRepository supplierReportRepository;

    @InjectMocks
    private SupplierReportService supplierReportService;

    @Test
    void findSupplierSummary_delegatesToRepository() {
        LocalDate from = LocalDate.of(2026, 1, 1);
        LocalDate to = LocalDate.of(2026, 1, 31);
        PageRequest pageable = PageRequest.of(0, 10);
        SupplierReportRepository.SupplierSummaryRow row = new SupplierReportRepository.SupplierSummaryRow(
                UUID.randomUUID(),
                "Acme Supplies",
                "8888888888",
                false,
                4L,
                new BigDecimal("60000.00"),
                new BigDecimal("15000.00"),
                new BigDecimal("45000.00"));
        when(supplierReportRepository.findSupplierSummary(from, to, pageable))
                .thenReturn(new PageImpl<>(List.of(row)));

        var page = supplierReportService.findSupplierSummary(from, to, pageable);

        assertThat(page.getContent()).hasSize(1);
        assertThat(page.getContent().getFirst().outstandingAmount()).isEqualByComparingTo("15000.00");
        assertThat(page.getContent().getFirst().paidAmount()).isEqualByComparingTo("45000.00");
    }

    @Test
    void getSupplierPurchases_returnsPurchaseLedger() {
        UUID supplierId = UUID.randomUUID();
        LocalDate from = LocalDate.of(2026, 1, 1);
        LocalDate to = LocalDate.of(2026, 1, 31);
        PageRequest pageable = PageRequest.of(0, 20);
        when(supplierReportRepository.findSupplierIncludingDeleted(supplierId))
                .thenReturn(new SupplierReportRepository.SupplierRow(supplierId, "Acme Supplies", "8888888888", false));
        when(supplierReportRepository.summarizeSupplierPurchases(supplierId, from, to))
                .thenReturn(new SupplierReportRepository.SupplierPurchaseSummaryRow(
                        2L,
                        new BigDecimal("30000.00"),
                        new BigDecimal("10000.00"),
                        new BigDecimal("20000.00")));
        when(supplierReportRepository.findSupplierPurchases(supplierId, from, to, pageable))
                .thenReturn(new PageImpl<>(List.of(new SupplierReportRepository.SupplierPurchaseRow(
                        UUID.randomUUID(),
                        "PUR-202601-0001",
                        from,
                        new BigDecimal("15000.00"),
                        PaymentStatus.PARTIAL))));

        var report = supplierReportService.getSupplierPurchases(supplierId, from, to, pageable);

        assertThat(report.purchaseCount()).isEqualTo(2L);
        assertThat(report.outstandingAmount()).isEqualByComparingTo("10000.00");
        assertThat(report.purchases().getContent()).hasSize(1);
        verify(supplierReportRepository).findSupplierIncludingDeleted(supplierId);
    }

    @Test
    void findSupplierSummary_requiresDateRange() {
        assertThatThrownBy(() -> supplierReportService.findSupplierSummary(
                        LocalDate.now(), null, PageRequest.of(0, 10)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("fromDate");
    }
}
