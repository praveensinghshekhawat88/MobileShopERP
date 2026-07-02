package com.mobileshoperp.modules.report.service;

import com.mobileshoperp.common.enums.ClaimStatus;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.dto.WarrantyReportDto;
import com.mobileshoperp.modules.report.dto.WarrantyReportSummaryDto;
import com.mobileshoperp.modules.report.repository.WarrantyReportRepository;
import java.time.LocalDate;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Read-only warranty reporting. All joins trace {@code warranty.sale_item_id → sale_items → sales →
 * customers} per locked schema rules.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WarrantyReportService {

    private final WarrantyReportRepository warrantyReportRepository;

    public WarrantyReportSummaryDto getSummary(int daysWithin) {
        if (daysWithin < 0) {
            throw new BusinessRuleException("daysWithin must be zero or greater");
        }
        LocalDate asOfDate = LocalDate.now();
        WarrantyReportRepository.WarrantySummaryRow summary =
                warrantyReportRepository.summarize(asOfDate, daysWithin);
        return new WarrantyReportSummaryDto(
                asOfDate, daysWithin, summary.activeCount(), summary.expiredCount(), summary.expiringSoonCount());
    }

    public Page<WarrantyReportDto> findWarranties(
            ClaimStatus claimStatus,
            UUID customerId,
            UUID saleId,
            LocalDate fromDate,
            LocalDate toDate,
            Pageable pageable) {
        validateOptionalDateRange(fromDate, toDate);
        return warrantyReportRepository
                .findWarranties(claimStatus, customerId, saleId, fromDate, toDate, pageable)
                .map(row -> new WarrantyReportDto(
                        row.id(),
                        row.saleItemId(),
                        row.saleId(),
                        row.invoiceNumber(),
                        row.customerId(),
                        row.customerName(),
                        row.customerMobile(),
                        row.imei(),
                        row.warrantyMonths(),
                        row.startDate(),
                        row.endDate(),
                        row.claimStatus(),
                        row.expired()));
    }

    private void validateOptionalDateRange(LocalDate fromDate, LocalDate toDate) {
        if (fromDate == null && toDate == null) {
            return;
        }
        if (fromDate == null || toDate == null) {
            throw new BusinessRuleException("Both fromDate and toDate are required for date range lookup");
        }
        if (fromDate.isAfter(toDate)) {
            throw new BusinessRuleException("fromDate must be on or before toDate");
        }
    }
}
