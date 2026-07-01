# Variant Attribute — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | PRODUCT-08 |
| **Module** | Product Master / Attribute Engine |
| **Table** | `product_variant_attributes` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V3__product.sql` |
| **Backend Package** | `com.mobileshoperp.modules.product` |
| **Depends On** | PRODUCT-07 (Variant), PRODUCT-05 (AttributeValue) |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Attribute Engine
2. `docs/02_Business_Rules.md` — BR-024, BR-026
3. `docs/04_ER_Diagram.md` — Variant ↔ Attribute Values junction
4. `docs/05_Data_Dictionary.md` — `product_variant_attributes`
5. `tasks/phase-02-product.md`

---

## 2. Objective

Implement the **junction** linking ProductVariant to AttributeValue. This materializes variant specifications (Color=Black, RAM=8GB).

---

## 3. Scope — What to Generate

One layer only. Include bulk assign/replace attributes for a variant in service layer (controller layer).

---

## 4. Explicit Exclusions — Do NOT Generate

- Storing attribute values as strings on variant table
- Duplicate attribute assignment for same attribute group on one variant
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Next: `09_price.md`.

---

## 6. Database Contract

```text
product_variant_attributes
├── id                 UUID PRIMARY KEY
├── variant_id         UUID FK → product_variants.id (indexed)
├── attribute_value_id BIGINT FK → attribute_values.id (indexed)
└── audit cols         (per business table standard)
```

Unique: `(variant_id, attribute_value_id)`. Business rule: one value per attribute per variant.

---

## 7. Business Rules

- BR-024: Variant may have multiple attribute values
- BR-026: Must reference attribute_values — never free text
- Prevent two values from the same attribute on one variant

---

## 8. Coding Standards

Per `AGENTS.md`. Return composed variant detail DTO with resolved attribute labels.

---

## 9. Definition of Done

- [ ] Junction CRUD or replace-set API
- [ ] Same-attribute conflict prevented
- [ ] Attribute values validated as active

---

*Prompt PRODUCT-08 — Approved for production use*
