-- =============================================================================
-- Mobile Shop ERP
-- Flyway Migration: V4__business.sql
-- Database     : mobile_shop_erp
-- PostgreSQL   : 17
-- =============================================================================
-- Purpose
--   Business master module tables (customers, suppliers).
-- Depends On   : V3__product.sql
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Section 1: Business Master Tables
-- -----------------------------------------------------------------------------

CREATE TABLE customers (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(200) NOT NULL,
    mobile     VARCHAR(15)  NOT NULL,
    email      VARCHAR(150),
    address    TEXT,
    gst_number VARCHAR(20),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT uq_customers_mobile UNIQUE (mobile)
);

CREATE TABLE suppliers (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_name  VARCHAR(200) NOT NULL,
    contact_person VARCHAR(150),
    mobile         VARCHAR(15)  NOT NULL,
    email          VARCHAR(150),
    gst_number     VARCHAR(20),
    address        TEXT,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by     UUID,
    updated_by     UUID,
    deleted_at     TIMESTAMPTZ,
    CONSTRAINT uq_suppliers_mobile UNIQUE (mobile)
);


-- -----------------------------------------------------------------------------
-- Section 2: Indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_customers_deleted_at ON customers (deleted_at);
CREATE INDEX idx_customers_mobile ON customers (mobile);
CREATE INDEX idx_suppliers_deleted_at ON suppliers (deleted_at);
CREATE INDEX idx_suppliers_mobile ON suppliers (mobile);


-- -----------------------------------------------------------------------------
-- Section 3: Triggers
-- -----------------------------------------------------------------------------

CREATE TRIGGER trg_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
