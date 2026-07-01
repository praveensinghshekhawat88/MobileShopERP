# Purchase Item — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | PURCHASE-02 |
| **Module** | Purchase |
| **Table** | `purchase_items` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V5__purchase.sql` |
| **Backend Package** | `com.mobileshoperp.modules.purchase` |
| **Depends On** | PURCHASE-01, Product Variant |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Stock Rule
2. `docs/02_Business_Rules.md` — BR-036, BR-040, BR-044
3. `docs/05_Data_Dictionary.md` — `purchase_items`
4. `tasks/phase-04-purchase.md`

---

## 2. Objective

Implement **PurchaseItem** line entries linking purchase to product variant with quantity and cost.

---

## 3. Scope — What to Generate

One layer only for PurchaseItem vertical slice.

Recalculate purchase header totals when items change.

---

## 4. Explicit Exclusions — Do NOT Generate

- Stock records (PURCHASE-03)
- IMEI capture at item level (IMEI on stock records)
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Next: `03_purchase_receive_stock.md`.

---

## 6. Database Contract

```text
purchase_items
├── id             UUID PRIMARY KEY
├── purchase_id    UUID FK → purchases.id (indexed)
├── variant_id     UUID FK → product_variants.id (indexed)
├── quantity       INTEGER NOT NULL CHECK (quantity > 0)
├── purchase_price DECIMAL(12,2) NOT NULL
├── tax_amount     DECIMAL(12,2) DEFAULT 0
├── total_amount   DECIMAL(12,2) NOT NULL
└── audit cols
```

---

## 7. Business Rules

- BR-036: Purchase has many items
- BR-040: Header total = sum of items
- BR-044: Each item will create stock on receive (not here)
- BR-080: Quantity > 0
- BR-079: Prices positive

---

## 8. Coding Standards

Per `AGENTS.md`.

---

## 9. Definition of Done

- [ ] Variant validated active
- [ ] Line total = quantity × price + tax
- [ ] Parent purchase totals updated atomically

---

*Prompt PURCHASE-02 — Approved for production use*
