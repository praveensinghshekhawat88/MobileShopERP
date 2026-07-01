# Repair Report — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | REPORT-07 |
| **Module** | Reports (read-only) |
| **Tables** | `repairs`, `customers`, `stock` (read only) |
| **Flyway Migration** | `V9__reports.sql` (read-only) |
| **Backend Package** | `com.mobileshoperp.modules.report` |
| **Depends On** | Service module (Phase 7 — repairs entity) |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `docs/01_Project_Requirement.md` — Repair Report
2. `docs/02_Business_Rules.md` — BR-064, BR-065, BR-085
3. `tasks/phase-07-service.md`
4. `tasks/phase-08-reports.md`

---

## 2. Objective

Read-only repair reports: open repairs by status, completed repairs by date range, technician workload (when technician_id available in schema).

---

## 3. Scope — What to Generate

- `GET /api/v1/reports/repairs/summary`
- `GET /api/v1/reports/repairs` (paginated, filter by status/date)

---

## 4. Explicit Exclusions — Do NOT Generate

- Repair CRUD (service module — Phase 7)
- Deleting repair history (BR-065)
- Multiple groups in one response

---

## 5. Stop Condition

**STOP** after repair reports complete. Next: `08_expense_report.md`.

---

## 6. Business Rules

- BR-064: Status values — RECEIVED, CHECKING, WAITING_PARTS, REPAIRING, READY, DELIVERED, CANCELLED
- BR-065: History never deleted — report includes all non-soft-deleted records
- BR-085: Read-only

---

## 7. Definition of Done

- [ ] Status filter works
- [ ] Date range on completed/delivered repairs
- [ ] No mutation endpoints

---

*Prompt REPORT-07 — Approved for production use*

---

## Note

Repair entity implementation is tracked in `tasks/phase-07-service.md`. Execute this report prompt **after** repairs module is built, or generate report service with repository dependency stub documented only if explicitly approved.
