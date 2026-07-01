# Phase 3 — Business Module

**Status:** ⬜ Pending

**Master Roadmap:** [TASKS.md](../TASKS.md)

**Task ID Format:** `P03-Txxx`

**Depends on:** [phase-02-product.md](./phase-02-product.md)

**Flyway Migration:** `V4__business.sql`

---

## Status Legend

⬜ Pending | 🟨 In Progress | 🟩 Completed | 🟥 Blocked

---

## Goal

Implement customer and supplier master data used by purchase and sales modules.

---

## Tables (2)

- `customers`
- `suppliers`

---

## Tasks

### Customer

- [ ] P03-T001 — Customer Entity
- [ ] P03-T002 — Customer Repository
- [ ] P03-T003 — Customer DTO
- [ ] P03-T004 — Customer Mapper
- [ ] P03-T005 — Customer Service
- [ ] P03-T006 — Customer Controller
- [ ] P03-T007 — Customer Exception
- [ ] P03-T008 — Customer Unit Tests

### Supplier

- [ ] P03-T009 — Supplier Entity
- [ ] P03-T010 — Supplier Repository
- [ ] P03-T011 — Supplier DTO
- [ ] P03-T012 — Supplier Mapper
- [ ] P03-T013 — Supplier Service
- [ ] P03-T014 — Supplier Controller
- [ ] P03-T015 — Supplier Exception
- [ ] P03-T016 — Supplier Unit Tests

---

## Exit Criteria

- [ ] Customer CRUD with unique phone validation
- [ ] Supplier CRUD is functional
- [ ] Both modules follow layered architecture (Entity → Repository → DTO → Mapper → Service → Controller)

---

## Notes

Customers and suppliers are prerequisites for Purchase (Phase 4) and Sales (Phase 6).
