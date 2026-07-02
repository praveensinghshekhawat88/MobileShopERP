package com.mobileshoperp.modules.service.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class WarrantyExpiryServiceTest {

    private final WarrantyExpiryService warrantyExpiryService = new WarrantyExpiryService();

    @Test
    void calculateEndDate_addsMonths() {
        LocalDate start = LocalDate.of(2025, 1, 15);
        assertThat(warrantyExpiryService.calculateEndDate(start, 12)).isEqualTo(LocalDate.of(2026, 1, 15));
    }

    @Test
    void isExpired_returnsTrueForPastEndDate() {
        assertThat(warrantyExpiryService.isExpired(LocalDate.of(2020, 1, 1))).isTrue();
    }
}
