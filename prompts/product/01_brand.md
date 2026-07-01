# Brand — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | PRODUCT-01 |
| **Module** | Product Master |
| **Table** | `brands` |
| **Primary Key** | BIGINT Identity |
| **Flyway Migration** | `V3__product.sql` |
| **Backend Package** | `com.mobileshoperp.modules.product` |
| **Depends On** | Phase 0 foundation + Auth module complete |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Product Structure, Database Rules
2. `docs/02_Business_Rules.md` — BR-009, BR-013
3. `docs/04_ER_Diagram.md` — Brands → Products
4. `docs/05_Data_Dictionary.md` — `brands`
5. `tasks/phase-02-product.md`

---

## 2. Objective

Implement **Brand** master data — the top of the product hierarchy (Brand → Category → Product → Variant).

---

## 3. Scope — What to Generate

One layer only: Entity → Repository → DTO → Mapper → Service → Controller → Exception → Unit Test.

---

## 4. Explicit Exclusions — Do NOT Generate

- Category, Product, Variant, or any other product submodule
- Product images (images belong to **variants only** — never products)
- `sub_categories` table (forbidden — use self-referencing categories)
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after the requested layer. When Brand is complete, open `02_category.md`.

---

## 6. Database Contract

```text
brands
├── id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
├── name        VARCHAR(100) NOT NULL UNIQUE
├── description TEXT
└── is_active   BOOLEAN DEFAULT TRUE
```

---

## 7. Business Rules

- BR-009: Every product belongs to exactly one brand
- Brand name must be unique
- Master table — deactivate via `is_active`, no physical delete

---

## 8. Coding Standards

Per `AGENTS.md`: layered architecture, records, MapStruct, `ApiResponse<T>`, constructor injection, Swagger, service unit tests.

---

## 9. Definition of Done

- [ ] Matches data dictionary
- [ ] CRUD with pagination on list endpoint
- [ ] Inactive brands excluded from new product assignment (service validation)

---

*Prompt PRODUCT-01 — Approved for production use*
