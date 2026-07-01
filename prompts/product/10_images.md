# Variant Images — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | PRODUCT-10 |
| **Module** | Product Master |
| **Table** | `product_images` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V3__product.sql` |
| **Backend Package** | `com.mobileshoperp.modules.product` |
| **Depends On** | PRODUCT-07 (Variant) |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — **Product Image Rule** (images belong to Variant, NEVER Product)
2. `docs/02_Business_Rules.md` — BR-020
3. `docs/04_ER_Diagram.md` — Product Variants → Product Images (1:N)
4. `docs/05_Data_Dictionary.md` — `product_images`
5. `tasks/phase-02-product.md`

---

## 2. Objective

Implement **ProductImage** linked exclusively to **ProductVariant**.

Example: Samsung S25 → Black variant → Black image URL.

---

## 3. Scope — What to Generate

One layer only for variant image vertical slice.

File upload: store **file path/URL only** — never binary in database (AGENTS.md File Upload Rules).

Supported formats: jpg, jpeg, png, webp.

---

## 4. Explicit Exclusions — Do NOT Generate

- **`product_id` FK on product_images** — forbidden
- Image endpoints on Product controller
- Image bytes in database
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Product module complete — proceed to `customer/01_customer.md`.

---

## 6. Database Contract

```text
product_images
├── id            UUID PRIMARY KEY
├── variant_id    UUID FK → product_variants.id (indexed)  ← REQUIRED
├── image_url     TEXT NOT NULL
├── display_order INTEGER DEFAULT 0
└── audit cols
```

**Architecture decision (locked):** Images must never belong directly to Product.

---

## 7. Business Rules

- BR-020: Variant images belong to variant, not product
- Order images by display_order
- Validate variant exists and is active

---

## 8. Coding Standards

Per `AGENTS.md`. API under `/api/v1/variants/{variantId}/images` or equivalent RESTful design.

---

## 9. Definition of Done

- [ ] FK is `variant_id` only — no `product_id`
- [ ] CRUD scoped to variant
- [ ] URL/path storage only

---

*Prompt PRODUCT-10 — Approved for production use*
