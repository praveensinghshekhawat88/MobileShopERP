# Product Price — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | PRODUCT-09 |
| **Module** | Product Master |
| **Table** | `product_prices` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V3__product.sql` |
| **Backend Package** | `com.mobileshoperp.modules.product` |
| **Depends On** | PRODUCT-07 (Variant) |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Product Price Rule
2. `docs/02_Business_Rules.md` — BR-027 through BR-031
3. `docs/03_Database_Design.md` — Price Strategy
4. `docs/05_Data_Dictionary.md` — `product_prices`
5. `tasks/phase-02-product.md`

---

## 2. Objective

Implement **ProductPrice** with append-only price history. Prices belong to **variants**, not products.

Supported types: MRP, Retail, Wholesale, Dealer, Offer.

---

## 3. Scope — What to Generate

One layer only. Service must **create new price record** on change — never overwrite history (BR-031).

---

## 4. Explicit Exclusions — Do NOT Generate

- Updating/deleting historical price rows
- More than one active Retail price per variant (BR-029)
- Price on product entity
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Next: `10_images.md`.

---

## 6. Database Contract

```text
product_prices
├── id             UUID PRIMARY KEY
├── variant_id     UUID FK → product_variants.id (indexed)
├── price_type     VARCHAR(30) NOT NULL
├── price          DECIMAL(12,2) NOT NULL
├── effective_from DATE NOT NULL
├── effective_to   DATE
├── is_active      BOOLEAN DEFAULT TRUE
└── audit cols
```

Index: `(variant_id, is_active)` per AGENTS.md.

---

## 7. Business Rules

- BR-027: Multiple prices per variant
- BR-029: Only one active Retail price per variant
- BR-030/031: History preserved; changes create new records
- BR-079: Prices must be positive

---

## 8. Coding Standards

Use `PriceType` enum in common package. Per `AGENTS.md`.

---

## 9. Definition of Done

- [ ] Price history query by variant
- [ ] Active retail price resolution logic
- [ ] No in-place price overwrites

---

*Prompt PRODUCT-09 — Approved for production use*
