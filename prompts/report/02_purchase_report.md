# Purchase Report — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | REPORT-02 |
| **Module** | Reports (read-only) |
| **Tables** | `purchases`, `purchase_items`, `suppliers` (read only) |
| **Flyway Migration** | `V9__reports.sql` (read-only) |
| **Backend Package** | `com.mobileshoperp.modules.report` |
| **Depends On** | Purchase module complete |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `docs/02_Business_Rules.md` — BR-085 through BR-087
2. `docs/01_Project_Requirement.md` — Purchase Report
3. `tasks/phase-08-reports.md`

---

## 2. Objective

Read-only purchase reports: summary by date range, by supplier, invoice listing.

---

## 3. Scope — What to Generate

One report group per invocation under `/api/v1/reports/purchases/**`.

---

## 4. Explicit Exclusions — Do NOT Generate

- Data mutation
- New tables
- Multiple report groups in one response

---

## 5. Stop Condition

**STOP** after requested group. Next: `03_inventory_report.md`.

---

## 6. Coding Standards

`PurchaseReportService`, read-only transactions, paginated DTOs, `ApiResponse<T>`. Per `AGENTS.md`.

---

## 7. Definition of Done

- [ ] Supplier filter supported
- [ ] Date range required on summaries
- [ ] Soft-deleted purchases excluded

---

*Prompt REPORT-02 — Approved for production use*
