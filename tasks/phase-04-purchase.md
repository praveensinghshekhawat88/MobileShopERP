# Phase 4 — Purchase Module

**Status:** ⬜ Pending

**Master Roadmap:** [TASKS.md](../TASKS.md)

**Task ID Format:** `P04-Txxx`

**Depends on:** [phase-03-business.md](./phase-03-business.md)

**Flyway Migration:** `V5__purchase.sql`

---

## Status Legend

⬜ Pending | 🟨 In Progress | 🟩 Completed | 🟥 Blocked

---

## Goal

Implement purchase orders, purchase items, and purchase finalization that creates stock entries.

---

## Tables (2)

- `purchases`
- `purchase_items`

---

## Tasks

### Purchase

- [ ] P04-T001 — Purchase Entity
- [ ] P04-T002 — Purchase Repository
- [ ] P04-T003 — Purchase DTO (`PurchaseDto`, `CreatePurchaseRequest`)
- [ ] P04-T004 — Purchase Mapper
- [ ] P04-T005 — Purchase Service (with status validation)
- [ ] P04-T006 — Purchase Controller
- [ ] P04-T007 — Purchase Exception

### Purchase Item

- [ ] P04-T008 — PurchaseItem Entity
- [ ] P04-T009 — PurchaseItem Repository
- [ ] P04-T010 — PurchaseItem DTO
- [ ] P04-T011 — PurchaseItem Mapper
- [ ] P04-T012 — PurchaseItem Service (linked to Purchase)

### Business Logic

- [ ] P04-T013 — Purchase finalization → auto-create Stock entries
- [ ] P04-T014 — Purchase status lifecycle (DRAFT → CONFIRMED → RECEIVED → CANCELLED)
- [ ] P04-T015 — Purchase Module Tests

---

## Exit Criteria

- [ ] Purchase can be created with line items
- [ ] Received purchase creates stock records with correct `purchase_item_id` origin
- [ ] Purchase history and invoice details are retrievable

---

## Notes

Every stock item must trace back to a `purchase_item_id`. See `docs/02_Business_Rules.md`.
