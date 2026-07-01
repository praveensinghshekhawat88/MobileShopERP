# Stock — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | STOCK-01 |
| **Module** | Inventory |
| **Table** | `stock` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V6__inventory.sql` |
| **Backend Package** | `com.mobileshoperp.modules.inventory` |
| **Depends On** | Purchase receive workflow defined |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Stock Rule, Warehouse Rule (Phase 2 — no warehouse)
2. `docs/02_Business_Rules.md` — BR-041 through BR-047
3. `docs/05_Data_Dictionary.md` — `stock`
4. `tasks/phase-05-inventory.md`

---

## 2. Objective

Implement **Stock** entity and API for querying/updating inventory units with IMEI tracking.

---

## 3. Scope — What to Generate

One layer only for Stock vertical slice.

---

## 4. Explicit Exclusions — Do NOT Generate

- **Warehouse module** (Phase 2 — single shop only)
- `warehouses` table
- Stock creation outside purchase receive (use PURCHASE-03)
- Sale deduction logic (sales module)
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Next: `02_stock_movement.md`.

---

## 6. Database Contract

```text
stock
├── id               UUID PRIMARY KEY
├── purchase_item_id UUID FK → purchase_items.id (indexed)
├── variant_id       UUID FK → product_variants.id (indexed)
├── imei             VARCHAR(30) UNIQUE (nullable for accessories)
├── serial_number    VARCHAR(100)
├── stock_status     VARCHAR(30) NOT NULL
└── audit cols
```

Status enum: AVAILABLE, RESERVED, SOLD, RETURNED, REPAIR, DAMAGED, LOST

---

## 7. Business Rules

- BR-041/042: Unique IMEI for mobiles
- BR-043: Accessories — IMEI null allowed
- BR-047: Quantity cannot go negative (each mobile = one row)
- Every stock must have purchase_item_id origin

---

## 8. Coding Standards

Per `AGENTS.md`. Composite index on `(variant_id, stock_status)` for availability queries.

---

## 9. Definition of Done

- [ ] IMEI uniqueness enforced for serialized items
- [ ] Availability query by variant + status
- [ ] No warehouse_id column (Phase 1)

---

*Prompt STOCK-01 — Approved for production use*
