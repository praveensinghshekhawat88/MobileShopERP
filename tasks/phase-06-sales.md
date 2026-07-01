# Phase 6 — Sales Module

**Status:** ⬜ Pending

**Master Roadmap:** [TASKS.md](../TASKS.md)

**Task ID Format:** `P06-Txxx`

**Depends on:** [phase-05-inventory.md](./phase-05-inventory.md)

**Flyway Migration:** `V7__sales.sql`

**Backend Package:** `com.mobileshoperp.modules.sales`, `com.mobileshoperp.modules.utility` (payments)

---

## Status Legend

⬜ Pending | 🟨 In Progress | 🟩 Completed | 🟥 Blocked

---

## Goal

Implement sales, sale items, generic payments, and POS billing with stock deduction.

---

## Tables (3)

- `sales`
- `sale_items`
- `payments`

---

## Tasks

### Sale

- [ ] P06-T001 — Sale Entity
- [ ] P06-T002 — Sale Repository
- [ ] P06-T003 — Sale DTO (`SaleDto`, `CreateSaleRequest`, `SaleItemRequest`)
- [ ] P06-T004 — Sale Mapper
- [ ] P06-T005 — Sale Service
- [ ] P06-T006 — Sale Controller

### Sale Item

- [ ] P06-T007 — SaleItem Entity
- [ ] P06-T008 — SaleItem Repository + DTO + Mapper

### Payment (Generic Engine)

- [ ] P06-T009 — Payment Entity
- [ ] P06-T010 — Payment Repository + DTO + Mapper + Service + Controller

### Business Logic

- [ ] P06-T011 — Stock availability check before sale
- [ ] P06-T012 — Mark stock as SOLD on sale completion
- [ ] P06-T013 — Create stock_movement on sale
- [ ] P06-T014 — Partial payment support (PENDING → PARTIAL → PAID)
- [ ] P06-T015 — Invoice generation
- [ ] P06-T016 — Sales Module Tests

---

## Exit Criteria

- [ ] Sale cannot proceed if stock status is not AVAILABLE
- [ ] Multiple payments can be recorded against one sale
- [ ] Stock and movement records are updated atomically
- [ ] Sales history and invoice retrieval work

---

## Notes

Sale flow: check stock → create sale → create sale_items → mark stock SOLD → record payment → create movement.

Warranty records (`sale_item_id` FK) are created in Phase 7 Service module.
