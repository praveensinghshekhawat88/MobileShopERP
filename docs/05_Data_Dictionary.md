# 05_Data_Dictionary.md

---

# Mobile Shop ERP

## Data Dictionary

Version : 1.0

Database : PostgreSQL 17

Prepared By : Praveen Singh Shekhawat

---

# Introduction

This document defines every database table, column, datatype, constraint and business purpose used in the Mobile Shop ERP.

Database follows

- PostgreSQL 17
- Third Normal Form (3NF)
- UUID for Business Tables
- BIGINT Identity for Master Tables
- Soft Delete
- Audit Columns

---

# Table Naming Convention

snake_case

Examples

products

purchase_items

product_variant_attributes

---

# Common Audit Columns

Every Business Table contains

| Column | Type | Description |
|---------|------|-------------|
| created_at | TIMESTAMPTZ | Record Created Time |
| updated_at | TIMESTAMPTZ | Last Updated Time |
| created_by | UUID | User who created |
| updated_by | UUID | User who updated |
| deleted_at | TIMESTAMPTZ | Soft Delete |

---

# AUTHENTICATION

## roles

| Column | Type | Constraint |
|---------|------|------------|
| id | BIGINT | PK |
| name | VARCHAR(50) | UNIQUE |
| description | TEXT | NULL |
| is_active | BOOLEAN | DEFAULT TRUE |

---

## users

| Column | Type | Constraint |
|---------|------|------------|
| id | UUID | PK |
| role_id | BIGINT | FK |
| first_name | VARCHAR(100) | NOT NULL |
| last_name | VARCHAR(100) | NULL |
| mobile | VARCHAR(15) | UNIQUE |
| email | VARCHAR(150) | UNIQUE |
| password | VARCHAR(255) | NOT NULL |
| is_active | BOOLEAN | DEFAULT TRUE |
| last_login | TIMESTAMPTZ | NULL |

---

## settings

| Column | Type |
|---------|------|
| id | BIGINT |
| company_name | VARCHAR(200) |
| owner_name | VARCHAR(150) |
| gst_number | VARCHAR(20) |
| mobile | VARCHAR(15) |
| email | VARCHAR(150) |
| address | TEXT |
| logo | TEXT |
| invoice_prefix | VARCHAR(20) |

---

# PRODUCT

## brands

| Column | Type |
|---------|------|
| id | BIGINT |
| name | VARCHAR(100) |
| description | TEXT |
| is_active | BOOLEAN |

---

## categories

(Self Referencing)

| Column | Type |
|---------|------|
| id | BIGINT |
| parent_id | BIGINT |
| name | VARCHAR(100) |
| description | TEXT |
| is_active | BOOLEAN |

---

## products

| Column | Type |
|---------|------|
| id | UUID |
| brand_id | BIGINT |
| category_id | BIGINT |
| name | VARCHAR(200) |
| model | VARCHAR(150) |
| hsn_code | VARCHAR(20) |
| description | TEXT |
| is_active | BOOLEAN |

---

## attribute_groups

| Column | Type |
|---------|------|
| id | BIGINT |
| name | VARCHAR(100) |

Example

Color

RAM

Storage

Processor

---

## attributes

| Column | Type |
|---------|------|
| id | BIGINT |
| attribute_group_id | BIGINT |
| name | VARCHAR(100) |
| attribute_type | VARCHAR(30) |

Types

VARIANT

SPECIFICATION

---

## attribute_values

| Column | Type |
|---------|------|
| id | BIGINT |
| attribute_id | BIGINT |
| value | VARCHAR(100) |
| display_order | INTEGER |
| is_active | BOOLEAN |

---

## product_variants

| Column | Type |
|---------|------|
| id | UUID |
| product_id | UUID |
| sku | VARCHAR(100) |
| barcode | VARCHAR(100) |
| is_active | BOOLEAN |

---

## product_images

Images belong to **Product Variants only**. A product must never have images directly attached.

| Column | Type | Constraint |
|---------|------|------------|
| id | UUID | PK |
| variant_id | UUID | FK → product_variants.id |
| image_url | TEXT | NOT NULL |
| display_order | INTEGER | DEFAULT 0 |

---

## product_variant_attributes

| Column | Type |
|---------|------|
| id | UUID |
| variant_id | UUID |
| attribute_value_id | BIGINT |

---

## product_prices

| Column | Type |
|---------|------|
| id | UUID |
| variant_id | UUID |
| price_type | VARCHAR(30) |
| price | DECIMAL(12,2) |
| effective_from | DATE |
| effective_to | DATE |
| is_active | BOOLEAN |

---

# CUSTOMER

## customers

| Column | Type |
|---------|------|
| id | UUID |
| name | VARCHAR(200) |
| mobile | VARCHAR(15) |
| email | VARCHAR(150) |
| address | TEXT |
| gst_number | VARCHAR(20) |

---

# SUPPLIER

## suppliers

| Column | Type |
|---------|------|
| id | UUID |
| supplier_name | VARCHAR(200) |
| contact_person | VARCHAR(150) |
| mobile | VARCHAR(15) |
| email | VARCHAR(150) |
| gst_number | VARCHAR(20) |
| address | TEXT |

---

# PURCHASE

## purchases

| Column | Type |
|---------|------|
| id | UUID |
| supplier_id | UUID |
| invoice_number | VARCHAR(100) |
| invoice_date | DATE |
| total_amount | DECIMAL(12,2) |
| payment_status | VARCHAR(30) |

---

## purchase_items

| Column | Type |
|---------|------|
| id | UUID |
| purchase_id | UUID |
| variant_id | UUID |
| quantity | INTEGER |
| purchase_price | DECIMAL(12,2) |
| tax_amount | DECIMAL(12,2) |
| total_amount | DECIMAL(12,2) |

---

# INVENTORY

## stock

| Column | Type |
|---------|------|
| id | UUID |
| purchase_item_id | UUID |
| variant_id | UUID |
| imei | VARCHAR(30) |
| serial_number | VARCHAR(100) |
| stock_status | VARCHAR(30) | AVAILABLE, RESERVED, SOLD, REPAIR, RETURNED, DAMAGED, LOST |

---

## stock_movements

| Column | Type |
|---------|------|
| id | UUID |
| stock_id | UUID |
| reference_type | VARCHAR(30) |
| reference_id | UUID |
| movement_type | VARCHAR(30) |
| remarks | TEXT |

---

# SALES

## sales

| Column | Type |
|---------|------|
| id | UUID |
| customer_id | UUID |
| invoice_number | VARCHAR(100) |
| invoice_date | DATE |
| total_amount | DECIMAL(12,2) |
| payment_status | VARCHAR(30) |

---

## sale_items

| Column | Type |
|---------|------|
| id | UUID |
| sale_id | UUID |
| stock_id | UUID |
| selling_price | DECIMAL(12,2) |
| discount | DECIMAL(12,2) |
| tax_amount | DECIMAL(12,2) |

---

## payments

| Column | Type |
|---------|------|
| id | UUID |
| reference_type | VARCHAR(30) |
| reference_id | UUID |
| payment_mode | VARCHAR(30) | CASH, UPI, CARD, BANK_TRANSFER, FINANCE, EMI |
| amount | DECIMAL(12,2) |
| transaction_number | VARCHAR(150) |
| payment_date | TIMESTAMPTZ |

Reference Types

SALE

PURCHASE

REPAIR

EXPENSE

---

# SERVICE

## repairs

| Column | Type |
|---------|------|
| id | UUID |
| stock_id | UUID |
| customer_id | UUID |
| repair_status | VARCHAR(30) | RECEIVED, CHECKING, WAITING_PARTS, REPAIRING, READY, DELIVERED, CANCELLED |
| issue_description | TEXT |
| estimated_cost | DECIMAL(12,2) |
| actual_cost | DECIMAL(12,2) |

---

## warranty

Warranty belongs to sold item via **`sale_item_id`** (locked — not `stock_id`).

| Column | Type |
|---------|------|
| id | UUID |
| sale_item_id | UUID FK → sale_items.id |
| warranty_months | INTEGER |
| start_date | DATE |
| end_date | DATE |
| claim_status | VARCHAR(30) |

---

# UTILITY

## expenses

| Column | Type |
|---------|------|
| id | UUID |
| title | VARCHAR(200) |
| amount | DECIMAL(12,2) |
| expense_date | DATE |
| remarks | TEXT |

---

## audit_logs

| Column | Type |
|---------|------|
| id | UUID |
| module_name | VARCHAR(50) |
| table_name | VARCHAR(100) |
| record_id | UUID |
| action | VARCHAR(20) |
| old_data | JSONB |
| new_data | JSONB |
| user_id | UUID |
| ip_address | VARCHAR(50) |

---

# Database Summary

Master Tables

- roles
- brands
- categories
- attribute_groups
- attributes
- attribute_values
- settings

Business Tables

- users
- products
- product_images
- product_variants
- product_variant_attributes
- product_prices
- customers
- suppliers
- purchases
- purchase_items
- stock
- stock_movements
- sales
- sale_items
- payments
- repairs
- warranty
- expenses
- audit_logs

Total Tables

26 (Locked)

Database

PostgreSQL 17

Normalization

3NF

Status

Approved