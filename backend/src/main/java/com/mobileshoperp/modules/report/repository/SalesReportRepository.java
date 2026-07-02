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
public class SalesReportRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public Page<SalesReportRow> findSalesReport(
            LocalDate fromDate,
            LocalDate toDate,
            UUID customerId,
            PaymentStatus paymentStatus,
            Pageable pageable) {
        MapSqlParameterSource params = baseDateParams(fromDate, toDate)
                .addValue("customerId", customerId)
                .addValue("paymentStatus", paymentStatus != null ? paymentStatus.name() : null);

        String filterClause =
                """
                WHERE s.deleted_at IS NULL
                  AND s.invoice_date >= :fromDate
                  AND s.invoice_date <= :toDate
                  AND (:customerId IS NULL OR s.customer_id = :customerId)
                  AND (:paymentStatus IS NULL OR s.payment_status = :paymentStatus)
                """;

        Long total = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM sales s " + filterClause, params, Long.class);

        params.addValue("limit", pageable.getPageSize());
        params.addValue("offset", pageable.getOffset());

        List<SalesReportRow> rows = jdbcTemplate.query(
                """
                SELECT s.id,
                       s.invoice_number,
                       s.invoice_date,
                       s.customer_id,
                       c.name AS customer_name,
                       c.mobile AS customer_mobile,
                       s.total_amount,
                       s.payment_status
                FROM sales s
                INNER JOIN customers c ON c.id = s.customer_id AND c.deleted_at IS NULL
                """
                        + filterClause
                        + """
                 ORDER BY s.invoice_date DESC, s.invoice_number DESC
                 LIMIT :limit OFFSET :offset
                """,
                params,
                (rs, rowNum) -> new SalesReportRow(
                        rs.getObject("id", UUID.class),
                        rs.getString("invoice_number"),
                        rs.getDate("invoice_date").toLocalDate(),
                        rs.getObject("customer_id", UUID.class),
                        rs.getString("customer_name"),
                        rs.getString("customer_mobile"),
                        rs.getBigDecimal("total_amount"),
                        PaymentStatus.valueOf(rs.getString("payment_status"))));

        return new PageImpl<>(rows, pageable, total != null ? total : 0L);
    }

    public SalesSummaryRow summarize(LocalDate fromDate, LocalDate toDate) {
        MapSqlParameterSource params = baseDateParams(fromDate, toDate);
        return jdbcTemplate.queryForObject(
                """
                SELECT COUNT(s.id) AS sale_count,
                       COALESCE(SUM(s.total_amount), 0) AS total_amount
                FROM sales s
                WHERE s.deleted_at IS NULL
                  AND s.invoice_date >= :fromDate
                  AND s.invoice_date <= :toDate
                """,
                params,
                (rs, rowNum) -> new SalesSummaryRow(rs.getLong("sale_count"), rs.getBigDecimal("total_amount")));
    }

    public Page<SalesByCustomerRow> findSalesByCustomer(
            LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        MapSqlParameterSource params = baseDateParams(fromDate, toDate);

        Long total = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(DISTINCT s.customer_id)
                FROM sales s
                WHERE s.deleted_at IS NULL
                  AND s.invoice_date >= :fromDate
                  AND s.invoice_date <= :toDate
                """,
                params,
                Long.class);

        params.addValue("limit", pageable.getPageSize());
        params.addValue("offset", pageable.getOffset());

        List<SalesByCustomerRow> rows = jdbcTemplate.query(
                """
                SELECT s.customer_id,
                       c.name AS customer_name,
                       c.mobile AS customer_mobile,
                       COUNT(s.id) AS sale_count,
                       COALESCE(SUM(s.total_amount), 0) AS total_amount
                FROM sales s
                INNER JOIN customers c ON c.id = s.customer_id AND c.deleted_at IS NULL
                WHERE s.deleted_at IS NULL
                  AND s.invoice_date >= :fromDate
                  AND s.invoice_date <= :toDate
                GROUP BY s.customer_id, c.name, c.mobile
                ORDER BY total_amount DESC, customer_name ASC
                LIMIT :limit OFFSET :offset
                """,
                params,
                (rs, rowNum) -> new SalesByCustomerRow(
                        rs.getObject("customer_id", UUID.class),
                        rs.getString("customer_name"),
                        rs.getString("customer_mobile"),
                        rs.getLong("sale_count"),
                        rs.getBigDecimal("total_amount")));

        return new PageImpl<>(rows, pageable, total != null ? total : 0L);
    }

    private MapSqlParameterSource baseDateParams(LocalDate fromDate, LocalDate toDate) {
        return new MapSqlParameterSource().addValue("fromDate", fromDate).addValue("toDate", toDate);
    }

    public record SalesReportRow(
            UUID id,
            String invoiceNumber,
            LocalDate invoiceDate,
            UUID customerId,
            String customerName,
            String customerMobile,
            BigDecimal totalAmount,
            PaymentStatus paymentStatus) {}

    public record SalesSummaryRow(long saleCount, BigDecimal totalAmount) {}

    public record SalesByCustomerRow(
            UUID customerId,
            String customerName,
            String customerMobile,
            long saleCount,
            BigDecimal totalAmount) {}
}
