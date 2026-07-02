package com.mobileshoperp.modules.report.repository;

import com.mobileshoperp.common.enums.MovementType;
import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.common.enums.StockStatus;
import java.time.Instant;
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
public class InventoryReportRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public Page<StockSnapshotRow> findCurrentSnapshot(
            UUID variantId, StockStatus stockStatus, Pageable pageable) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("variantId", variantId)
                .addValue("stockStatus", stockStatus != null ? stockStatus.name() : null);

        String filterClause =
                """
                WHERE st.deleted_at IS NULL
                  AND (:variantId IS NULL OR st.variant_id = :variantId)
                  AND (:stockStatus IS NULL OR st.stock_status = :stockStatus)
                """;

        Long total = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*) FROM (
                    SELECT st.variant_id, st.stock_status
                    FROM stock st
                    INNER JOIN product_variants pv ON pv.id = st.variant_id AND pv.deleted_at IS NULL
                    """
                        + filterClause
                        + """
                     GROUP BY st.variant_id, st.stock_status
                ) grouped
                """,
                params,
                Long.class);

        params.addValue("limit", pageable.getPageSize());
        params.addValue("offset", pageable.getOffset());

        List<StockSnapshotRow> rows = jdbcTemplate.query(
                """
                SELECT st.variant_id,
                       pv.sku AS variant_sku,
                       p.name AS product_name,
                       st.stock_status,
                       COUNT(*) AS quantity
                FROM stock st
                INNER JOIN product_variants pv ON pv.id = st.variant_id AND pv.deleted_at IS NULL
                INNER JOIN products p ON p.id = pv.product_id AND p.deleted_at IS NULL
                """
                        + filterClause
                        + """
                 GROUP BY st.variant_id, pv.sku, p.name, st.stock_status
                 ORDER BY p.name ASC, pv.sku ASC, st.stock_status ASC
                 LIMIT :limit OFFSET :offset
                """,
                params,
                (rs, rowNum) -> new StockSnapshotRow(
                        rs.getObject("variant_id", UUID.class),
                        rs.getString("variant_sku"),
                        rs.getString("product_name"),
                        StockStatus.valueOf(rs.getString("stock_status")),
                        rs.getLong("quantity")));

        return new PageImpl<>(rows, pageable, total != null ? total : 0L);
    }

    public Page<StockUnitRow> findCurrentByImei(String imei, Pageable pageable) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("imei", "%" + imei.trim() + "%")
                .addValue("limit", pageable.getPageSize())
                .addValue("offset", pageable.getOffset());

        Long total = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM stock st
                WHERE st.deleted_at IS NULL
                  AND st.imei ILIKE :imei
                """,
                params,
                Long.class);

        List<StockUnitRow> rows = jdbcTemplate.query(
                """
                SELECT st.id,
                       st.variant_id,
                       pv.sku AS variant_sku,
                       p.name AS product_name,
                       st.imei,
                       st.serial_number,
                       st.stock_status
                FROM stock st
                INNER JOIN product_variants pv ON pv.id = st.variant_id AND pv.deleted_at IS NULL
                INNER JOIN products p ON p.id = pv.product_id AND p.deleted_at IS NULL
                WHERE st.deleted_at IS NULL
                  AND st.imei ILIKE :imei
                ORDER BY st.imei ASC
                LIMIT :limit OFFSET :offset
                """,
                params,
                (rs, rowNum) -> new StockUnitRow(
                        rs.getObject("id", UUID.class),
                        rs.getObject("variant_id", UUID.class),
                        rs.getString("variant_sku"),
                        rs.getString("product_name"),
                        rs.getString("imei"),
                        rs.getString("serial_number"),
                        StockStatus.valueOf(rs.getString("stock_status"))));

        return new PageImpl<>(rows, pageable, total != null ? total : 0L);
    }

    public Page<StockMovementRow> findMovements(
            UUID stockId,
            UUID variantId,
            String imei,
            ReferenceType referenceType,
            UUID referenceId,
            MovementType movementType,
            Instant from,
            Instant to,
            Pageable pageable) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("stockId", stockId)
                .addValue("variantId", variantId)
                .addValue("imei", imei != null && !imei.isBlank() ? "%" + imei.trim() + "%" : null)
                .addValue("referenceType", referenceType != null ? referenceType.name() : null)
                .addValue("referenceId", referenceId)
                .addValue("movementType", movementType != null ? movementType.name() : null)
                .addValue("from", from)
                .addValue("to", to);

        String filterClause =
                """
                WHERE sm.deleted_at IS NULL
                  AND (:stockId IS NULL OR sm.stock_id = :stockId)
                  AND (:variantId IS NULL OR st.variant_id = :variantId)
                  AND (:imei IS NULL OR st.imei ILIKE :imei)
                  AND (:referenceType IS NULL OR sm.reference_type = :referenceType)
                  AND (:referenceId IS NULL OR sm.reference_id = :referenceId)
                  AND (:movementType IS NULL OR sm.movement_type = :movementType)
                  AND (:from IS NULL OR sm.created_at >= :from)
                  AND (:to IS NULL OR sm.created_at <= :to)
                """;

        Long total = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM stock_movements sm
                INNER JOIN stock st ON st.id = sm.stock_id AND st.deleted_at IS NULL
                """
                        + filterClause,
                params,
                Long.class);

        params.addValue("limit", pageable.getPageSize());
        params.addValue("offset", pageable.getOffset());

        List<StockMovementRow> rows = jdbcTemplate.query(
                """
                SELECT sm.id,
                       sm.stock_id,
                       st.imei,
                       st.variant_id,
                       pv.sku AS variant_sku,
                       p.name AS product_name,
                       sm.reference_type,
                       sm.reference_id,
                       sm.movement_type,
                       sm.remarks,
                       sm.created_at
                FROM stock_movements sm
                INNER JOIN stock st ON st.id = sm.stock_id AND st.deleted_at IS NULL
                INNER JOIN product_variants pv ON pv.id = st.variant_id AND pv.deleted_at IS NULL
                INNER JOIN products p ON p.id = pv.product_id AND p.deleted_at IS NULL
                """
                        + filterClause
                        + """
                 ORDER BY sm.created_at DESC
                 LIMIT :limit OFFSET :offset
                """,
                params,
                (rs, rowNum) -> new StockMovementRow(
                        rs.getObject("id", UUID.class),
                        rs.getObject("stock_id", UUID.class),
                        rs.getString("imei"),
                        rs.getObject("variant_id", UUID.class),
                        rs.getString("variant_sku"),
                        rs.getString("product_name"),
                        ReferenceType.valueOf(rs.getString("reference_type")),
                        rs.getObject("reference_id", UUID.class),
                        MovementType.valueOf(rs.getString("movement_type")),
                        rs.getString("remarks"),
                        rs.getTimestamp("created_at").toInstant()));

        return new PageImpl<>(rows, pageable, total != null ? total : 0L);
    }

    public Page<LowStockRow> findLowStock(int threshold, Pageable pageable) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("threshold", threshold)
                .addValue("limit", pageable.getPageSize())
                .addValue("offset", pageable.getOffset());

        Long total = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*) FROM (
                    SELECT st.variant_id
                    FROM stock st
                    WHERE st.deleted_at IS NULL
                    GROUP BY st.variant_id
                    HAVING COUNT(*) FILTER (WHERE st.stock_status = 'AVAILABLE') <= :threshold
                ) low_variants
                """,
                params,
                Long.class);

        List<LowStockRow> rows = jdbcTemplate.query(
                """
                SELECT st.variant_id,
                       pv.sku AS variant_sku,
                       p.name AS product_name,
                       COUNT(*) FILTER (WHERE st.stock_status = 'AVAILABLE') AS available_count
                FROM stock st
                INNER JOIN product_variants pv ON pv.id = st.variant_id AND pv.deleted_at IS NULL
                INNER JOIN products p ON p.id = pv.product_id AND p.deleted_at IS NULL
                WHERE st.deleted_at IS NULL
                GROUP BY st.variant_id, pv.sku, p.name
                HAVING COUNT(*) FILTER (WHERE st.stock_status = 'AVAILABLE') <= :threshold
                ORDER BY available_count ASC, p.name ASC, pv.sku ASC
                LIMIT :limit OFFSET :offset
                """,
                params,
                (rs, rowNum) -> new LowStockRow(
                        rs.getObject("variant_id", UUID.class),
                        rs.getString("variant_sku"),
                        rs.getString("product_name"),
                        rs.getLong("available_count")));

        return new PageImpl<>(rows, pageable, total != null ? total : 0L);
    }

    public record StockSnapshotRow(
            UUID variantId,
            String variantSku,
            String productName,
            StockStatus stockStatus,
            long quantity) {}

    public record StockUnitRow(
            UUID id,
            UUID variantId,
            String variantSku,
            String productName,
            String imei,
            String serialNumber,
            StockStatus stockStatus) {}

    public record StockMovementRow(
            UUID id,
            UUID stockId,
            String imei,
            UUID variantId,
            String variantSku,
            String productName,
            ReferenceType referenceType,
            UUID referenceId,
            MovementType movementType,
            String remarks,
            Instant createdAt) {}

    public record LowStockRow(UUID variantId, String variantSku, String productName, long availableCount) {}
}
