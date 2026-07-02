package com.mobileshoperp.modules.report.repository;

import com.mobileshoperp.common.enums.ClaimStatus;
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
public class WarrantyReportRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public WarrantySummaryRow summarize(LocalDate asOfDate, int daysWithin) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("asOfDate", asOfDate)
                .addValue("expiringBy", asOfDate.plusDays(daysWithin));

        return jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*) FILTER (
                           WHERE w.end_date >= :asOfDate) AS active_count,
                       COUNT(*) FILTER (
                           WHERE w.end_date < :asOfDate) AS expired_count,
                       COUNT(*) FILTER (
                           WHERE w.end_date >= :asOfDate AND w.end_date <= :expiringBy) AS expiring_soon_count
                FROM warranty w
                INNER JOIN sale_items si ON si.id = w.sale_item_id AND si.deleted_at IS NULL
                INNER JOIN sales s ON s.id = si.sale_id AND s.deleted_at IS NULL
                WHERE w.deleted_at IS NULL
                """,
                params,
                (rs, rowNum) -> new WarrantySummaryRow(
                        rs.getLong("active_count"),
                        rs.getLong("expired_count"),
                        rs.getLong("expiring_soon_count")));
    }

    public Page<WarrantyRow> findWarranties(
            ClaimStatus claimStatus,
            UUID customerId,
            UUID saleId,
            LocalDate fromDate,
            LocalDate toDate,
            Pageable pageable) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("claimStatus", claimStatus != null ? claimStatus.name() : null)
                .addValue("customerId", customerId)
                .addValue("saleId", saleId)
                .addValue("fromDate", fromDate)
                .addValue("toDate", toDate)
                .addValue("asOfDate", LocalDate.now());

        String filterClause =
                """
                WHERE w.deleted_at IS NULL
                  AND si.deleted_at IS NULL
                  AND s.deleted_at IS NULL
                  AND (:claimStatus IS NULL OR w.claim_status = :claimStatus)
                  AND (:customerId IS NULL OR s.customer_id = :customerId)
                  AND (:saleId IS NULL OR s.id = :saleId)
                  AND (:fromDate IS NULL OR w.end_date >= :fromDate)
                  AND (:toDate IS NULL OR w.end_date <= :toDate)
                """;

        Long total = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM warranty w
                INNER JOIN sale_items si ON si.id = w.sale_item_id
                INNER JOIN sales s ON s.id = si.sale_id
                """
                        + filterClause,
                params,
                Long.class);

        params.addValue("limit", pageable.getPageSize());
        params.addValue("offset", pageable.getOffset());

        List<WarrantyRow> rows = jdbcTemplate.query(
                """
                SELECT w.id,
                       w.sale_item_id,
                       s.id AS sale_id,
                       s.invoice_number,
                       s.customer_id,
                       c.name AS customer_name,
                       c.mobile AS customer_mobile,
                       st.imei,
                       w.warranty_months,
                       w.start_date,
                       w.end_date,
                       w.claim_status,
                       (w.end_date < :asOfDate) AS expired
                FROM warranty w
                INNER JOIN sale_items si ON si.id = w.sale_item_id
                INNER JOIN sales s ON s.id = si.sale_id
                INNER JOIN customers c ON c.id = s.customer_id
                LEFT JOIN stock st ON st.id = si.stock_id AND st.deleted_at IS NULL
                """
                        + filterClause
                        + """
                 ORDER BY w.end_date ASC, s.invoice_number ASC
                 LIMIT :limit OFFSET :offset
                """,
                params,
                (rs, rowNum) -> new WarrantyRow(
                        rs.getObject("id", UUID.class),
                        rs.getObject("sale_item_id", UUID.class),
                        rs.getObject("sale_id", UUID.class),
                        rs.getString("invoice_number"),
                        rs.getObject("customer_id", UUID.class),
                        rs.getString("customer_name"),
                        rs.getString("customer_mobile"),
                        rs.getString("imei"),
                        rs.getInt("warranty_months"),
                        rs.getDate("start_date").toLocalDate(),
                        rs.getDate("end_date").toLocalDate(),
                        ClaimStatus.valueOf(rs.getString("claim_status")),
                        rs.getBoolean("expired")));

        return new PageImpl<>(rows, pageable, total != null ? total : 0L);
    }

    public record WarrantySummaryRow(long activeCount, long expiredCount, long expiringSoonCount) {}

    public record WarrantyRow(
            UUID id,
            UUID saleItemId,
            UUID saleId,
            String invoiceNumber,
            UUID customerId,
            String customerName,
            String customerMobile,
            String imei,
            int warrantyMonths,
            LocalDate startDate,
            LocalDate endDate,
            ClaimStatus claimStatus,
            boolean expired) {}
}
