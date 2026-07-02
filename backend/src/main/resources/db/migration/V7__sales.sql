-- =============================================================================
-- Mobile Shop ERP
-- Flyway Migration: V7__sales.sql
-- Database     : mobile_shop_erp
-- PostgreSQL   : 17
-- =============================================================================
-- Purpose
--   Sales module header table (sales).
-- Depends On   : V6__inventory.sql
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Section 1: Sales Tables
-- -----------------------------------------------------------------------------

CREATE TABLE sales (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id     UUID           NOT NULL,
    invoice_number  VARCHAR(100)   NOT NULL,
    invoice_date    DATE           NOT NULL,
    total_amount    NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_status  VARCHAR(30)    NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by      UUID,
    updated_by      UUID,
    deleted_at      TIMESTAMPTZ,
    CONSTRAINT fk_sales_customer_id FOREIGN KEY (customer_id) REFERENCES customers (id),
    CONSTRAINT uq_sales_invoice_number UNIQUE (invoice_number)
);

CREATE TABLE sale_items (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id        UUID           NOT NULL,
    stock_id       UUID           NOT NULL,
    selling_price  NUMERIC(12, 2) NOT NULL,
    discount       NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax_amount     NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by     UUID,
    updated_by     UUID,
    deleted_at     TIMESTAMPTZ,
    CONSTRAINT fk_sale_items_sale_id FOREIGN KEY (sale_id) REFERENCES sales (id),
    CONSTRAINT fk_sale_items_stock_id FOREIGN KEY (stock_id) REFERENCES stock (id),
    CONSTRAINT chk_sale_items_selling_price CHECK (selling_price > 0),
    CONSTRAINT chk_sale_items_discount CHECK (discount >= 0),
    CONSTRAINT chk_sale_items_tax_amount CHECK (tax_amount >= 0)
);

CREATE TABLE payments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_type      VARCHAR(30)    NOT NULL,
    reference_id        UUID           NOT NULL,
    payment_mode        VARCHAR(30)    NOT NULL,
    amount              NUMERIC(12, 2) NOT NULL,
    transaction_number  VARCHAR(150),
    payment_date        TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at          TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          UUID,
    updated_by          UUID,
    deleted_at          TIMESTAMPTZ,
    CONSTRAINT chk_payments_amount CHECK (amount > 0)
);


-- -----------------------------------------------------------------------------
-- Section 2: Indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_sales_customer_id ON sales (customer_id);
CREATE INDEX idx_sales_invoice_date ON sales (invoice_date);
CREATE INDEX idx_sales_payment_status ON sales (payment_status);
CREATE INDEX idx_sales_deleted_at ON sales (deleted_at);
CREATE INDEX idx_sale_items_sale_id ON sale_items (sale_id);
CREATE INDEX idx_sale_items_stock_id ON sale_items (stock_id);
CREATE INDEX idx_sale_items_deleted_at ON sale_items (deleted_at);
CREATE UNIQUE INDEX uq_sale_items_stock_id_active ON sale_items (stock_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_payments_reference ON payments (reference_type, reference_id);
CREATE INDEX idx_payments_deleted_at ON payments (deleted_at);


-- -----------------------------------------------------------------------------
-- Section 3: Triggers
-- -----------------------------------------------------------------------------

CREATE TRIGGER trg_sales_updated_at
    BEFORE UPDATE ON sales
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_sale_items_updated_at
    BEFORE UPDATE ON sale_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
