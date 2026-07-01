# Attribute Value — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | PRODUCT-05 |
| **Module** | Product Master / Attribute Engine |
| **Table** | `attribute_values` |
| **Primary Key** | BIGINT Identity |
| **Flyway Migration** | `V3__product.sql` |
| **Backend Package** | `com.mobileshoperp.modules.product` |
| **Depends On** | PRODUCT-04 (Attribute) |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Attribute Engine
2. `docs/02_Business_Rules.md` — BR-023, BR-025
3. `docs/05_Data_Dictionary.md` — `attribute_values`
4. `tasks/phase-02-product.md`

---

## 2. Objective

Implement **AttributeValue** — concrete values (Black, 8GB, 128GB) under each Attribute.

---

## 3. Scope — What to Generate

One layer only for AttributeValue vertical slice.

---

## 4. Explicit Exclusions — Do NOT Generate

- VariantAttribute junction (prompt 08)
- Duplicate values under same attribute (enforce in service — BR-025)
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Next: `06_product.md`.

---

## 6. Database Contract

```text
attribute_values
├── id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
├── attribute_id BIGINT FK → attributes.id (indexed)
├── value        VARCHAR(100) NOT NULL
├── display_order INTEGER DEFAULT 0
└── is_active    BOOLEAN DEFAULT TRUE
```

Unique constraint: `(attribute_id, value)` recommended.

---

## 7. Business Rules

- BR-023: Value belongs to one attribute
- BR-025: No duplicate values per attribute
- BR-026: Variants reference values — never free text

---

## 8. Coding Standards

Per `AGENTS.md`.

---

## 9. Definition of Done

- [ ] Duplicate value rejected per attribute
- [ ] List ordered by display_order

---

*Prompt PRODUCT-05 — Approved for production use*
