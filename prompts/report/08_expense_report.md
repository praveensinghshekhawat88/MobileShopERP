# Expense Report — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | REPORT-08 |
| **Module** | Reports (read-only) |
| **Tables** | `expenses` (read only) |
| **Flyway Migration** | `V9__reports.sql` (read-only) |
| **Backend Package** | `com.mobileshoperp.modules.report` |
| **Depends On** | Service module (Phase 7 — expenses entity) |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `docs/01_Project_Requirement.md` — Expense Management, Reports
2. `docs/02_Business_Rules.md` — BR-085, BR-086
3. `tasks/phase-07-service.md`
4. `tasks/phase-08-reports.md` — P08-T011

---

## 2. Objective

Read-only expense reports: daily/monthly expense summary, expense listing by category and date range.

---

## 3. Scope — What to Generate

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/reports/expenses/summary` | Aggregates by date range (daily/monthly buckets) |
| `GET /api/v1/reports/expenses` | Paginated expense list with category and date filters |

---

## 4. Explicit Exclusions — Do NOT Generate

- Expense CRUD (service module — Phase 7)
- Writable endpoints
- Multiple report groups in one response

---

## 5. Stop Condition

**STOP** after expense reports complete. Next: `09_warranty_report.md`.

---

## 6. Business Rules

- BR-085: Read-only
- BR-086: Date filters mandatory on summary
- BR-087: Pagination on list reports
- Exclude soft-deleted records

---

## 7. Definition of Done

- [ ] Date range mandatory on summary
- [ ] Category filter optional on list
- [ ] No mutation endpoints
- [ ] Swagger documented

---

*Prompt REPORT-08 — Approved for production use*
