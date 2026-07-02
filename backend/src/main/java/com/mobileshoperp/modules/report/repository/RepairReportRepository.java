package com.mobileshoperp.modules.report.repository;

import com.mobileshoperp.common.enums.RepairStatus;
import java.math.BigDecimal;
import java.time.Instant;
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
public class RepairReportRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public List<StatusCountRow> countOpenByStatus() {
        return jdbcTemplate.query(
                """
                SELECT r.repair_status,
                       COUNT(*) AS repair_count
                FROM repairs r
                WHERE r.deleted_at IS NULL
                  AND r.repair_status IN ('RECEIVED', 'CHECKING', 'WAITING_PARTS', 'REPAIRING', 'READY')
                GROUP BY r.repair_status
                ORDER BY r.repair_status ASC
                """,
                (rs, rowNum) -> new StatusCountRow(
                        RepairStatus.valueOf(rs.getString("repair_status")), rs.getLong("repair_count")));
    }

    public DeliveredSummaryRow summarizeDelivered(LocalDate fromDate, LocalDate toDate) {
        MapSqlParameterSource params = baseDateParams(fromDate, toDate);
        return jdbcTemplate.queryForObject(
                """
                SELECT COUNT(r.id) AS delivered_count,
                       COALESCE(SUM(r.actual_cost), 0) AS total_delivered_cost
                FROM repairs r
                WHERE r.deleted_at IS NULL
                  AND r.repair_status = 'DELIVERED'
                  AND r.updated_at::date >= :fromDate
                  AND r.updated_at::date <= :toDate
                """,
                params,
                (rs, rowNum) -> new DeliveredSummaryRow(
                        rs.getLong("delivered_count"), rs.getBigDecimal("total_delivered_cost")));
    }

    public Page<RepairRow> findRepairs(
            RepairStatus repairStatus, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("repairStatus", repairStatus != null ? repairStatus.name() : null)
                .addValue("fromDate", fromDate)
                .addValue("toDate", toDate);

        String dateFilter =
                """
                  AND (:fromDate IS NULL OR :toDate IS NULL OR (
                      CASE WHEN r.repair_status = 'DELIVERED' THEN r.updated_at::date ELSE r.created_at::date END
                      BETWEEN :fromDate AND :toDate
                  ))
                """;

        String filterClause =
                """
                WHERE r.deleted_at IS NULL
                  AND (:repairStatus IS NULL OR r.repair_status = :repairStatus)
                """
                        + dateFilter;

        Long total = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM repairs r " + filterClause, params, Long.class);

        params.addValue("limit", pageable.getPageSize());
        params.addValue("offset", pageable.getOffset());

        List<RepairRow> rows = jdbcTemplate.query(
                """
                SELECT r.id,
                       r.customer_id,
                       c.name AS customer_name,
                       c.mobile AS customer_mobile,
                       r.stock_id,
                       st.imei,
                       r.repair_status,
                       r.issue_description,
                       r.estimated_cost,
                       r.actual_cost,
                       r.created_at,
                       r.updated_at
                FROM repairs r
                INNER JOIN customers c ON c.id = r.customer_id
                LEFT JOIN stock st ON st.id = r.stock_id AND st.deleted_at IS NULL
                """
                        + filterClause
                        + """
                 ORDER BY r.created_at DESC
                 LIMIT :limit OFFSET :offset
                """,
                params,
                (rs, rowNum) -> new RepairRow(
                        rs.getObject("id", UUID.class),
                        rs.getObject("customer_id", UUID.class),
                        rs.getString("customer_name"),
                        rs.getString("customer_mobile"),
                        rs.getObject("stock_id", UUID.class),
                        rs.getString("imei"),
                        RepairStatus.valueOf(rs.getString("repair_status")),
                        rs.getString("issue_description"),
                        rs.getBigDecimal("estimated_cost"),
                        rs.getBigDecimal("actual_cost"),
                        rs.getTimestamp("created_at").toInstant(),
                        rs.getTimestamp("updated_at").toInstant()));

        return new PageImpl<>(rows, pageable, total != null ? total : 0L);
    }

    private MapSqlParameterSource baseDateParams(LocalDate fromDate, LocalDate toDate) {
        return new MapSqlParameterSource().addValue("fromDate", fromDate).addValue("toDate", toDate);
    }

    public record StatusCountRow(RepairStatus status, long count) {}

    public record DeliveredSummaryRow(long deliveredCount, BigDecimal totalDeliveredCost) {}

    public record RepairRow(
            UUID id,
            UUID customerId,
            String customerName,
            String customerMobile,
            UUID stockId,
            String imei,
            RepairStatus repairStatus,
            String issueDescription,
            BigDecimal estimatedCost,
            BigDecimal actualCost,
            Instant createdAt,
            Instant updatedAt) {}
}
