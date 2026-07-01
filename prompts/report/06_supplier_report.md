# Supplier Report — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | REPORT-06 |
| **Module** | Reports (read-only) |
| **Tables** | `suppliers`, `purchases` (read only) |
| **Flyway Migration** | `V9__reports.sql` (read-only) |
| **Backend Package** | `com.mobileshoperp.modules.report` |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `docs/01_Project_Requirement.md` — Supplier Report
2. `docs/02_Business_Rules.md` — BR-085, BR-086
3. `tasks/phase-08-reports.md`

---

## 2. Objective

Supplier purchase history: spend by supplier, outstanding payment status summary.

---

## 3. Scope — What to Generate

- `GET /api/v1/reports/suppliers/summary`
- `GET /api/v1/reports/suppliers/{id}/purchases`

---

## 4. Explicit Exclusions — Do NOT Generate

- Supplier CRUD
- Payment mutation
- Multiple groups in one response

---

## 5. Stop Condition

**STOP** after requested endpoints. Next: `07_repair_report.md`.

---

## 6. Definition of Done

- [ ] Date-filtered purchase history
- [ ] Payment status from purchases table
- [ ] Read-only, paginated

---

*Prompt REPORT-06 — Approved for production use*
