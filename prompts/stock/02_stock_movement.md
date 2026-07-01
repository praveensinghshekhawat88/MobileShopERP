# Stock Movement — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | STOCK-02 |
| **Module** | Inventory |
| **Table** | `stock_movements` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V6__inventory.sql` |
| **Backend Package** | `com.mobileshoperp.modules.inventory` |
| **Depends On** | STOCK-01 |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Stock Movement Rule
2. `docs/02_Business_Rules.md` — BR-046
3. `docs/03_Database_Design.md` — Stock Movement Strategy
4. `docs/05_Data_Dictionary.md` — `stock_movements`
5. `tasks/phase-05-inventory.md`

---

## 2. Objective

Implement **StockMovement** audit trail — every inventory change must create a movement record.

Movement types: PURCHASE, SALE, RETURN, REPAIR, ADJUSTMENT. (TRANSFER = Phase 2)

---

## 3. Scope — What to Generate

One layer only. Movements are **created by domain services** (purchase, sales, repair) — not manually invented without reference.

Read API for movement history by stock_id or date range.

---

## 4. Explicit Exclusions — Do NOT Generate

- Stock changes without corresponding movement (forbidden)
- Warehouse transfer (Phase 2)
- Direct movement DELETE
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Next: `03_stock_status_lifecycle.md`.

---

## 6. Database Contract

```text
stock_movements
├── id             UUID PRIMARY KEY
├── stock_id       UUID FK → stock.id (indexed)
├── reference_type VARCHAR(30) NOT NULL   -- PURCHASE | SALE | RETURN | REPAIR | ADJUSTMENT
├── reference_id   UUID NOT NULL (indexed)
├── movement_type  VARCHAR(30) NOT NULL
├── remarks        TEXT
└── audit cols
```

Index: `(reference_id, reference_type)` per AGENTS.md.

---

## 7. Business Rules

- BR-046: Every stock change creates movement
- Movements are append-only history
- BR-085: Reports read movements — never mutate

---

## 8. Coding Standards

Provide `StockMovementService.recordMovement(...)` for other modules to call. Per `AGENTS.md`.

---

## 9. Definition of Done

- [ ] No stock mutation path bypasses movement recording
- [ ] History query paginated
- [ ] Reference linkage validated

---

*Prompt STOCK-02 — Approved for production use*
