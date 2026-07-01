# MobileShopERP — Cursor Prompt Library

**Version:** 1.1  
**Status:** Architecture Locked  
**Total Tables:** 26  
**Database:** `mobile_shop_erp`  
**Scope:** Backend API only (Java 21 / Spring Boot 3.5 / PostgreSQL 17)

---

## Purpose

Module-scoped execution prompts for Cursor AI. Each prompt defines **how** to generate one feature slice — what to read, what to build, what to exclude, and where to stop.

---

## Global Rules

1. Documentation is the source of truth.
2. **One layer at a time:** Entity → Repository → DTO → Mapper → Service → Controller → Exception → Unit Test.
3. Never skip module order (see execution sequence below).
4. Never generate demo, sample, TODO, or incomplete code.
5. Never modify existing Flyway migrations.
6. Wait for human approval between layers.

---

## Mandatory Reading Order

| Priority | Document |
|----------|----------|
| 1 | `AGENTS.md` |
| 2 | `PROJECT_CONTEXT.md` |
| 3 | `ARCHITECTURE.md` |
| 4 | `docs/01_Project_Requirement.md` |
| 5 | `docs/02_Business_Rules.md` |
| 6 | `docs/03_Database_Design.md` |
| 7 | `docs/04_ER_Diagram.md` |
| 8 | `docs/05_Data_Dictionary.md` |
| 9 | Relevant `tasks/phase-XX-*.md` |

---

## Prompt Execution Order (Locked)

```
Foundation (Phase 0 — tasks/phase-00-foundation.md)
        ↓
Auth (prompts/auth/)
        ↓
Settings (prompts/settings/)
        ↓
Product (prompts/product/)
        ↓
Business — Customer & Supplier (prompts/customer/, prompts/supplier/)
        ↓
Purchase (prompts/purchase/)
        ↓
Inventory (prompts/stock/ → modules.inventory)
        ↓
Sales (prompts/sales/)
        ↓
Payment (prompts/payment/ → modules.utility)
        ↓
Service (prompts/service/)
        ↓
Reports (prompts/report/ → modules.report)
        ↓
Deployment (tasks/phase-09-deployment.md)
```

---

## Flyway Migration Mapping

| Prompt Folder | Migration File | Backend Package |
|---------------|----------------|-----------------|
| *(Phase 0)* | `V1__foundation.sql` | `config`, `common`, `security` |
| `auth/`, `settings/` | `V2__authentication.sql` | `modules.auth` |
| `product/` | `V3__product.sql` | `modules.product` |
| `customer/`, `supplier/` | `V4__business.sql` | `modules.business` |
| `purchase/` | `V5__purchase.sql` | `modules.purchase` |
| `stock/` | `V6__inventory.sql` | `modules.inventory` |
| `sales/`, `payment/` | `V7__sales.sql` | `modules.sales`, `modules.utility` |
| `service/` | `V8__service.sql` | `modules.service`, `modules.utility` |
| `report/` | `V9__reports.sql` | `modules.report` (read-only) |
| *(Deployment)* | `V10__future.sql` | seed / future placeholders |

---

## Prompt Folder Index

| Folder | Prompts | Domain |
|--------|---------|--------|
| `auth/` | 4 | Roles, users, JWT security, login/refresh |
| `settings/` | 1 | Shop configuration |
| `product/` | 10 | Brand through variant images |
| `customer/` | 1 | Customer master |
| `supplier/` | 1 | Supplier master |
| `purchase/` | 3 | Purchase header, items, receive-to-stock |
| `stock/` | 3 | Stock, movements, status lifecycle → **`modules.inventory`** |
| `sales/` | 3 | Sale header, items, completion workflow |
| `payment/` | 1 | Generic payment engine |
| `service/` | 4 | Repairs, warranty, expenses, audit logs |
| `report/` | 9 | Read-only business reports |

**Total micro-prompts:** 40

---

## Locked Enums (Reference)

**Payment Mode:** CASH, UPI, CARD, BANK_TRANSFER, FINANCE, EMI

**Repair Status:** RECEIVED, CHECKING, WAITING_PARTS, REPAIRING, READY, DELIVERED, CANCELLED

**Stock Status:** AVAILABLE, RESERVED, SOLD, REPAIR, RETURNED, DAMAGED, LOST

---

## Architecture Reference — 26 Tables

**Master (7):** roles, brands, categories, attribute_groups, attributes, attribute_values, settings

**Business (19):** users, products, product_images, product_variants, product_variant_attributes, product_prices, customers, suppliers, purchases, purchase_items, stock, stock_movements, sales, sale_items, payments, repairs, warranty, expenses, audit_logs

---

## Out of Scope

- Frontend / Web Admin / Android
- Warehouse / multi-branch (Phase 10)
- Expense categories (Phase 10)
- Architecture or schema changes without approval

---

*End of Prompt Library Index*
