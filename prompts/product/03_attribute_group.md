# Attribute Group — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | PRODUCT-03 |
| **Module** | Product Master / Attribute Engine |
| **Table** | `attribute_groups` |
| **Primary Key** | BIGINT Identity |
| **Flyway Migration** | `V3__product.sql` |
| **Backend Package** | `com.mobileshoperp.modules.product` |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Attribute Engine, Attribute Types
2. `docs/02_Business_Rules.md` — BR-021
3. `docs/03_Database_Design.md` — Attribute Engine
4. `docs/05_Data_Dictionary.md` — `attribute_groups`
5. `tasks/phase-02-product.md`

---

## 2. Objective

Implement **AttributeGroup** — top level of the dynamic attribute engine (Color, RAM, Storage, Processor).

---

## 3. Scope — What to Generate

One layer only: full vertical slice for AttributeGroup CRUD.

---

## 4. Explicit Exclusions — Do NOT Generate

- Attribute, AttributeValue, VariantAttribute (subsequent prompts)
- Hardcoded attribute columns on product or variant tables
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Next: `04_attribute.md`.

---

## 6. Database Contract

```text
attribute_groups
├── id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
└── name  VARCHAR(100) NOT NULL UNIQUE
```

Examples: Color, RAM, Storage, Processor

---

## 7. Business Rules

- BR-021: Groups define categories of attributes
- No free-text specifications on variants — all via attribute engine

---

## 8. Coding Standards

Per `AGENTS.md`.

---

## 9. Definition of Done

- [ ] CRUD complete with validation
- [ ] Name uniqueness enforced

---

*Prompt PRODUCT-03 — Approved for production use*
