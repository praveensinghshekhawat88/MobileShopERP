# Sale Item — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | SALES-02 |
| **Module** | Sales |
| **Table** | `sale_items` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V7__sales.sql` |
| **Backend Package** | `com.mobileshoperp.modules.sales` |
| **Depends On** | SALES-01, STOCK-01 |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md`
2. `docs/02_Business_Rules.md` — BR-052, BR-054, BR-057
3. `docs/04_ER_Diagram.md` — Stock → Sale Items (1:1)
4. `docs/05_Data_Dictionary.md` — `sale_items`
5. `tasks/phase-06-sales.md`

---

## 2. Objective

Implement **SaleItem** linking sale to specific **stock** unit with pricing, discount, and tax.

One stock row → at most one active sale item (1:1 for serialized mobiles).

---

## 3. Scope — What to Generate

One layer only for SaleItem vertical slice.

Validate stock is AVAILABLE before adding to sale (BR-054).

---

## 4. Explicit Exclusions — Do NOT Generate

- Marking stock SOLD (SALES-03 workflow)
- Payment creation
- Selling same stock twice
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Next: `03_sale_completion_workflow.md`.

---

## 6. Database Contract

```text
sale_items
├── id            UUID PRIMARY KEY
├── sale_id       UUID FK → sales.id (indexed)
├── stock_id      UUID FK → stock.id (indexed, UNIQUE for active sales)
├── selling_price DECIMAL(12,2) NOT NULL
├── discount      DECIMAL(12,2) DEFAULT 0
├── tax_amount    DECIMAL(12,2) DEFAULT 0
└── audit cols
```

---

## 7. Business Rules

- BR-052: Sale has many items
- BR-054: Stock must be available
- BR-057: Line amounts roll up to sale total
- BR-079: Prices positive

---

## 8. Coding Standards

Per `AGENTS.md`. Resolve retail price from product_prices when not overridden.

---

## 9. Definition of Done

- [ ] Duplicate stock_id on open sale prevented
- [ ] Availability check delegated to StockStatusService
- [ ] Sale totals recalculated atomically

---

*Prompt SALES-02 — Approved for production use*
