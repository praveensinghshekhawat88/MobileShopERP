# Product — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | PRODUCT-06 |
| **Module** | Product Master |
| **Table** | `products` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V3__product.sql` |
| **Backend Package** | `com.mobileshoperp.modules.product` |
| **Depends On** | PRODUCT-01 (Brand), PRODUCT-02 (Category) |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Product Structure
2. `docs/02_Business_Rules.md` — BR-009, BR-010, BR-011, BR-013, BR-014, BR-015
3. `docs/05_Data_Dictionary.md` — `products`
4. `tasks/phase-02-product.md`

---

## 2. Objective

Implement **Product** — represents a **model** (e.g., Samsung Galaxy S25), not a sellable SKU.

---

## 3. Scope — What to Generate

One layer only for Product vertical slice.

---

## 4. Explicit Exclusions — Do NOT Generate

- ProductVariant (prompt 07)
- **Product images** — images belong to variants only, never products
- Price or stock on product entity
- Serialized IMEI fields on product (IMEI lives on stock)
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Next: `07_variant.md`.

---

## 6. Database Contract

```text
products
├── id           UUID PRIMARY KEY
├── brand_id     BIGINT FK → brands.id (indexed)
├── category_id  BIGINT FK → categories.id (indexed)
├── name         VARCHAR(200) NOT NULL
├── model        VARCHAR(150)
├── hsn_code     VARCHAR(20)
├── description  TEXT
├── is_active    BOOLEAN DEFAULT TRUE
└── audit cols   created_at, updated_at, created_by, updated_by, deleted_at
```

---

## 7. Business Rules

- BR-013: Name unique within same brand
- BR-014: Deleted/inactive products cannot be sold
- BR-015: Soft delete only
- Product has many variants (BR-011) — do not implement variant here

---

## 8. Coding Standards

Per `AGENTS.md`. UUID generation strategy per project standard (pgcrypto / JPA GeneratedValue).

---

## 9. Definition of Done

- [ ] Brand and category FKs validated and active
- [ ] Soft delete implemented
- [ ] No image endpoints on product

---

*Prompt PRODUCT-06 — Approved for production use*
