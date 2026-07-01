# Phase 5 — Inventory Module

**Status:** ⬜ Pending

**Master Roadmap:** [TASKS.md](../TASKS.md)

**Task ID Format:** `P05-Txxx`

**Depends on:** [phase-04-purchase.md](./phase-04-purchase.md)

**Flyway Migration:** `V6__inventory.sql`

**Backend Package:** `com.mobileshoperp.modules.inventory`

---

## Status Legend

⬜ Pending | 🟨 In Progress | 🟩 Completed | 🟥 Blocked

---

# Goal

Implement complete inventory management including stock creation, IMEI tracking, stock lifecycle, and stock movement ledger.

---

# Business Rules Reference

- BR-041 through BR-047

---

# Database Tables (2)

- stock
- stock_movements

---

# Stock Status (Locked Enum)

AVAILABLE, RESERVED, SOLD, REPAIR, RETURNED, DAMAGED, LOST

---

# Section 1 — Stock

- [ ] P05-T001 — Stock Entity
- [ ] P05-T002 — Stock Repository
- [ ] P05-T003 — Stock DTO
- [ ] P05-T004 — Stock Mapper
- [ ] P05-T005 — Stock Service
- [ ] P05-T006 — Stock Controller
- [ ] P05-T007 — Stock CRUD APIs

---

# Section 2 — Stock Validation

- [ ] P05-T008 — IMEI Duplicate Validation
- [ ] P05-T009 — IMEI Format Validation
- [ ] P05-T010 — Serial Number Validation
- [ ] P05-T011 — Stock Status Validation
- [ ] P05-T012 — Quantity Validation

---

# Section 3 — Stock Movement

- [ ] P05-T013 — StockMovement Entity
- [ ] P05-T014 — StockMovement Repository
- [ ] P05-T015 — StockMovement DTO
- [ ] P05-T016 — StockMovement Mapper
- [ ] P05-T017 — StockMovement Service
- [ ] P05-T018 — StockMovement Controller

---

# Section 4 — Stock Lifecycle

- [ ] P05-T019 — Purchase Stock Creation
- [ ] P05-T020 — Sale Stock Update
- [ ] P05-T021 — Repair Stock Update
- [ ] P05-T022 — Return Stock Update
- [ ] P05-T023 — Damaged Stock Update
- [ ] P05-T024 — Lost Stock Update

---

# Section 5 — Inventory Search

- [ ] P05-T025 — Search by IMEI
- [ ] P05-T026 — Search by Serial Number
- [ ] P05-T027 — Search by Variant
- [ ] P05-T028 — Search by Stock Status
- [ ] P05-T029 — Search by Purchase
- [ ] P05-T030 — Search by Date Range

---

# Section 6 — Inventory APIs

- [ ] P05-T031 — Stock Availability API
- [ ] P05-T032 — Stock History API
- [ ] P05-T033 — Current Stock API
- [ ] P05-T034 — Low Stock API

---

# Section 7 — Testing

- [ ] P05-T035 — Unit Tests
- [ ] P05-T036 — Integration Tests
- [ ] P05-T037 — API Tests

---

# Exit Criteria

- [ ] Stock records are created after purchase
- [ ] Duplicate IMEI is prevented
- [ ] Stock status lifecycle is enforced
- [ ] Every stock change creates a stock movement
- [ ] All APIs return ApiResponse<T>

---

## Notes

- Every stock status change must create a Stock Movement record.
- No Warehouse module in Phase 1.
- Report APIs are implemented in Phase 8 (`phase-08-reports.md`).
