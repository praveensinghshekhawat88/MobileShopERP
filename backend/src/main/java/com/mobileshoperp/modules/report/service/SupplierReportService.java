package com.mobileshoperp.modules.report.service;

import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.dto.SupplierPurchaseItemDto;
import com.mobileshoperp.modules.report.dto.SupplierPurchasesReportDto;
import com.mobileshoperp.modules.report.dto.SupplierSummaryReportDto;
import com.mobileshoperp.modules.report.repository.SupplierReportRepository;
import java.math.BigDecimal;
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
public class SupplierReportService {

    private final SupplierReportRepository supplierReportRepository;

    public Page<SupplierSummaryReportDto> findSupplierSummary(
            LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        validateDateRange(fromDate, toDate);
        return supplierReportRepository.findSupplierSummary(fromDate, toDate, pageable).map(row ->
                new SupplierSummaryReportDto(
                        row.supplierId(),
                        row.supplierName(),
                        row.supplierMobile(),
                        row.supplierDeleted(),
                        row.purchaseCount(),
                        defaultZero(row.totalSpend()),
                        defaultZero(row.outstandingAmount()),
                        defaultZero(row.paidAmount())));
    }

    public SupplierPurchasesReportDto getSupplierPurchases(
            UUID supplierId, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        validateDateRange(fromDate, toDate);
        SupplierReportRepository.SupplierRow supplier =
                supplierReportRepository.findSupplierIncludingDeleted(supplierId);
        SupplierReportRepository.SupplierPurchaseSummaryRow summary =
                supplierReportRepository.summarizeSupplierPurchases(supplierId, fromDate, toDate);
        Page<SupplierPurchaseItemDto> purchases = supplierReportRepository
                .findSupplierPurchases(supplierId, fromDate, toDate, pageable)
                .map(row -> new SupplierPurchaseItemDto(
                        row.id(), row.invoiceNumber(), row.invoiceDate(), row.totalAmount(), row.paymentStatus()));
        return new SupplierPurchasesReportDto(
                supplier.id(),
                supplier.supplierName(),
                supplier.mobile(),
                supplier.supplierDeleted(),
                fromDate,
                toDate,
                summary.purchaseCount(),
                defaultZero(summary.totalSpend()),
                defaultZero(summary.outstandingAmount()),
                defaultZero(summary.paidAmount()),
                purchases);
    }

    private BigDecimal defaultZero(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
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
