package com.mobileshoperp.modules.report.repository;

import com.mobileshoperp.modules.report.dto.ExpenseSummaryGroupBy;
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
public class ExpenseReportRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public ExpenseTotalsRow summarizeTotals(LocalDate fromDate, LocalDate toDate) {
        MapSqlParameterSource params = baseDateParams(fromDate, toDate);
        return jdbcTemplate.queryForObject(
                """
                SELECT COUNT(e.id) AS expense_count,
                       COALESCE(SUM(e.amount), 0) AS total_amount
                FROM expenses e
                WHERE e.deleted_at IS NULL
                  AND e.expense_date >= :fromDate
                  AND e.expense_date <= :toDate
                """,
                params,
                (rs, rowNum) -> new ExpenseTotalsRow(rs.getLong("expense_count"), rs.getBigDecimal("total_amount")));
    }

    public List<ExpenseBucketRow> summarizeBuckets(
            LocalDate fromDate, LocalDate toDate, ExpenseSummaryGroupBy groupBy) {
        MapSqlParameterSource params = baseDateParams(fromDate, toDate);
        if (groupBy == ExpenseSummaryGroupBy.MONTH) {
            return jdbcTemplate.query(
                    """
                    SELECT DATE_TRUNC('month', e.expense_date)::date AS period_start,
                           COUNT(e.id) AS expense_count,
                           COALESCE(SUM(e.amount), 0) AS total_amount
                    FROM expenses e
                    WHERE e.deleted_at IS NULL
                      AND e.expense_date >= :fromDate
                      AND e.expense_date <= :toDate
                    GROUP BY DATE_TRUNC('month', e.expense_date)
                    ORDER BY period_start ASC
                    """,
                    params,
                    (rs, rowNum) -> new ExpenseBucketRow(
                            rs.getDate("period_start").toLocalDate(),
                            rs.getLong("expense_count"),
                            rs.getBigDecimal("total_amount")));
        }
        return jdbcTemplate.query(
                """
                SELECT e.expense_date AS period_start,
                       COUNT(e.id) AS expense_count,
                       COALESCE(SUM(e.amount), 0) AS total_amount
                FROM expenses e
                WHERE e.deleted_at IS NULL
                  AND e.expense_date >= :fromDate
                  AND e.expense_date <= :toDate
                GROUP BY e.expense_date
                ORDER BY period_start ASC
                """,
                params,
                (rs, rowNum) -> new ExpenseBucketRow(
                        rs.getDate("period_start").toLocalDate(),
                        rs.getLong("expense_count"),
                        rs.getBigDecimal("total_amount")));
    }

    public Page<ExpenseRow> findExpenses(
            LocalDate fromDate, LocalDate toDate, String category, Pageable pageable) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("fromDate", fromDate)
                .addValue("toDate", toDate)
                .addValue("category", category != null && !category.isBlank() ? "%" + category.trim() + "%" : null);

        String filterClause =
                """
                WHERE e.deleted_at IS NULL
                  AND (:fromDate IS NULL OR e.expense_date >= :fromDate)
                  AND (:toDate IS NULL OR e.expense_date <= :toDate)
                  AND (:category IS NULL OR e.title ILIKE :category)
                """;

        Long total = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM expenses e " + filterClause, params, Long.class);

        params.addValue("limit", pageable.getPageSize());
        params.addValue("offset", pageable.getOffset());

        List<ExpenseRow> rows = jdbcTemplate.query(
                """
                SELECT e.id, e.title, e.amount, e.expense_date, e.remarks
                FROM expenses e
                """
                        + filterClause
                        + """
                 ORDER BY e.expense_date DESC, e.title ASC
                 LIMIT :limit OFFSET :offset
                """,
                params,
                (rs, rowNum) -> new ExpenseRow(
                        rs.getObject("id", UUID.class),
                        rs.getString("title"),
                        rs.getBigDecimal("amount"),
                        rs.getDate("expense_date").toLocalDate(),
                        rs.getString("remarks")));

        return new PageImpl<>(rows, pageable, total != null ? total : 0L);
    }

    private MapSqlParameterSource baseDateParams(LocalDate fromDate, LocalDate toDate) {
        return new MapSqlParameterSource().addValue("fromDate", fromDate).addValue("toDate", toDate);
    }

    public record ExpenseTotalsRow(long expenseCount, BigDecimal totalAmount) {}

    public record ExpenseBucketRow(LocalDate periodStart, long expenseCount, BigDecimal totalAmount) {}

    public record ExpenseRow(
            UUID id, String title, BigDecimal amount, LocalDate expenseDate, String remarks) {}
}
