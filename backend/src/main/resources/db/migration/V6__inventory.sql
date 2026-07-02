-- =============================================================================
-- Mobile Shop ERP
-- Flyway Migration: V6__inventory.sql
-- Database     : mobile_shop_erp
-- PostgreSQL   : 17
-- =============================================================================
-- Purpose
--   Inventory module tables (stock, stock_movements).
-- Depends On   : V5__purchase.sql
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Section 1: Inventory Tables
-- -----------------------------------------------------------------------------

CREATE TABLE stock (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_item_id UUID         NOT NULL,
    variant_id       UUID         NOT NULL,
    imei             VARCHAR(30),
    serial_number    VARCHAR(100),
    stock_status     VARCHAR(30)  NOT NULL DEFAULT 'AVAILABLE',
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by       UUID,
    updated_by       UUID,
    deleted_at       TIMESTAMPTZ,
    CONSTRAINT fk_stock_purchase_item_id FOREIGN KEY (purchase_item_id) REFERENCES purchase_items (id),
    CONSTRAINT fk_stock_variant_id FOREIGN KEY (variant_id) REFERENCES product_variants (id),
    CONSTRAINT uq_stock_imei UNIQUE (imei)
);

CREATE TABLE stock_movements (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_id       UUID        NOT NULL,
    reference_type VARCHAR(30) NOT NULL,
    reference_id   UUID        NOT NULL,
    movement_type  VARCHAR(30) NOT NULL,
    remarks        TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by     UUID,
    updated_by     UUID,
    deleted_at     TIMESTAMPTZ,
    CONSTRAINT fk_stock_movements_stock_id FOREIGN KEY (stock_id) REFERENCES stock (id)
);


-- -----------------------------------------------------------------------------
-- Section 2: Indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_stock_purchase_item_id ON stock (purchase_item_id);
CREATE INDEX idx_stock_variant_id ON stock (variant_id);
CREATE INDEX idx_stock_variant_status ON stock (variant_id, stock_status);
CREATE INDEX idx_stock_deleted_at ON stock (deleted_at);
CREATE INDEX idx_stock_movements_stock_id ON stock_movements (stock_id);
CREATE INDEX idx_stock_movements_reference ON stock_movements (reference_type, reference_id);
CREATE INDEX idx_stock_movements_deleted_at ON stock_movements (deleted_at);


-- -----------------------------------------------------------------------------
-- Section 3: Triggers
-- -----------------------------------------------------------------------------

CREATE TRIGGER trg_stock_updated_at
    BEFORE UPDATE ON stock
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_stock_movements_updated_at
    BEFORE UPDATE ON stock_movements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
