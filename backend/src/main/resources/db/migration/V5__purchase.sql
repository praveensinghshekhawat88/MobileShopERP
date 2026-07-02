-- =============================================================================
-- Mobile Shop ERP
-- Flyway Migration: V5__purchase.sql
-- Database     : mobile_shop_erp
-- PostgreSQL   : 17
-- =============================================================================
-- Purpose
--   Purchase module tables (purchases, purchase_items).
-- Depends On   : V4__business.sql
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Section 1: Purchase Tables
-- -----------------------------------------------------------------------------

CREATE TABLE purchases (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id     UUID           NOT NULL,
    invoice_number  VARCHAR(100)   NOT NULL,
    invoice_date    DATE           NOT NULL,
    total_amount    NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_status  VARCHAR(30)    NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by      UUID,
    updated_by      UUID,
    deleted_at      TIMESTAMPTZ,
    CONSTRAINT fk_purchases_supplier_id FOREIGN KEY (supplier_id) REFERENCES suppliers (id),
    CONSTRAINT uq_purchases_invoice_number UNIQUE (invoice_number)
);

CREATE TABLE purchase_items (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id    UUID           NOT NULL,
    variant_id     UUID           NOT NULL,
    quantity       INTEGER        NOT NULL,
    purchase_price NUMERIC(12, 2) NOT NULL,
    tax_amount     NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount   NUMERIC(12, 2) NOT NULL,
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by     UUID,
    updated_by     UUID,
    deleted_at     TIMESTAMPTZ,
    CONSTRAINT fk_purchase_items_purchase_id FOREIGN KEY (purchase_id) REFERENCES purchases (id),
    CONSTRAINT fk_purchase_items_variant_id FOREIGN KEY (variant_id) REFERENCES product_variants (id),
    CONSTRAINT chk_purchase_items_quantity CHECK (quantity > 0)
);


-- -----------------------------------------------------------------------------
-- Section 2: Indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_purchases_supplier_id ON purchases (supplier_id);
CREATE INDEX idx_purchases_deleted_at ON purchases (deleted_at);
CREATE INDEX idx_purchase_items_purchase_id ON purchase_items (purchase_id);
CREATE INDEX idx_purchase_items_variant_id ON purchase_items (variant_id);
CREATE INDEX idx_purchase_items_deleted_at ON purchase_items (deleted_at);


-- -----------------------------------------------------------------------------
-- Section 3: Triggers
-- -----------------------------------------------------------------------------

CREATE TRIGGER trg_purchases_updated_at
    BEFORE UPDATE ON purchases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_purchase_items_updated_at
    BEFORE UPDATE ON purchase_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
