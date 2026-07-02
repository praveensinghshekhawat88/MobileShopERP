-- =============================================================================
-- Mobile Shop ERP
-- Flyway Migration: V10__future.sql
-- Database     : mobile_shop_erp
-- PostgreSQL   : 17
-- =============================================================================
-- Purpose
--   Deployment reference data and future placeholders.
-- Depends On   : V9__reports.sql
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Section 1: Default shop settings (idempotent)
-- -----------------------------------------------------------------------------

INSERT INTO settings (company_name, invoice_prefix)
SELECT 'Mobile Shop ERP', 'INV'
WHERE NOT EXISTS (SELECT 1 FROM settings);
