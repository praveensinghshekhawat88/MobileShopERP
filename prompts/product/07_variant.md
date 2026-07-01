# Product Variant — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | PRODUCT-07 |
| **Module** | Product Master |
| **Table** | `product_variants` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V3__product.sql` |
| **Backend Package** | `com.mobileshoperp.modules.product` |
| **Depends On** | PRODUCT-06 (Product) |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Product Structure, Product Image Rule
2. `docs/02_Business_Rules.md` — BR-012, BR-016, BR-017, BR-018
3. `docs/05_Data_Dictionary.md` — `product_variants`
4. `tasks/phase-02-product.md`

---

## 2. Objective

Implement **ProductVariant** — the **sellable SKU** (e.g., Black / 8GB / 128GB). Variant is the anchor for prices, images, purchase items, and stock.

---

## 3. Scope — What to Generate

One layer only for ProductVariant vertical slice.

---

## 4. Explicit Exclusions — Do NOT Generate

- VariantAttribute, Price, Images (prompts 08–10)
- Free-text RAM/Color/Storage columns on variant
- Stock or purchase logic
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Next: `08_variant_attribute.md`.

---

## 6. Database Contract

```text
product_variants
├── id         UUID PRIMARY KEY
├── product_id UUID FK → products.id (indexed)
├── sku        VARCHAR(100) NOT NULL UNIQUE
├── barcode    VARCHAR(100) UNIQUE (nullable)
├── is_active  BOOLEAN DEFAULT TRUE
└── audit cols created_at, updated_at, created_by, updated_by, deleted_at
```

---

## 7. Business Rules

- BR-012: Variant belongs to exactly one product
- BR-016/017: SKU required and unique
- BR-018: Barcode unique when provided

---

## 8. Coding Standards

Per `AGENTS.md`.

---

## 9. Definition of Done

- [ ] SKU uniqueness enforced
- [ ] Parent product must be active
- [ ] List variants by product_id supported

---

*Prompt PRODUCT-07 — Approved for production use*
