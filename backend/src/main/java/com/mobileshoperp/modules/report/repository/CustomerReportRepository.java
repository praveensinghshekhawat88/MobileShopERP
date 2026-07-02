package com.mobileshoperp.modules.report.repository;

import com.mobileshoperp.common.enums.PaymentStatus;
import com.mobileshoperp.modules.business.exception.CustomerNotFoundException;
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
public class CustomerReportRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public Page<TopCustomerRow> findTopCustomers(LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("fromDate", fromDate)
                .addValue("toDate", toDate);

        String dateFilter =
                """
                  AND (:fromDate IS NULL OR s.invoice_date >= :fromDate)
                  AND (:toDate IS NULL OR s.invoice_date <= :toDate)
                """;

        Long total = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*) FROM (
                    SELECT s.customer_id
                    FROM sales s
                    WHERE s.deleted_at IS NULL
                """
                        + dateFilter
                        + """
                     GROUP BY s.customer_id
                ) ranked
                """,
                params,
                Long.class);

        params.addValue("limit", pageable.getPageSize());
        params.addValue("offset", pageable.getOffset());

        List<TopCustomerRow> rows = jdbcTemplate.query(
                """
                SELECT c.id AS customer_id,
                       c.name AS customer_name,
                       c.mobile AS customer_mobile,
                       (c.deleted_at IS NOT NULL) AS customer_deleted,
                       COUNT(s.id) AS sale_count,
                       COALESCE(SUM(s.total_amount), 0) AS total_revenue
                FROM sales s
                INNER JOIN customers c ON c.id = s.customer_id
                WHERE s.deleted_at IS NULL
                """
                        + dateFilter
                        + """
                 GROUP BY c.id, c.name, c.mobile, c.deleted_at
                 ORDER BY total_revenue DESC, c.name ASC
                 LIMIT :limit OFFSET :offset
                """,
                params,
                (rs, rowNum) -> new TopCustomerRow(
                        rs.getObject("customer_id", UUID.class),
                        rs.getString("customer_name"),
                        rs.getString("customer_mobile"),
                        rs.getBoolean("customer_deleted"),
                        rs.getLong("sale_count"),
                        rs.getBigDecimal("total_revenue")));

        return new PageImpl<>(rows, pageable, total != null ? total : 0L);
    }

    public CustomerRow findCustomerIncludingDeleted(UUID customerId) {
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("customerId", customerId);
        try {
            return jdbcTemplate.queryForObject(
                    """
                    SELECT c.id,
                           c.name,
                           c.mobile,
                           (c.deleted_at IS NOT NULL) AS customer_deleted
                    FROM customers c
                    WHERE c.id = :customerId
                    """,
                    params,
                    (rs, rowNum) -> new CustomerRow(
                            rs.getObject("id", UUID.class),
                            rs.getString("name"),
                            rs.getString("mobile"),
                            rs.getBoolean("customer_deleted")));
        } catch (EmptyResultDataAccessException ex) {
            throw new CustomerNotFoundException(customerId);
        }
    }

    public CustomerHistorySummaryRow summarizeCustomerHistory(UUID customerId, LocalDate fromDate, LocalDate toDate) {
        MapSqlParameterSource params = baseDateParams(fromDate, toDate).addValue("customerId", customerId);
        return jdbcTemplate.queryForObject(
                """
                SELECT COUNT(s.id) AS sale_count,
                       COALESCE(SUM(s.total_amount), 0) AS total_amount
                FROM sales s
                WHERE s.customer_id = :customerId
                  AND s.deleted_at IS NULL
                  AND s.invoice_date >= :fromDate
                  AND s.invoice_date <= :toDate
                """,
                params,
                (rs, rowNum) -> new CustomerHistorySummaryRow(rs.getLong("sale_count"), rs.getBigDecimal("total_amount")));
    }

    public Page<CustomerSaleHistoryRow> findCustomerHistory(
            UUID customerId, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        MapSqlParameterSource params = baseDateParams(fromDate, toDate).addValue("customerId", customerId);

        Long total = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM sales s
                WHERE s.customer_id = :customerId
                  AND s.deleted_at IS NULL
                  AND s.invoice_date >= :fromDate
                  AND s.invoice_date <= :toDate
                """,
                params,
                Long.class);

        params.addValue("limit", pageable.getPageSize());
        params.addValue("offset", pageable.getOffset());

        List<CustomerSaleHistoryRow> rows = jdbcTemplate.query(
                """
                SELECT s.id,
                       s.invoice_number,
                       s.invoice_date,
                       s.total_amount,
                       s.payment_status
                FROM sales s
                WHERE s.customer_id = :customerId
                  AND s.deleted_at IS NULL
                  AND s.invoice_date >= :fromDate
                  AND s.invoice_date <= :toDate
                ORDER BY s.invoice_date DESC, s.invoice_number DESC
                LIMIT :limit OFFSET :offset
                """,
                params,
                (rs, rowNum) -> new CustomerSaleHistoryRow(
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

    public record TopCustomerRow(
            UUID customerId,
            String customerName,
            String customerMobile,
            boolean customerDeleted,
            long saleCount,
            BigDecimal totalRevenue) {}

    public record CustomerRow(UUID id, String name, String mobile, boolean customerDeleted) {}

    public record CustomerHistorySummaryRow(long saleCount, BigDecimal totalAmount) {}

    public record CustomerSaleHistoryRow(
            UUID id,
            String invoiceNumber,
            LocalDate invoiceDate,
            BigDecimal totalAmount,
            PaymentStatus paymentStatus) {}
}
