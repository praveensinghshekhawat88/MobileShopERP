# 04_ER_Diagram.md

---

# Mobile Shop ERP

## Entity Relationship Document (ERD)

Version : 1.0

Database : PostgreSQL 17

Architecture : 3NF

---

# 1. Overview

The Mobile Shop ERP database follows a modular architecture.

Modules

- Authentication
- Product
- Customer
- Supplier
- Purchase
- Inventory
- Sales
- Service
- Utility

---

# 2. Entity Relationship Diagram

```

```
                                    ┌──────────────┐
                                    │    ROLES     │
                                    └──────┬───────┘
                                           │1
                                           │
                                           │N
                                    ┌──────▼───────┐
                                    │    USERS     │
                                    └──────────────┘

================================================================================
                            PRODUCT MODULE
================================================================================

     BRANDS
        │1
        │
        │N
    PRODUCTS
        │1
        │
        │N
    PRODUCT_VARIANTS
        │
        ├──────────────────────────────┐
        │                              │
        │1                             │1
        │                              │
        │N                             │N
        ▼                              ▼
PRODUCT_IMAGES              PRODUCT_VARIANT_ATTRIBUTES
                                      │
                                      │N
                                      │
                                      │1
                                      ▼
                          ATTRIBUTE_VALUES
                                      │
                                      │N
                                      │
                                      │1
                                      ▼
                               ATTRIBUTES
                                      │
                                      │N
                                      │
                                      │1
                                      ▼
                           ATTRIBUTE_GROUPS

PRODUCT_VARIANTS
        │
        │1
        │
        │N
PRODUCT_PRICES

CATEGORIES
      │
      │ (Self Reference via parent_id)
      ▼
Child Categories
      │
      ▼
Products

================================================================================
                           PURCHASE MODULE
================================================================================

SUPPLIERS
      │1
      │
      │N
PURCHASES
      │1
      │
      │N
PURCHASE_ITEMS
      │
      │N
      │
      │1
PRODUCT_VARIANTS

================================================================================
                          INVENTORY MODULE
================================================================================

PURCHASE_ITEMS
      │
      │1
      │
      │N
STOCK
      │
      ├────────────► STOCK_MOVEMENTS
      │
      ├────────────► REPAIRS
      │
      └────────────► SALE_ITEMS

SALE_ITEMS
      │
      │1
      │
      │1
      WARRANTY

================================================================================
                             SALES MODULE
================================================================================

CUSTOMERS
      │1
      │
      │N
SALES
      │1
      │
      │N
SALE_ITEMS
      │
      │1
      ▼
STOCK

SALES
      │1
      │
      │N
PAYMENTS

================================================================================
                             UTILITY MODULE
================================================================================

SETTINGS

EXPENSES

AUDIT_LOGS
```

---

# 3. Module-wise Tables

## Authentication

- roles
- users
- settings

---

## Product

- brands
- categories
- products
- product_images
- attribute_groups
- attributes
- attribute_values
- product_variants
- product_variant_attributes
- product_prices

---

## Customer

- customers

---

## Supplier

- suppliers

---

## Purchase

- purchases
- purchase_items

---

## Inventory

- stock
- stock_movements

---

## Sales

- sales
- sale_items
- payments

---

## Service

- repairs
- warranty

---

## Utility

- expenses
- audit_logs

---

# 4. Relationship Matrix

| Parent | Child | Relation |
|----------|--------|---------|
| Roles | Users | 1:N |
| Brands | Products | 1:N |
| Categories | Products | 1:N |
| Products | Product Variants | 1:N |
| Product Variants | Product Images | 1:N |
| Attribute Groups | Attributes | 1:N |
| Attributes | Attribute Values | 1:N |
| Attribute Values | Variant Attributes | 1:N |
| Variants | Variant Attributes | 1:N |
| Variants | Product Prices | 1:N |
| Suppliers | Purchases | 1:N |
| Purchases | Purchase Items | 1:N |
| Purchase Items | Stock | 1:N |
| Customers | Sales | 1:N |
| Sales | Sale Items | 1:N |
| Stock | Sale Items | 1:1 |
| Sales | Payments | 1:N |
| Stock | Repairs | 1:N |
| Sale Items | Warranty | 1:1 |

---

# 5. Primary Keys

Business Tables

UUID

Master Tables

BIGINT Identity

---

# 6. Foreign Keys

Every business table uses foreign key constraints.

Examples

product_id

customer_id

purchase_id

supplier_id

sale_id

stock_id

sale_item_id

variant_id

attribute_value_id

---

# 7. Business Flow

Purchase

↓

Purchase Items

↓

Stock

↓

Sale

↓

Payment

↓

Warranty

↓

Repair

---

# 8. Product Flow

Brand

↓

Category

↓

Product

↓

Variant

↓

Images

↓

Attributes

↓

Prices

↓

Stock

---

# 9. Inventory Flow

Purchase

↓

Stock

↓

AVAILABLE

↓

RESERVED

↓

SOLD

↓

REPAIR

↓

RETURNED

↓

DAMAGED

---

# 10. Payment Flow

Reference Type

SALE

↓

Payment

Reference Type

PURCHASE

↓

Payment

Reference Type

REPAIR

↓

Payment

Reference Type

EXPENSE

↓

Payment

---

# 11. Stock Lifecycle

Purchase

↓

AVAILABLE

↓

RESERVED

↓

SOLD

↓

Warranty

↓

REPAIR

↓

RETURNED

---

# 12. Database Goals

- Fully Normalized
- No Duplicate Data
- Fast Queries
- Audit Enabled
- Soft Delete Enabled
- Future Multi Branch Support
- Retail ERP Ready

---

# 13. Summary

Total Modules : 9

Total Tables : 26

| Module | Tables |
|--------|--------|
| Authentication | 3 |
| Product | 10 |
| Business (Customer & Supplier) | 2 |
| Purchase | 2 |
| Inventory | 2 |
| Sales | 3 |
| Service | 2 |
| Utility | 2 |
| Reports | 0 (read-only APIs) |

Database Name : mobile_shop_erp

Database : PostgreSQL 17

Normalization : 3NF

Architecture : Enterprise Grade

Status : Approved