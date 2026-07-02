package com.mobileshoperp.modules.report.repository;

import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.modules.business.exception.SupplierNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class SupplierReportRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public Page<SupplierSummaryRow> findSupplierSummary(LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        MapSqlParameterSource params = baseDateParams(fromDate, toDate);

        Long total = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*) FROM (
                    SELECT p.supplier_id
                    FROM purchases p
                    WHERE p.deleted_at IS NULL
                      AND p.invoice_date >= :fromDate
                      AND p.invoice_date <= :toDate
                    GROUP BY p.supplier_id
                ) grouped
                """,
                params,
                Long.class);

        params.addValue("limit", pageable.getPageSize());
        params.addValue("offset", pageable.getOffset());

        List<SupplierSummaryRow> rows = jdbcTemplate.query(
                """
                SELECT s.id AS supplier_id,
                       s.supplier_name,
                       s.mobile AS supplier_mobile,
                       (s.deleted_at IS NOT NULL) AS supplier_deleted,
                       COUNT(p.id) AS purchase_count,
                       COALESCE(SUM(p.total_amount), 0) AS total_spend,
                       COALESCE(SUM(p.total_amount) FILTER (
                           WHERE p.payment_status IN ('PENDING', 'PARTIAL')), 0) AS outstanding_amount,
                       COALESCE(SUM(p.total_amount) FILTER (
                           WHERE p.payment_status = 'PAID'), 0) AS paid_amount
                FROM purchases p
                INNER JOIN suppliers s ON s.id = p.supplier_id
                WHERE p.deleted_at IS NULL
                  AND p.invoice_date >= :fromDate
                  AND p.invoice_date <= :toDate
                GROUP BY s.id, s.supplier_name, s.mobile, s.deleted_at
                ORDER BY total_spend DESC, s.supplier_name ASC
                LIMIT :limit OFFSET :offset
                """,
                params,
                (rs, rowNum) -> new SupplierSummaryRow(
                        rs.getObject("supplier_id", UUID.class),
                        rs.getString("supplier_name"),
                        rs.getString("supplier_mobile"),
                        rs.getBoolean("supplier_deleted"),
                        rs.getLong("purchase_count"),
                        rs.getBigDecimal("total_spend"),
                        rs.getBigDecimal("outstanding_amount"),
                        rs.getBigDecimal("paid_amount")));

        return new PageImpl<>(rows, pageable, total != null ? total : 0L);
    }

    public SupplierRow findSupplierIncludingDeleted(UUID supplierId) {
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("supplierId", supplierId);
        try {
            return jdbcTemplate.queryForObject(
                    """
                    SELECT s.id,
                           s.supplier_name,
                           s.mobile,
                           (s.deleted_at IS NOT NULL) AS supplier_deleted
                    FROM suppliers s
                    WHERE s.id = :supplierId
                    """,
                    params,
                    (rs, rowNum) -> new SupplierRow(
                            rs.getObject("id", UUID.class),
                            rs.getString("supplier_name"),
                            rs.getString("mobile"),
                            rs.getBoolean("supplier_deleted")));
        } catch (EmptyResultDataAccessException ex) {
            throw new SupplierNotFoundException(supplierId);
        }
    }

    public SupplierPurchaseSummaryRow summarizeSupplierPurchases(
            UUID supplierId, LocalDate fromDate, LocalDate toDate) {
        MapSqlParameterSource params = baseDateParams(fromDate, toDate).addValue("supplierId", supplierId);
        return jdbcTemplate.queryForObject(
                """
                SELECT COUNT(p.id) AS purchase_count,
                       COALESCE(SUM(p.total_amount), 0) AS total_spend,
                       COALESCE(SUM(p.total_amount) FILTER (
                           WHERE p.payment_status IN ('PENDING', 'PARTIAL')), 0) AS outstanding_amount,
                       COALESCE(SUM(p.total_amount) FILTER (
                           WHERE p.payment_status = 'PAID'), 0) AS paid_amount
                FROM purchases p
                WHERE p.supplier_id = :supplierId
                  AND p.deleted_at IS NULL
                  AND p.invoice_date >= :fromDate
                  AND p.invoice_date <= :toDate
                """,
                params,
                (rs, rowNum) -> new SupplierPurchaseSummaryRow(
                        rs.getLong("purchase_count"),
                        rs.getBigDecimal("total_spend"),
                        rs.getBigDecimal("outstanding_amount"),
                        rs.getBigDecimal("paid_amount")));
    }

    public Page<SupplierPurchaseRow> findSupplierPurchases(
            UUID supplierId, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        MapSqlParameterSource params = baseDateParams(fromDate, toDate).addValue("supplierId", supplierId);

        Long total = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM purchases p
                WHERE p.supplier_id = :supplierId
                  AND p.deleted_at IS NULL
                  AND p.invoice_date >= :fromDate
                  AND p.invoice_date <= :toDate
                """,
                params,
                Long.class);

        params.addValue("limit", pageable.getPageSize());
        params.addValue("offset", pageable.getOffset());

        List<SupplierPurchaseRow> rows = jdbcTemplate.query(
                """
                SELECT p.id,
                       p.invoice_number,
                       p.invoice_date,
                       p.total_amount,
                       p.payment_status
                FROM purchases p
                WHERE p.supplier_id = :supplierId
                  AND p.deleted_at IS NULL
                  AND p.invoice_date >= :fromDate
                  AND p.invoice_date <= :toDate
                ORDER BY p.invoice_date DESC, p.invoice_number DESC
                LIMIT :limit OFFSET :offset
                """,
                params,
                (rs, rowNum) -> new SupplierPurchaseRow(
                        rs.getObject("id", UUID.class),
                        rs.getString("invoice_number"),
                        rs.getDate("invoice_date").toLocalDate(),
                        rs.getBigDecimal("total_amount"),
                        PaymentStatus.valueOf(rs.getString("payment_status"))));

        return new PageImpl<>(rows, pageable, total != null ? total : 0L);
    }

    private MapSqlParameterSource baseDateParams(LocalDate fromDate, LocalDate toDate) {
        return new MapSqlParameterSource().addValue("fromDate", fromDate).addValue("toDate", toDate);
    }

    public record SupplierSummaryRow(
            UUID supplierId,
            String supplierName,
            String supplierMobile,
            boolean supplierDeleted,
            long purchaseCount,
            BigDecimal totalSpend,
            BigDecimal outstandingAmount,
            BigDecimal paidAmount) {}

    public record SupplierRow(UUID id, String supplierName, String mobile, boolean supplierDeleted) {}

    public record SupplierPurchaseSummaryRow(
            long purchaseCount,
            BigDecimal totalSpend,
            BigDecimal outstandingAmount,
            BigDecimal paidAmount) {}

    public record SupplierPurchaseRow(
            UUID id,
            String invoiceNumber,
            LocalDate invoiceDate,
            BigDecimal totalAmount,
            PaymentStatus paymentStatus) {}
}
