-- =============================================================================
-- Mobile Shop ERP
-- Flyway Migration: V8__service.sql
-- Database     : mobile_shop_erp
-- PostgreSQL   : 17
-- =============================================================================
-- Purpose
--   Service module tables (repairs; warranty/expenses/audit in later prompts).
-- Depends On   : V7__sales.sql
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Section 1: Service Tables
-- -----------------------------------------------------------------------------

CREATE TABLE repairs (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_id           UUID,
    customer_id        UUID           NOT NULL,
    repair_status      VARCHAR(30)    NOT NULL DEFAULT 'RECEIVED',
    issue_description  TEXT,
    estimated_cost     NUMERIC(12, 2),
    actual_cost        NUMERIC(12, 2),
    created_at         TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by         UUID,
    updated_by         UUID,
    deleted_at         TIMESTAMPTZ,
    CONSTRAINT fk_repairs_stock_id FOREIGN KEY (stock_id) REFERENCES stock (id),
    CONSTRAINT fk_repairs_customer_id FOREIGN KEY (customer_id) REFERENCES customers (id),
    CONSTRAINT chk_repairs_estimated_cost CHECK (estimated_cost IS NULL OR estimated_cost >= 0),
    CONSTRAINT chk_repairs_actual_cost CHECK (actual_cost IS NULL OR actual_cost >= 0)
);


-- -----------------------------------------------------------------------------
-- Section 2: Indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_repairs_stock_id ON repairs (stock_id);
CREATE INDEX idx_repairs_customer_id ON repairs (customer_id);
CREATE INDEX idx_repairs_repair_status ON repairs (repair_status);
CREATE INDEX idx_repairs_deleted_at ON repairs (deleted_at);


-- -----------------------------------------------------------------------------
-- Section 3: Triggers
-- -----------------------------------------------------------------------------

CREATE TRIGGER trg_repairs_updated_at
    BEFORE UPDATE ON repairs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE warranty (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_item_id     UUID        NOT NULL,
    warranty_months  INTEGER     NOT NULL,
    start_date       DATE        NOT NULL,
    end_date         DATE        NOT NULL,
    claim_status     VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by       UUID,
    updated_by       UUID,
    deleted_at       TIMESTAMPTZ,
    CONSTRAINT fk_warranty_sale_item_id FOREIGN KEY (sale_item_id) REFERENCES sale_items (id),
    CONSTRAINT uq_warranty_sale_item_id UNIQUE (sale_item_id),
    CONSTRAINT chk_warranty_months CHECK (warranty_months > 0)
);

CREATE INDEX idx_warranty_sale_item_id ON warranty (sale_item_id);
CREATE INDEX idx_warranty_end_date ON warranty (end_date);
CREATE INDEX idx_warranty_claim_status ON warranty (claim_status);
CREATE INDEX idx_warranty_deleted_at ON warranty (deleted_at);

CREATE TRIGGER trg_warranty_updated_at
    BEFORE UPDATE ON warranty
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE expenses (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        VARCHAR(200)   NOT NULL,
    amount       NUMERIC(12, 2) NOT NULL,
    expense_date DATE           NOT NULL,
    remarks      TEXT,
    created_at   TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by   UUID,
    updated_by   UUID,
    deleted_at   TIMESTAMPTZ,
    CONSTRAINT chk_expenses_amount CHECK (amount > 0)
);

CREATE INDEX idx_expenses_expense_date ON expenses (expense_date);
CREATE INDEX idx_expenses_deleted_at ON expenses (deleted_at);

CREATE TRIGGER trg_expenses_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE audit_logs (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_name  VARCHAR(50),
    table_name   VARCHAR(100),
    record_id    UUID,
    action       VARCHAR(20)  NOT NULL,
    old_data     JSONB,
    new_data     JSONB,
    user_id      UUID,
    ip_address   VARCHAR(50),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_logs_user_id FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX idx_audit_logs_module_name ON audit_logs (module_name);
CREATE INDEX idx_audit_logs_table_name ON audit_logs (table_name);
CREATE INDEX idx_audit_logs_record_id ON audit_logs (record_id);
CREATE INDEX idx_audit_logs_action ON audit_logs (action);
CREATE INDEX idx_audit_logs_user_id ON audit_logs (user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);
