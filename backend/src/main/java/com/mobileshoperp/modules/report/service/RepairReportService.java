package com.mobileshoperp.modules.report.service;

import com.mobileshoperp.common.enums.RepairStatus;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.report.dto.RepairReportDto;
import com.mobileshoperp.modules.report.dto.RepairReportSummaryDto;
import com.mobileshoperp.modules.report.dto.RepairStatusCountDto;
import com.mobileshoperp.modules.report.repository.RepairReportRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RepairReportService {

    private final RepairReportRepository repairReportRepository;

    public RepairReportSummaryDto getSummary(LocalDate fromDate, LocalDate toDate) {
        validateDateRange(fromDate, toDate);
        List<RepairStatusCountDto> openByStatus = repairReportRepository.countOpenByStatus().stream()
                .map(row -> new RepairStatusCountDto(row.status(), row.count()))
                .toList();
        long totalOpen = openByStatus.stream().mapToLong(RepairStatusCountDto::count).sum();
        RepairReportRepository.DeliveredSummaryRow delivered =
                repairReportRepository.summarizeDelivered(fromDate, toDate);
        return new RepairReportSummaryDto(
                fromDate,
                toDate,
                totalOpen,
                openByStatus,
                delivered.deliveredCount(),
                defaultZero(delivered.totalDeliveredCost()));
    }

    public Page<RepairReportDto> findRepairs(
            RepairStatus repairStatus, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        validateOptionalDateRange(fromDate, toDate);
        return repairReportRepository.findRepairs(repairStatus, fromDate, toDate, pageable).map(row -> new RepairReportDto(
                row.id(),
                row.customerId(),
                row.customerName(),
                row.customerMobile(),
                row.stockId(),
                row.imei(),
                row.repairStatus(),
                row.issueDescription(),
                row.estimatedCost(),
                row.actualCost(),
                row.createdAt(),
                row.updatedAt()));
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

    private void validateOptionalDateRange(LocalDate fromDate, LocalDate toDate) {
        if (fromDate == null && toDate == null) {
            return;
        }
        validateDateRange(fromDate, toDate);
    }
}
