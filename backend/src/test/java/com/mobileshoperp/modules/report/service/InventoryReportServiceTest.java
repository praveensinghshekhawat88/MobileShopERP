package com.mobileshoperp.modules.report.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.common.enums.StockStatus;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.repository.InventoryReportRepository;
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
class InventoryReportServiceTest {

    @Mock
    private InventoryReportRepository inventoryReportRepository;

    @InjectMocks
    private InventoryReportService inventoryReportService;

    @Test
    void findCurrentSnapshot_delegatesToRepository() {
        UUID variantId = UUID.randomUUID();
        PageRequest pageable = PageRequest.of(0, 20);
        InventoryReportRepository.StockSnapshotRow row = new InventoryReportRepository.StockSnapshotRow(
                variantId, "SKU-001", "iPhone 15", StockStatus.AVAILABLE, 12L);
        when(inventoryReportRepository.findCurrentSnapshot(variantId, StockStatus.AVAILABLE, pageable))
                .thenReturn(new PageImpl<>(List.of(row)));

        var page = inventoryReportService.findCurrentSnapshot(variantId, StockStatus.AVAILABLE, pageable);

        assertThat(page.getContent()).hasSize(1);
        assertThat(page.getContent().getFirst().quantity()).isEqualTo(12L);
        verify(inventoryReportRepository).findCurrentSnapshot(variantId, StockStatus.AVAILABLE, pageable);
    }

    @Test
    void findCurrentByImei_requiresImei() {
        assertThatThrownBy(() -> inventoryReportService.findCurrentByImei("  ", PageRequest.of(0, 10)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("imei");
    }

    @Test
    void findCurrentByImei_delegatesToRepository() {
        PageRequest pageable = PageRequest.of(0, 10);
        when(inventoryReportRepository.findCurrentByImei("12345", pageable))
                .thenReturn(new PageImpl<>(List.of()));

        inventoryReportService.findCurrentByImei("12345", pageable);

        verify(inventoryReportRepository).findCurrentByImei("12345", pageable);
    }

    @Test
    void findLowStock_rejectsNegativeThreshold() {
        assertThatThrownBy(() -> inventoryReportService.findLowStock(-1, PageRequest.of(0, 10)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("threshold");
    }

    @Test
    void findMovements_rejectsPartialReferenceFilters() {
        assertThatThrownBy(() -> inventoryReportService.findMovements(
                        null, null, null, null, UUID.randomUUID(), null, null, null, PageRequest.of(0, 10)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("referenceType");
    }
}
