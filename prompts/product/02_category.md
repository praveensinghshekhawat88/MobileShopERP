# Category — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | PRODUCT-02 |
| **Module** | Product Master |
| **Table** | `categories` (self-referencing) |
| **Primary Key** | BIGINT Identity |
| **Flyway Migration** | `V3__product.sql` |
| **Backend Package** | `com.mobileshoperp.modules.product` |
| **Depends On** | PRODUCT-01 (Brand) |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Category Rule (no sub_categories)
2. `PROJECT_CONTEXT.md` — Category Strategy
3. `docs/03_Database_Design.md` — Category Strategy (self-referencing)
4. `docs/05_Data_Dictionary.md` — `categories`
5. `tasks/phase-02-product.md`

---

## 2. Objective

Implement **Category** with unlimited hierarchy via `parent_id` self-reference.

Example: Electronics → Mobiles → Android Phones → Samsung

---

## 3. Scope — What to Generate

One layer only per invocation for Category vertical slice.

Additional service logic: prevent circular parent references; tree/list API for hierarchy navigation.

---

## 4. Explicit Exclusions — Do NOT Generate

- **`sub_categories` table** — explicitly forbidden by architecture
- Product, Variant, Attribute entities
- Free-text category paths stored on products
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. When complete, open `03_attribute_group.md`.

---

## 6. Database Contract

```text
categories
├── id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
├── parent_id   BIGINT FK → categories.id (nullable, indexed)
├── name        VARCHAR(100) NOT NULL
├── description TEXT
└── is_active   BOOLEAN DEFAULT TRUE
```

---

## 7. Business Rules

- BR-010: Every product belongs to exactly one category
- Self-referencing hierarchy — unlimited depth
- Prevent category from being its own ancestor

---

## 8. Coding Standards

Per `AGENTS.md`. Expose tree or flat list with `parentId` in DTO — never expose entity graph directly.

---

## 9. Definition of Done

- [ ] Self-reference FK indexed
- [ ] Circular reference prevented in service layer
- [ ] Hierarchy query performant (avoid N+1)

---

*Prompt PRODUCT-02 — Approved for production use*
