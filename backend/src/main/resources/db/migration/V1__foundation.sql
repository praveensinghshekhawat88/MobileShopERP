-- =============================================================================
-- Mobile Shop ERP
-- Flyway Migration: V1__foundation.sql
-- Database     : mobile_shop_erp
-- PostgreSQL   : 17
-- =============================================================================
-- Purpose
--   Shared database extensions and reusable objects required by later migrations.
-- Scope
--   No tables, triggers, enums, views, or seed data in this file.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Section 1: Extensions
-- -----------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE EXTENSION IF NOT EXISTS citext;


-- -----------------------------------------------------------------------------
-- Section 2: Shared Functions
-- -----------------------------------------------------------------------------

-- Sets updated_at on row update. Attach via CREATE TRIGGER in later migrations.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
