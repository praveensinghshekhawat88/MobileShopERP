# Warranty Report — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | REPORT-09 |
| **Module** | Reports (read-only) |
| **Tables** | `warranty`, `sale_items`, `sales`, `customers` (read only) |
| **Flyway Migration** | `V9__reports.sql` (read-only) |
| **Backend Package** | `com.mobileshoperp.modules.report` |
| **Depends On** | Service module (Phase 7 — warranty entity via `sale_item_id`) |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `docs/01_Project_Requirement.md` — Warranty Management, Reports
2. `docs/02_Business_Rules.md` — BR-085, BR-086
3. `docs/05_Data_Dictionary.md` — `warranty` (`sale_item_id` FK)
4. `tasks/phase-07-service.md`
5. `tasks/phase-08-reports.md` — P08-T013

---

## 2. Objective

Read-only warranty reports: active warranties, expiring-soon list, warranty lookup by customer or sale.

---

## 3. Scope — What to Generate

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/reports/warranty/summary` | Counts: active, expired, expiring within N days |
| `GET /api/v1/reports/warranty` | Paginated list with filters (status, customer, date range) |

Warranty joins **must** trace through `sale_item_id` → `sale_items` → `sales` → `customers`. Do not join warranty to `stock_id` as primary link.

---

## 4. Explicit Exclusions — Do NOT Generate

- Warranty CRUD (service module — Phase 7)
- Primary FK to `stock_id` on warranty queries
- Writable endpoints
- Multiple report groups in one response

---

## 5. Stop Condition

**STOP** after warranty reports complete. Report module complete.

---

## 6. Business Rules

- BR-085: Read-only
- BR-086: Date filters where applicable
- BR-087: Pagination on list reports
- Warranty authority: `sale_item_id` (locked)

---

## 7. Definition of Done

- [ ] Joins use `sale_item_id` chain only
- [ ] Expiry calculation matches service module rules
- [ ] No mutation endpoints
- [ ] Swagger documented

---

*Prompt REPORT-09 — Approved for production use*
