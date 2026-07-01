# Sales Report — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | REPORT-01 |
| **Module** | Reports (read-only) |
| **Tables** | `sales`, `sale_items`, `customers` (read only) |
| **Flyway Migration** | `V9__reports.sql` (read-only) |
| **Backend Package** | `com.mobileshoperp.modules.report` |
| **Depends On** | Sales module complete |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Pagination, Performance Checklist
2. `docs/02_Business_Rules.md` — BR-085, BR-086, BR-087
3. `docs/01_Project_Requirement.md` — Reports section
4. `tasks/phase-08-reports.md`

---

## 2. Objective

Implement **read-only** sales reporting APIs: daily summary, date-range listing, sales by customer, sales by variant.

---

## 3. Scope — What to Generate

One report endpoint group per invocation:

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/reports/sales/summary` | Aggregates by date range |
| `GET /api/v1/reports/sales` | Paginated sale list with filters |
| `GET /api/v1/reports/sales/by-customer` | Grouped by customer |

---

## 4. Explicit Exclusions — Do NOT Generate

- **Any INSERT/UPDATE/DELETE** (BR-085)
- New database tables
- Entity classes for reports (use DTO/projection queries)
- N+1 queries — use JOIN or aggregate SQL
- Multiple report groups in one response

---

## 5. Stop Condition

**STOP** after requested report group. Next: `02_purchase_report.md`.

---

## 6. Query Requirements

- Date filter: `fromDate`, `toDate` (required on summary)
- Pagination: `page`, `size`, `sort`
- Response: `ApiResponse<Page<SalesReportDto>>`
- Target: < 500ms for typical ranges (NFR)

---

## 7. Business Rules

- BR-085: Read-only
- BR-086: Date filters mandatory where applicable
- BR-087: Pagination on list reports
- Exclude soft-deleted records

---

## 8. Coding Standards

Dedicated `SalesReportService` + `SalesReportController`. Use `@Transactional(readOnly = true)`. Per `AGENTS.md`.

---

## 9. Definition of Done

- [ ] No data mutation
- [ ] Paginated and filtered
- [ ] Swagger documented
- [ ] Query uses indexes (invoice_date, customer_id)

---

*Prompt REPORT-01 — Approved for production use*
