package com.mobileshoperp.modules.report.repository;

import com.mobileshoperp.common.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PurchaseReportRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public Page<PurchaseReportRow> findPurchaseReport(
            LocalDate fromDate,
            LocalDate toDate,
            UUID supplierId,
            PaymentStatus paymentStatus,
            Pageable pageable) {
        MapSqlParameterSource params = baseDateParams(fromDate, toDate)
                .addValue("supplierId", supplierId)
                .addValue("paymentStatus", paymentStatus != null ? paymentStatus.name() : null);

        String filterClause =
                """
                WHERE p.deleted_at IS NULL
                  AND p.invoice_date >= :fromDate
                  AND p.invoice_date <= :toDate
                  AND (:supplierId IS NULL OR p.supplier_id = :supplierId)
                  AND (:paymentStatus IS NULL OR p.payment_status = :paymentStatus)
                """;

        Long total = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM purchases p " + filterClause, params, Long.class);

        params.addValue("limit", pageable.getPageSize());
        params.addValue("offset", pageable.getOffset());

        List<PurchaseReportRow> rows = jdbcTemplate.query(
                """
                SELECT p.id,
                       p.invoice_number,
                       p.invoice_date,
                       p.supplier_id,
                       s.supplier_name,
                       s.mobile AS supplier_mobile,
                       p.total_amount,
                       p.payment_status
                FROM purchases p
                INNER JOIN suppliers s ON s.id = p.supplier_id AND s.deleted_at IS NULL
                """
                        + filterClause
                        + """
                 ORDER BY p.invoice_date DESC, p.invoice_number DESC
                 LIMIT :limit OFFSET :offset
                """,
                params,
                (rs, rowNum) -> new PurchaseReportRow(
                        rs.getObject("id", UUID.class),
                        rs.getString("invoice_number"),
                        rs.getDate("invoice_date").toLocalDate(),
                        rs.getObject("supplier_id", UUID.class),
                        rs.getString("supplier_name"),
                        rs.getString("supplier_mobile"),
                        rs.getBigDecimal("total_amount"),
                        PaymentStatus.valueOf(rs.getString("payment_status"))));

        return new PageImpl<>(rows, pageable, total != null ? total : 0L);
    }

    public PurchaseSummaryRow summarize(LocalDate fromDate, LocalDate toDate) {
        MapSqlParameterSource params = baseDateParams(fromDate, toDate);
        return jdbcTemplate.queryForObject(
                """
                SELECT COUNT(p.id) AS purchase_count,
                       COALESCE(SUM(p.total_amount), 0) AS total_amount
                FROM purchases p
                WHERE p.deleted_at IS NULL
                  AND p.invoice_date >= :fromDate
                  AND p.invoice_date <= :toDate
                """,
                params,
                (rs, rowNum) -> new PurchaseSummaryRow(rs.getLong("purchase_count"), rs.getBigDecimal("total_amount")));
    }

    public Page<PurchaseBySupplierRow> findPurchasesBySupplier(
            LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        MapSqlParameterSource params = baseDateParams(fromDate, toDate);

        Long total = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(DISTINCT p.supplier_id)
                FROM purchases p
                WHERE p.deleted_at IS NULL
                  AND p.invoice_date >= :fromDate
                  AND p.invoice_date <= :toDate
                """,
                params,
                Long.class);

        params.addValue("limit", pageable.getPageSize());
        params.addValue("offset", pageable.getOffset());

        List<PurchaseBySupplierRow> rows = jdbcTemplate.query(
                """
                SELECT p.supplier_id,
                       s.supplier_name,
                       s.mobile AS supplier_mobile,
                       COUNT(p.id) AS purchase_count,
                       COALESCE(SUM(p.total_amount), 0) AS total_amount
                FROM purchases p
                INNER JOIN suppliers s ON s.id = p.supplier_id AND s.deleted_at IS NULL
                WHERE p.deleted_at IS NULL
                  AND p.invoice_date >= :fromDate
                  AND p.invoice_date <= :toDate
                GROUP BY p.supplier_id, s.supplier_name, s.mobile
                ORDER BY total_amount DESC, supplier_name ASC
                LIMIT :limit OFFSET :offset
                """,
                params,
                (rs, rowNum) -> new PurchaseBySupplierRow(
                        rs.getObject("supplier_id", UUID.class),
                        rs.getString("supplier_name"),
                        rs.getString("supplier_mobile"),
                        rs.getLong("purchase_count"),
                        rs.getBigDecimal("total_amount")));

        return new PageImpl<>(rows, pageable, total != null ? total : 0L);
    }

    private MapSqlParameterSource baseDateParams(LocalDate fromDate, LocalDate toDate) {
        return new MapSqlParameterSource().addValue("fromDate", fromDate).addValue("toDate", toDate);
    }

    public record PurchaseReportRow(
            UUID id,
            String invoiceNumber,
            LocalDate invoiceDate,
            UUID supplierId,
            String supplierName,
            String supplierMobile,
            BigDecimal totalAmount,
            PaymentStatus paymentStatus) {}

    public record PurchaseSummaryRow(long purchaseCount, BigDecimal totalAmount) {}

    public record PurchaseBySupplierRow(
            UUID supplierId,
            String supplierName,
            String supplierMobile,
            long purchaseCount,
            BigDecimal totalAmount) {}
}
