# Stock Status Lifecycle — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | STOCK-03 |
| **Module** | Inventory |
| **Table** | `stock` (status transitions) |
| **Flyway Migration** | `V6__inventory.sql` |
| **Backend Package** | `com.mobileshoperp.modules.inventory` |
| **Depends On** | STOCK-01, STOCK-02 |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Stock Movement Rule
2. `docs/02_Business_Rules.md` — BR-045, BR-054, BR-055, BR-056
3. `PROJECT_CONTEXT.md` — Stock Lifecycle
4. `tasks/phase-05-inventory.md`

---

## 2. Objective

Implement **validated stock status transitions** and adjustment API with mandatory movement records.

Allowed lifecycle: AVAILABLE → RESERVED → SOLD → REPAIR → RETURNED → DAMAGED / LOST

---

## 3. Scope — What to Generate

**Service layer only** when invoked:

| Component | Output |
|-----------|--------|
| `StockStatusService` | `updateStatus(stockId, newStatus, reason)` with transition validation |
| DTO | `StockStatusUpdateRequest` |
| Exception | `InvalidStockTransitionException`, `StockNotAvailableException` |

---

## 4. Explicit Exclusions — Do NOT Generate

- Direct status change without movement record
- Sale-driven SOLD transition (owned by sales module — call StockStatusService)
- Warehouse transfer
- Multiple components in one response

---

## 5. Stop Condition

**STOP** after requested component. Stock module complete — proceed to `sales/01_sale.md`.

---

## 6. Transition Rules

| From | Allowed To |
|------|------------|
| AVAILABLE | RESERVED, SOLD, DAMAGED, LOST |
| RESERVED | AVAILABLE, SOLD |
| SOLD | RETURNED, REPAIR |
| REPAIR | AVAILABLE, DAMAGED |
| RETURNED | AVAILABLE, DAMAGED |
| DAMAGED | (terminal — adjustment only with approval) |
| LOST | (terminal) |

BR-054: Cannot sell unless AVAILABLE (or RESERVED per policy — document choice in service).

---

## 7. Business Rules

- BR-045: Enforce valid statuses
- BR-046: Record movement on every change
- BR-055: Sale marks SOLD (via sales workflow)
- BR-056: Cancel sale restores stock

---

## 8. Coding Standards

State machine logic in service — not in controller or entity. Per `AGENTS.md`.

---

## 9. Definition of Done

- [ ] Invalid transitions rejected with clear error code
- [ ] Movement recorded for manual adjustments
- [ ] Unit tests cover all valid/invalid paths

---

*Prompt STOCK-03 — Approved for production use*
