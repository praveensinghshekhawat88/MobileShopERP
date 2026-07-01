# Phase 8 — Reports

**Status:** ⬜ Pending

**Master Roadmap:** [TASKS.md](../TASKS.md)

**Task ID Format:** `P08-Txxx`

**Depends on:** [phase-07-service.md](./phase-07-service.md)

**Flyway Migration:** `V9__reports.sql` (report indexes/views if required)

**Backend Package:** `com.mobileshoperp.modules.report`

---

## Status Legend

⬜ Pending | 🟨 In Progress | 🟩 Completed | 🟥 Blocked

---

## Goal

Implement read-only business reports and analytics APIs across sales, purchase, inventory, and service data.

---

## Tasks

### Sales Reports

- [ ] P08-T001 — Daily sales report
- [ ] P08-T002 — Monthly sales report
- [ ] P08-T003 — Sales by product/variant
- [ ] P08-T004 — Sales by customer

### Purchase Reports

- [ ] P08-T005 — Purchase report
- [ ] P08-T006 — Purchase by supplier

### Inventory Reports

- [ ] P08-T007 — Current stock report
- [ ] P08-T008 — Stock movement report
- [ ] P08-T009 — Low stock alert report

### Financial Reports

- [ ] P08-T010 — Profit report
- [ ] P08-T011 — Expense report

### Service Reports

- [ ] P08-T012 — Repair report
- [ ] P08-T013 — Warranty report

### Export & Performance

- [ ] P08-T014 — Report pagination and date-range filters
- [ ] P08-T015 — Report API tests

---

## Exit Criteria

- [ ] All reports listed in `docs/01_Project_Requirement.md` are available via API
- [ ] Reports support date-range filtering
- [ ] Report queries are paginated and indexed appropriately
- [ ] Reports never mutate business data (BR-085)

---

## Notes

Reports are read-only APIs. No business logic mutations in this phase.
