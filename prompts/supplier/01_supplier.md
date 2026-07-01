# Supplier — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | SUPPLIER-01 |
| **Module** | Business |
| **Table** | `suppliers` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V4__business.sql` |
| **Backend Package** | `com.mobileshoperp.modules.business` |
| **Depends On** | CUSTOMER-01 (same migration, order flexible) |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md`
2. `docs/02_Business_Rules.md` — BR-032 through BR-034
3. `docs/05_Data_Dictionary.md` — `suppliers`
4. `tasks/phase-03-business.md`

---

## 2. Objective

Implement **Supplier** master data for purchase module.

---

## 3. Scope — What to Generate

One layer only for Supplier vertical slice.

---

## 4. Explicit Exclusions — Do NOT Generate

- Purchase header/items
- Customer CRUD
- Physical delete
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Next: `purchase/01_purchase.md`.

---

## 6. Database Contract

```text
suppliers
├── id             UUID PRIMARY KEY
├── supplier_name  VARCHAR(200) NOT NULL
├── contact_person VARCHAR(150)
├── mobile         VARCHAR(15) NOT NULL UNIQUE
├── email          VARCHAR(150)
├── gst_number     VARCHAR(20)
├── address        TEXT
└── audit cols
```

---

## 7. Business Rules

- BR-032: Unique mobile
- BR-033: Soft delete only
- BR-034: Inactive suppliers blocked from new purchases

---

## 8. Coding Standards

Per `AGENTS.md`.

---

## 9. Definition of Done

- [ ] Inactive supplier cannot be used in new purchase (service hook for future purchase module)
- [ ] Soft delete implemented

---

*Prompt SUPPLIER-01 — Approved for production use*
