package com.mobileshoperp.modules.report.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.dto.PurchaseReportSummaryDto;
import com.mobileshoperp.modules.report.repository.PurchaseReportRepository;
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
class PurchaseReportServiceTest {

    @Mock
    private PurchaseReportRepository purchaseReportRepository;

    @InjectMocks
    private PurchaseReportService purchaseReportService;

    @Test
    void getSummary_returnsAggregates() {
        LocalDate from = LocalDate.of(2026, 1, 1);
        LocalDate to = LocalDate.of(2026, 1, 31);
        when(purchaseReportRepository.summarize(from, to))
                .thenReturn(new PurchaseReportRepository.PurchaseSummaryRow(3L, new BigDecimal("45000.00")));

        PurchaseReportSummaryDto summary = purchaseReportService.getSummary(from, to);

        assertThat(summary.purchaseCount()).isEqualTo(3L);
        assertThat(summary.totalAmount()).isEqualByComparingTo("45000.00");
        assertThat(summary.fromDate()).isEqualTo(from);
        assertThat(summary.toDate()).isEqualTo(to);
    }

    @Test
    void getSummary_rejectsInvalidDateRange() {
        LocalDate from = LocalDate.of(2026, 2, 1);
        LocalDate to = LocalDate.of(2026, 1, 1);

        assertThatThrownBy(() -> purchaseReportService.getSummary(from, to))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("fromDate");
    }

    @Test
    void findPurchases_delegatesToRepository() {
        LocalDate from = LocalDate.of(2026, 1, 1);
        LocalDate to = LocalDate.of(2026, 1, 31);
        UUID supplierId = UUID.randomUUID();
        PageRequest pageable = PageRequest.of(0, 20);
        PurchaseReportRepository.PurchaseReportRow row = new PurchaseReportRepository.PurchaseReportRow(
                UUID.randomUUID(),
                "PUR-202601-0001",
                from,
                supplierId,
                "Acme Supplies",
                "8888888888",
                new BigDecimal("15000.00"),
                PaymentStatus.PAID);
        when(purchaseReportRepository.findPurchaseReport(from, to, supplierId, PaymentStatus.PAID, pageable))
                .thenReturn(new PageImpl<>(List.of(row)));

        var page = purchaseReportService.findPurchases(from, to, supplierId, PaymentStatus.PAID, pageable);

        assertThat(page.getContent()).hasSize(1);
        assertThat(page.getContent().getFirst().supplierName()).isEqualTo("Acme Supplies");
        verify(purchaseReportRepository).findPurchaseReport(from, to, supplierId, PaymentStatus.PAID, pageable);
    }

    @Test
    void findPurchasesBySupplier_delegatesToRepository() {
        LocalDate from = LocalDate.of(2026, 1, 1);
        LocalDate to = LocalDate.of(2026, 1, 31);
        PageRequest pageable = PageRequest.of(0, 10);
        when(purchaseReportRepository.findPurchasesBySupplier(from, to, pageable))
                .thenReturn(new PageImpl<>(List.of()));

        purchaseReportService.findPurchasesBySupplier(from, to, pageable);

        verify(purchaseReportRepository).findPurchasesBySupplier(from, to, pageable);
    }
}
