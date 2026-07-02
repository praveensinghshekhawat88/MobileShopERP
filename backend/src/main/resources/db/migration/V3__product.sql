-- =============================================================================
-- Mobile Shop ERP
-- Flyway Migration: V3__product.sql
-- Database     : mobile_shop_erp
-- PostgreSQL   : 17
-- =============================================================================
-- Purpose
--   Product master module tables (10 tables).
-- Depends On   : V2__authentication.sql
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Section 1: Master Tables
-- -----------------------------------------------------------------------------

CREATE TABLE brands (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_brands_name UNIQUE (name)
);

CREATE TABLE categories (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    parent_id   BIGINT,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_categories_parent_id FOREIGN KEY (parent_id) REFERENCES categories (id)
);

CREATE TABLE attribute_groups (
    id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT uq_attribute_groups_name UNIQUE (name)
);

CREATE TABLE attributes (
    id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    attribute_group_id BIGINT       NOT NULL,
    name               VARCHAR(100) NOT NULL,
    attribute_type     VARCHAR(30)  NOT NULL,
    CONSTRAINT fk_attributes_group_id FOREIGN KEY (attribute_group_id) REFERENCES attribute_groups (id),
    CONSTRAINT uq_attributes_group_name UNIQUE (attribute_group_id, name)
);

CREATE TABLE attribute_values (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    attribute_id BIGINT       NOT NULL,
    value        VARCHAR(100) NOT NULL,
    display_order INTEGER     NOT NULL DEFAULT 0,
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_attribute_values_attribute_id FOREIGN KEY (attribute_id) REFERENCES attributes (id),
    CONSTRAINT uq_attribute_values_attribute_value UNIQUE (attribute_id, value)
);


-- -----------------------------------------------------------------------------
-- Section 2: Business Tables
-- -----------------------------------------------------------------------------

CREATE TABLE products (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id    BIGINT       NOT NULL,
    category_id BIGINT       NOT NULL,
    name        VARCHAR(200) NOT NULL,
    model       VARCHAR(150),
    hsn_code    VARCHAR(20),
    description TEXT,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  UUID,
    updated_by  UUID,
    deleted_at  TIMESTAMPTZ,
    CONSTRAINT fk_products_brand_id FOREIGN KEY (brand_id) REFERENCES brands (id),
    CONSTRAINT fk_products_category_id FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE product_variants (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID         NOT NULL,
    sku        VARCHAR(100) NOT NULL,
    barcode    VARCHAR(100),
    is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT fk_product_variants_product_id FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT uq_product_variants_sku UNIQUE (sku),
    CONSTRAINT uq_product_variants_barcode UNIQUE (barcode)
);

CREATE TABLE product_images (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id    UUID         NOT NULL,
    image_url     TEXT         NOT NULL,
    display_order INTEGER      NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by    UUID,
    updated_by    UUID,
    deleted_at    TIMESTAMPTZ,
    CONSTRAINT fk_product_images_variant_id FOREIGN KEY (variant_id) REFERENCES product_variants (id)
);

CREATE TABLE product_variant_attributes (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id         UUID   NOT NULL,
    attribute_value_id BIGINT NOT NULL,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by         UUID,
    updated_by         UUID,
    deleted_at         TIMESTAMPTZ,
    CONSTRAINT fk_pva_variant_id FOREIGN KEY (variant_id) REFERENCES product_variants (id),
    CONSTRAINT fk_pva_attribute_value_id FOREIGN KEY (attribute_value_id) REFERENCES attribute_values (id),
    CONSTRAINT uq_pva_variant_attribute_value UNIQUE (variant_id, attribute_value_id)
);

CREATE TABLE product_prices (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id     UUID           NOT NULL,
    price_type     VARCHAR(30)    NOT NULL,
    price          NUMERIC(12, 2) NOT NULL,
    effective_from DATE           NOT NULL,
    effective_to   DATE,
    is_active      BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by     UUID,
    updated_by     UUID,
    deleted_at     TIMESTAMPTZ,
    CONSTRAINT fk_product_prices_variant_id FOREIGN KEY (variant_id) REFERENCES product_variants (id)
);


-- -----------------------------------------------------------------------------
-- Section 3: Indexes
-- -----------------------------------------------------------------------------

CREATE INDEX idx_categories_parent_id ON categories (parent_id);
CREATE INDEX idx_attributes_group_id ON attributes (attribute_group_id);
CREATE INDEX idx_attribute_values_attribute_id ON attribute_values (attribute_id);
CREATE INDEX idx_products_brand_id ON products (brand_id);
CREATE INDEX idx_products_category_id ON products (category_id);
CREATE INDEX idx_products_deleted_at ON products (deleted_at);
CREATE INDEX idx_product_variants_product_id ON product_variants (product_id);
CREATE INDEX idx_product_variants_deleted_at ON product_variants (deleted_at);
CREATE INDEX idx_product_images_variant_id ON product_images (variant_id);
CREATE INDEX idx_product_variant_attributes_variant_id ON product_variant_attributes (variant_id);
CREATE INDEX idx_product_variant_attributes_attribute_value_id ON product_variant_attributes (attribute_value_id);
CREATE INDEX idx_product_prices_variant_id ON product_prices (variant_id);
CREATE INDEX idx_product_prices_is_active ON product_prices (variant_id, is_active);


-- -----------------------------------------------------------------------------
-- Section 4: Triggers
-- -----------------------------------------------------------------------------

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_product_variants_updated_at
    BEFORE UPDATE ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_product_images_updated_at
    BEFORE UPDATE ON product_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_product_variant_attributes_updated_at
    BEFORE UPDATE ON product_variant_attributes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_product_prices_updated_at
    BEFORE UPDATE ON product_prices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
