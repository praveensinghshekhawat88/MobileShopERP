# Customer Report — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | REPORT-05 |
| **Module** | Reports (read-only) |
| **Tables** | `customers`, `sales` (read only) |
| **Flyway Migration** | `V9__reports.sql` (read-only) |
| **Backend Package** | `com.mobileshoperp.modules.report` |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `docs/01_Project_Requirement.md` — Customer Report
2. `docs/02_Business_Rules.md` — BR-050, BR-085, BR-086
3. `tasks/phase-08-reports.md`

---

## 2. Objective

Customer purchase history report: top customers by revenue, individual customer ledger with sales list.

---

## 3. Scope — What to Generate

- `GET /api/v1/reports/customers/top`
- `GET /api/v1/reports/customers/{id}/history`

---

## 4. Explicit Exclusions — Do NOT Generate

- Customer CRUD (business module)
- Data mutation
- Multiple endpoints groups in one response

---

## 5. Stop Condition

**STOP** after requested endpoints. Next: `06_supplier_report.md`.

---

## 6. Business Rules

- BR-050: History includes soft-deleted customer's past sales
- BR-086: Date filters on history
- BR-087: Pagination

---

## 7. Definition of Done

- [ ] Read-only
- [ ] Paginated history
- [ ] Aggregates correct

---

*Prompt REPORT-05 — Approved for production use*
