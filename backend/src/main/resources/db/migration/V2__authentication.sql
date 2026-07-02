-- =============================================================================
-- Mobile Shop ERP
-- Flyway Migration: V2__authentication.sql
-- Database     : mobile_shop_erp
-- PostgreSQL   : 17
-- =============================================================================
-- Purpose
--   Authentication module tables: roles, users, settings.
-- Depends On   : V1__foundation.sql (pgcrypto, citext, update_updated_at_column)
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Section 1: Master Tables
-- -----------------------------------------------------------------------------

CREATE TABLE roles (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL,
    description TEXT,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_roles_name UNIQUE (name)
);

CREATE TABLE settings (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_name    VARCHAR(200),
    owner_name      VARCHAR(150),
    gst_number      VARCHAR(20),
    mobile          VARCHAR(15),
    email           VARCHAR(150),
    address         TEXT,
    logo            TEXT,
    invoice_prefix  VARCHAR(20)
);


-- -----------------------------------------------------------------------------
-- Section 2: Business Tables
-- -----------------------------------------------------------------------------

CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id     BIGINT       NOT NULL,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100),
    mobile      VARCHAR(15)  NOT NULL,
    email       CITEXT,
    password    VARCHAR(255) NOT NULL,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    last_login  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  UUID,
    updated_by  UUID,
    deleted_at  TIMESTAMPTZ,
    CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles (id),
    CONSTRAINT uq_users_mobile UNIQUE (mobile),
    CONSTRAINT uq_users_email UNIQUE (email)
);


-- -----------------------------------------------------------------------------
-- Section 3: Indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_users_role_id ON users (role_id);
CREATE INDEX idx_users_deleted_at ON users (deleted_at);
CREATE INDEX idx_users_is_active ON users (is_active);


-- -----------------------------------------------------------------------------
-- Section 4: Triggers
-- -----------------------------------------------------------------------------

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- -----------------------------------------------------------------------------
-- Section 5: Reference Data (master roles only)
-- -----------------------------------------------------------------------------

INSERT INTO roles (name, description, is_active) VALUES
    ('ADMIN', 'System Administrator', TRUE),
    ('STAFF', 'Shop Staff', TRUE);
