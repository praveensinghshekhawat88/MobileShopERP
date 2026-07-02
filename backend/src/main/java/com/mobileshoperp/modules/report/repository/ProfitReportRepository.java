package com.mobileshoperp.modules.report.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ProfitReportRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    /**
     * Aggregates revenue, COGS, and expenses for the given invoice/expense date range in one round trip.
     *
     * <p>Revenue subquery sums {@code selling_price - discount + tax_amount} from {@code sale_items}
     * joined to non-deleted {@code sales} filtered by {@code invoice_date}.
     *
     * <p>COGS subquery sums {@code purchase_items.purchase_price} by tracing
     * {@code sale_items → stock → purchase_items} for the same sale date range.
     *
     * <p>Expenses subquery sums {@code expenses.amount} filtered by {@code expense_date}.
     */
    public ProfitSummaryRow summarize(LocalDate fromDate, LocalDate toDate) {
        MapSqlParameterSource params =
                new MapSqlParameterSource().addValue("fromDate", fromDate).addValue("toDate", toDate);

        return jdbcTemplate.queryForObject(
                """
                SELECT COALESCE((
                           SELECT SUM(si.selling_price - si.discount + si.tax_amount)
                           FROM sale_items si
                           INNER JOIN sales s ON s.id = si.sale_id AND s.deleted_at IS NULL
                           WHERE si.deleted_at IS NULL
                             AND s.invoice_date >= :fromDate
                             AND s.invoice_date <= :toDate
                       ), 0) AS total_revenue,
                       COALESCE((
                           SELECT SUM(pi.purchase_price)
                           FROM sale_items si
                           INNER JOIN sales s ON s.id = si.sale_id AND s.deleted_at IS NULL
                           INNER JOIN stock st ON st.id = si.stock_id AND st.deleted_at IS NULL
                           INNER JOIN purchase_items pi ON pi.id = st.purchase_item_id AND pi.deleted_at IS NULL
                           WHERE si.deleted_at IS NULL
                             AND s.invoice_date >= :fromDate
                             AND s.invoice_date <= :toDate
                       ), 0) AS total_cogs,
                       COALESCE((
                           SELECT SUM(e.amount)
                           FROM expenses e
                           WHERE e.deleted_at IS NULL
                             AND e.expense_date >= :fromDate
                             AND e.expense_date <= :toDate
                       ), 0) AS total_expenses
                """,
                params,
                (rs, rowNum) -> new ProfitSummaryRow(
                        rs.getBigDecimal("total_revenue"),
                        rs.getBigDecimal("total_cogs"),
                        rs.getBigDecimal("total_expenses")));
    }

    public record ProfitSummaryRow(BigDecimal totalRevenue, BigDecimal totalCogs, BigDecimal totalExpenses) {}
}
