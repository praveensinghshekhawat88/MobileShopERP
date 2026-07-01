# Phase 7 — Service Module

**Status:** ⬜ Pending

**Master Roadmap:** [TASKS.md](../TASKS.md)

**Task ID Format:** `P07-Txxx`

**Depends on:** [phase-06-sales.md](./phase-06-sales.md)

**Flyway Migration:** `V8__service.sql`

**Backend Package:** `com.mobileshoperp.modules.service`, `com.mobileshoperp.modules.utility`

---

## Status Legend

⬜ Pending | 🟨 In Progress | 🟩 Completed | 🟥 Blocked

---

# Goal

Implement Repair Management, Warranty Management, Expense Management and Audit Logging.

---

# Database Tables (4)

- repairs
- warranty (`sale_item_id` FK — locked)
- expenses
- audit_logs

---

# Repair Status (Locked Enum)

RECEIVED, CHECKING, WAITING_PARTS, REPAIRING, READY, DELIVERED, CANCELLED

---

# Section 1 — Repair Module

- [ ] P07-T001 — Repair Entity
- [ ] P07-T002 — Repair Repository
- [ ] P07-T003 — Repair DTO
- [ ] P07-T004 — Repair Mapper
- [ ] P07-T005 — Repair Service
- [ ] P07-T006 — Repair Controller
- [ ] P07-T007 — Repair CRUD APIs

---

# Section 2 — Repair Status Workflow

- [ ] P07-T008 — Repair Status Validation
- [ ] P07-T009 — Repair Timeline
- [ ] P07-T010 — Repair Cost Calculation
- [ ] P07-T011 — Repair History API

---

# Section 3 — Warranty Module

- [ ] P07-T012 — Warranty Entity (`sale_item_id` FK)
- [ ] P07-T013 — Warranty Repository
- [ ] P07-T014 — Warranty DTO
- [ ] P07-T015 — Warranty Mapper
- [ ] P07-T016 — Warranty Service
- [ ] P07-T017 — Warranty Controller
- [ ] P07-T018 — Warranty Validation
- [ ] P07-T019 — Warranty Expiry Calculation
- [ ] P07-T020 — Warranty Claim Validation

---

# Section 4 — Expense Module

- [ ] P07-T021 — Expense Entity
- [ ] P07-T022 — Expense Repository
- [ ] P07-T023 — Expense DTO
- [ ] P07-T024 — Expense Mapper
- [ ] P07-T025 — Expense Service
- [ ] P07-T026 — Expense Controller
- [ ] P07-T027 — Expense CRUD APIs
- [ ] P07-T028 — Expense Validation

---

# Section 5 — Audit Module

- [ ] P07-T029 — AuditLog Entity
- [ ] P07-T030 — AuditLog Repository
- [ ] P07-T031 — AuditLog Service
- [ ] P07-T032 — AuditLog APIs
- [ ] P07-T033 — Create Audit Entry
- [ ] P07-T034 — Update Audit Entry
- [ ] P07-T035 — Delete Audit Entry
- [ ] P07-T036 — Login Audit
- [ ] P07-T037 — Audit Search API

---

# Section 6 — Testing

- [ ] P07-T038 — Repair Unit Tests
- [ ] P07-T039 — Warranty Unit Tests
- [ ] P07-T040 — Expense Unit Tests
- [ ] P07-T041 — Audit Module Tests
- [ ] P07-T042 — Integration Tests
- [ ] P07-T043 — API Tests

---

# Exit Criteria

- [ ] Repair CRUD and status workflow completed
- [ ] Warranty references `sale_item_id` (not `stock_id`)
- [ ] Warranty expiry calculated automatically
- [ ] Expense CRUD completed
- [ ] Audit logging working
- [ ] All APIs return ApiResponse<T>

---

## Notes

- Warranty belongs to the sold item via `sale_item_id`.
- Expense categories are Phase 2 — not in Phase 1.
- Report APIs are implemented in Phase 8 (`phase-08-reports.md`).
