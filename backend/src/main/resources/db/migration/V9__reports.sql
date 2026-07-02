-- =============================================================================
-- Mobile Shop ERP
-- Flyway Migration: V9__reports.sql
-- Database     : mobile_shop_erp
-- PostgreSQL   : 17
-- =============================================================================
-- Purpose
--   Read-only report query indexes (no new tables).
-- Depends On   : V8__service.sql
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Section 1: Sales report indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_sales_report_invoice_date
    ON sales (invoice_date DESC)
    WHERE deleted_at IS NULL;

CREATE INDEX idx_sales_report_customer_date
    ON sales (customer_id, invoice_date DESC)
    WHERE deleted_at IS NULL;


-- -----------------------------------------------------------------------------
-- Section 2: Purchase report indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_purchases_report_invoice_date
    ON purchases (invoice_date DESC)
    WHERE deleted_at IS NULL;

CREATE INDEX idx_purchases_report_supplier_date
    ON purchases (supplier_id, invoice_date DESC)
    WHERE deleted_at IS NULL;


-- -----------------------------------------------------------------------------
-- Section 3: Inventory report indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_stock_report_imei
    ON stock (imei)
    WHERE deleted_at IS NULL AND imei IS NOT NULL;

CREATE INDEX idx_stock_movements_report_created_at
    ON stock_movements (created_at DESC)
    WHERE deleted_at IS NULL;


-- -----------------------------------------------------------------------------
-- Section 4: Repair report indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_repairs_report_delivered_updated_at
    ON repairs (updated_at DESC)
    WHERE deleted_at IS NULL AND repair_status = 'DELIVERED';


-- -----------------------------------------------------------------------------
-- Section 5: Warranty report indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_warranty_report_end_date_active
    ON warranty (end_date ASC)
    WHERE deleted_at IS NULL;
