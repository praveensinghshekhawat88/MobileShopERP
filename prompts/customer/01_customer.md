# Customer — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | CUSTOMER-01 |
| **Module** | Business |
| **Table** | `customers` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V4__business.sql` |
| **Backend Package** | `com.mobileshoperp.modules.business` |
| **Depends On** | Product module complete |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md`
2. `docs/02_Business_Rules.md` — BR-048 through BR-050
3. `docs/05_Data_Dictionary.md` — `customers`
4. `tasks/phase-03-business.md`

---

## 2. Objective

Implement **Customer** master data for sales, repairs, and reporting.

---

## 3. Scope — What to Generate

One layer only for Customer vertical slice.

---

## 4. Explicit Exclusions — Do NOT Generate

- Supplier (separate prompt)
- Sales or payment logic
- Physical delete endpoints
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Next: `supplier/01_supplier.md`.

---

## 6. Database Contract

```text
customers
├── id         UUID PRIMARY KEY
├── name       VARCHAR(200) NOT NULL
├── mobile     VARCHAR(15) NOT NULL UNIQUE
├── email      VARCHAR(150)
├── address    TEXT
├── gst_number VARCHAR(20)
└── audit cols created_at, updated_at, created_by, updated_by, deleted_at
```

---

## 7. Business Rules

- BR-048: Unique mobile
- BR-049: Soft delete only
- BR-050: Purchase history must remain after soft delete

---

## 8. Coding Standards

Per `AGENTS.md`. Search by mobile supported. Pagination on list.

---

## 9. Definition of Done

- [ ] Mobile uniqueness enforced
- [ ] Soft delete preserves historical sales linkage
- [ ] GST validation when provided

---

*Prompt CUSTOMER-01 — Approved for production use*
