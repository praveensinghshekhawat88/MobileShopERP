package com.mobileshoperp.modules.report.service;

import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.dto.PurchaseBySupplierReportDto;
import com.mobileshoperp.modules.report.dto.PurchaseReportDto;
import com.mobileshoperp.modules.report.dto.PurchaseReportSummaryDto;
import com.mobileshoperp.modules.report.repository.PurchaseReportRepository;
import java.time.LocalDate;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PurchaseReportService {

    private final PurchaseReportRepository purchaseReportRepository;

    public PurchaseReportSummaryDto getSummary(LocalDate fromDate, LocalDate toDate) {
        validateDateRange(fromDate, toDate);
        PurchaseReportRepository.PurchaseSummaryRow summary =
                purchaseReportRepository.summarize(fromDate, toDate);
        return new PurchaseReportSummaryDto(
                fromDate, toDate, summary.purchaseCount(), summary.totalAmount());
    }

    public Page<PurchaseReportDto> findPurchases(
            LocalDate fromDate,
            LocalDate toDate,
            UUID supplierId,
            PaymentStatus paymentStatus,
            Pageable pageable) {
        validateDateRange(fromDate, toDate);
        return purchaseReportRepository
                .findPurchaseReport(fromDate, toDate, supplierId, paymentStatus, pageable)
                .map(row -> new PurchaseReportDto(
                        row.id(),
                        row.invoiceNumber(),
                        row.invoiceDate(),
                        row.supplierId(),
                        row.supplierName(),
                        row.supplierMobile(),
                        row.totalAmount(),
                        row.paymentStatus()));
    }

    public Page<PurchaseBySupplierReportDto> findPurchasesBySupplier(
            LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        validateDateRange(fromDate, toDate);
        return purchaseReportRepository.findPurchasesBySupplier(fromDate, toDate, pageable).map(row ->
                new PurchaseBySupplierReportDto(
                        row.supplierId(),
                        row.supplierName(),
                        row.supplierMobile(),
                        row.purchaseCount(),
                        row.totalAmount()));
    }

    private void validateDateRange(LocalDate fromDate, LocalDate toDate) {
        if (fromDate == null || toDate == null) {
            throw new BusinessRuleException("fromDate and toDate are required");
        }
        if (fromDate.isAfter(toDate)) {
            throw new BusinessRuleException("fromDate must be on or before toDate");
        }
    }
}
