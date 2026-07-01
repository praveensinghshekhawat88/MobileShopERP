# Attribute — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | PRODUCT-04 |
| **Module** | Product Master / Attribute Engine |
| **Table** | `attributes` |
| **Primary Key** | BIGINT Identity |
| **Flyway Migration** | `V3__product.sql` |
| **Backend Package** | `com.mobileshoperp.modules.product` |
| **Depends On** | PRODUCT-03 (AttributeGroup) |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Attribute Types (VARIANT, SPECIFICATION, FILTER)
2. `docs/02_Business_Rules.md` — BR-022
3. `docs/05_Data_Dictionary.md` — `attributes`
4. `tasks/phase-02-product.md`

---

## 2. Objective

Implement **Attribute** linked to AttributeGroup with typed classification.

| Type | Examples |
|------|----------|
| VARIANT | Color, RAM, Storage |
| SPECIFICATION | Battery, Display, Processor |
| FILTER | Future search filters |

---

## 3. Scope — What to Generate

One layer only for Attribute vertical slice.

---

## 4. Explicit Exclusions — Do NOT Generate

- AttributeValue (next prompt)
- Enum-as-column for Color/RAM on variant table
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Next: `05_attribute_value.md`.

---

## 6. Database Contract

```text
attributes
├── id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
├── attribute_group_id BIGINT FK → attribute_groups.id (indexed)
├── name               VARCHAR(100) NOT NULL
└── attribute_type     VARCHAR(30) NOT NULL  -- VARIANT | SPECIFICATION | FILTER
```

---

## 7. Business Rules

- BR-022: Attribute belongs to exactly one group
- Validate `attribute_type` against allowed enum values

---

## 8. Coding Standards

Use Java enum `AttributeType` in `common` package mapped to VARCHAR in DB. Per `AGENTS.md`.

---

## 9. Definition of Done

- [ ] FK to attribute_groups validated
- [ ] attribute_type constrained in entity and DB CHECK if migration allows

---

*Prompt PRODUCT-04 — Approved for production use*
