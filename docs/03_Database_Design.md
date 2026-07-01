# 03_Database_Design.md

---

# Mobile Shop ERP

## Database Design Document

Version : 1.0

Database : PostgreSQL 17

Database Name (Locked) : mobile_shop_erp

Total Tables (Locked) : 26

Prepared By : Praveen Singh Shekhawat

---

# 1. Database Overview

The Mobile Shop ERP database is designed using Third Normal Form (3NF).

Objectives

- Eliminate data redundancy
- Maintain data integrity
- Improve scalability
- Improve query performance
- Support future Retail ERP expansion

---

# 2. Database Type

Database Engine

PostgreSQL 17

Character Set

UTF-8

Timezone

UTC

Extension

pgcrypto

citext

---

# 3. Design Principles

The database follows

- 3NF
- ACID Transactions
- Referential Integrity
- Soft Delete
- Audit Logging
- UUID Based Business Tables
- Lookup Table Optimization

---

# 4. UUID Strategy

## Business Tables

UUID will be used.

Reason

- Android Offline Sync
- Future Multi Branch
- API Friendly
- No ID Collision

Business Tables

products

customers

suppliers

purchases

purchase_items

stock

sales

sale_items

payments

repairs

warranty

expenses

audit_logs

---

## Master Tables

BIGINT Identity

Reason

Small data

Fast Index

Easy Lookup

Master Tables

roles

brands

categories

attribute_groups

attributes

attribute_values

settings

---

# 5. Table Naming Convention

Use

snake_case

Examples

products

purchase_items

product_variant_attributes

Never use

CamelCase

Plural names only.

---

# 6. Column Naming Convention

Primary Key

id

Foreign Key

table_name_id

Examples

product_id

customer_id

purchase_id

sale_id

brand_id

category_id

created_by

updated_by

deleted_by

---

# 7. Audit Columns

Every Business Table contains

created_at

updated_at

created_by

updated_by

deleted_at

Purpose

- History
- Traceability
- Security

---

# 8. Soft Delete Strategy

No Business Record should be physically deleted.

Use

deleted_at

Instead.

Reason

- History
- Reports
- Auditing
- Recovery

---

# 9. Foreign Key Rules

Every Foreign Key must be indexed.

No orphan records.

Always use Referential Integrity.

Example

Purchase

↓

Purchase Items

↓

Stock

---

# 10. Relationship Strategy

One to One

Warranty

↓

Sale Item

---

One to Many

Brand

↓

Products

---

Many to One

Products

↓

Brand

---

Many to Many

Solved using Junction Table.

Example

Variant

↓

Variant Attributes

↓

Attribute Values

---

# 11. Product Design

Brand

↓

Category

↓

Product

↓

Variant

↓

Variant Attributes

↓

Prices

↓

Stock

Reason

Support

- Multiple Colors
- Multiple RAM
- Multiple Storage
- Dynamic Specifications

---

# 12. Attribute Engine

Attribute Group

↓

Attribute

↓

Attribute Value

↓

Variant Attribute

Example

Color

↓

Black

Blue

Silver

RAM

↓

8GB

12GB

Storage

↓

128GB

256GB

No free text allowed.

---

# 13. Price Strategy

Prices stored separately.

Reason

Price History

Multiple Price Types

Future Offers

Table

product_prices

Supported Types

MRP

Retail

Wholesale

Dealer

Offer

Fields

effective_from

effective_to

---

# 14. Inventory Strategy

Each purchased mobile generates one Stock record.

Stock Status

AVAILABLE

RESERVED

SOLD

REPAIR

RETURNED

DAMAGED

LOST

Each Mobile

↓

Unique IMEI

Accessories

↓

IMEI NULL

---

# 15. Stock Movement Strategy

Every inventory change creates

Stock Movement.

Reference Types

PURCHASE

SALE

RETURN

REPAIR

ADJUSTMENT

TRANSFER

Purpose

Complete inventory history.

---

# 16. Payment Strategy

Generic Payment Engine

reference_type

reference_id

Supported Modules

SALE

PURCHASE

REPAIR

EXPENSE

Reason

Single payment engine.

---

# 17. Category Strategy

Self Referencing Category.

Fields

id

parent_id

name

Example

Electronics

↓

Mobiles

↓

Android Phones

↓

Samsung

Unlimited Levels Supported.

---

# 18. Constraint Strategy

Primary Keys

Foreign Keys

Unique Keys

Check Constraints

Not Null Constraints

Default Values

Examples

SKU Unique

IMEI Unique

Invoice Number Unique

Mobile Number Unique

---

# 19. Index Strategy

Indexes

Product Name

SKU

Barcode

IMEI

Invoice Number

Customer Mobile

Supplier Mobile

Created Date

Foreign Keys

Purpose

Improve Search Performance.

---

# 20. Transaction Strategy

Every Business Operation uses Transaction.

Examples

Purchase

↓

Purchase Items

↓

Stock

Commit together.

If one fails

↓

Rollback.

---

# 21. Database Security

Use Prepared Statements.

Never concatenate SQL.

Use Spring Data JPA.

Restrict Database Access.

Store passwords using BCrypt.

---

# 22. Performance Strategy

Index Frequently Used Columns.

Avoid SELECT *.

Use Pagination.

Lazy Loading where required.

Batch Inserts for Imports.

---

# 23. Backup Strategy

Daily Backup

Weekly Full Backup

Monthly Archive

Restore Testing every month.

---

# 24. Migration Strategy

Migration Tool

Flyway

Database Name (Locked)

mobile_shop_erp

Rules

Never modify old migrations.

Create new migration only.

Migration Order (Locked)

V1__foundation.sql

V2__authentication.sql

V3__product.sql

V4__business.sql

V5__purchase.sql

V6__inventory.sql

V7__sales.sql

V8__service.sql

V9__reports.sql

V10__future.sql

Total Tables (Locked)

26

---

# 25. Folder Structure

database/

migrations/

V1__foundation.sql

V2__authentication.sql

V3__product.sql

V4__business.sql

V5__purchase.sql

V6__inventory.sql

V7__sales.sql

V8__service.sql

V9__reports.sql

V10__future.sql

---

# 26. Database Goals

The database should

- Support more than 1 Million Stock Records
- Support more than 100,000 Products
- Support multiple future branches
- Maintain complete audit history
- Prevent duplicate business data
- Follow Enterprise Standards
- Be production ready

---

# 27. Conclusion

The Mobile Shop ERP database is designed using enterprise database principles with PostgreSQL, UUID-based business entities, normalized tables, complete audit support, soft delete, and scalable architecture suitable for future Retail ERP expansion.