# Profit Report — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | REPORT-04 |
| **Module** | Reports (read-only) |
| **Tables** | `sales`, `sale_items`, `purchase_items`, `stock`, `expenses` (read only) |
| **Flyway Migration** | `V9__reports.sql` (read-only) |
| **Backend Package** | `com.mobileshoperp.modules.report` |
| **Depends On** | Sales, Purchase, Expense data available |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `docs/01_Project_Requirement.md` — Profit Report
2. `docs/02_Business_Rules.md` — BR-085, BR-086
3. `tasks/phase-08-reports.md`

---

## 2. Objective

Read-only **profit report**: revenue (sales) − COGS (purchase cost via stock/sale_items) − expenses for a date range.

---

## 3. Scope — What to Generate

`GET /api/v1/reports/profit/summary?fromDate=&toDate=`

Response DTO: totalRevenue, totalCogs, totalExpenses, grossProfit, netProfit.

---

## 4. Explicit Exclusions — Do NOT Generate

- Writable endpoints
- Cached/materialized tables without approval
- Incorrect COGS (must trace sale_item → stock → purchase_item cost)
- Multiple reports in one response

---

## 5. Stop Condition

**STOP** after profit report complete. Next: `05_customer_report.md`.

---

## 6. Calculation Contract

```text
Revenue     = SUM(sale_items.selling_price - discount + tax) in range
COGS        = SUM linked purchase_item.purchase_price) for sold stock in range
Expenses    = SUM(expenses.amount) in range
Gross Profit = Revenue - COGS
Net Profit   = Gross Profit - Expenses
```

---

## 7. Coding Standards

Single optimized query or staged aggregation — avoid N+1. `@Transactional(readOnly = true)`.

---

## 8. Definition of Done

- [ ] COGS correctly linked through stock chain
- [ ] Date range mandatory
- [ ] Documented calculation in JavaDoc

---

*Prompt REPORT-04 — Approved for production use*
