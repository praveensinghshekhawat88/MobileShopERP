# Inventory Report — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | REPORT-03 |
| **Module** | Reports (read-only) |
| **Tables** | `stock`, `stock_movements`, `product_variants` (read only) |
| **Flyway Migration** | `V9__reports.sql` (read-only) |
| **Backend Package** | `com.mobileshoperp.modules.report` |
| **Depends On** | Stock module complete |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `docs/01_Project_Requirement.md` — Stock Report
2. `docs/02_Business_Rules.md` — BR-085 through BR-087
3. `tasks/phase-08-reports.md`

---

## 2. Objective

Read-only inventory reports: current stock by variant/status, movement history, low-stock alerts (available count threshold).

---

## 3. Scope — What to Generate

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/reports/stock/current` | Stock snapshot by variant/status |
| `GET /api/v1/reports/stock/movements` | Movement history with filters |
| `GET /api/v1/reports/stock/low` | Variants below threshold |

---

## 4. Explicit Exclusions — Do NOT Generate

- Stock mutation
- Warehouse breakdown (Phase 2)
- Multiple groups in one response

---

## 5. Stop Condition

**STOP** after requested group. Next: `04_profit_report.md`.

---

## 6. Coding Standards

Per `AGENTS.md`. Index-friendly queries on `variant_id`, `stock_status`.

---

## 7. Definition of Done

- [ ] IMEI searchable in detail view
- [ ] Movement report paginated
- [ ] Read-only verified

---

*Prompt REPORT-03 — Approved for production use*
