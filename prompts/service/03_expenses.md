# Expenses — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | SERVICE-03 |
| **Module** | Service / Utility |
| **Table** | `expenses` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V8__service.sql` |
| **Backend Package** | `com.mobileshoperp.modules.utility` |
| **Depends On** | Phase 1 Auth complete |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Expense Rule (no expense_categories in Phase 1)
2. `docs/05_Data_Dictionary.md` — `expenses`
3. `tasks/phase-07-service.md`

---

## 2. Objective

Implement **Expense** CRUD for daily/monthly shop expenses. Generic payments reference EXPENSE via `payments.reference_type`.

---

## 3. Scope — What to Generate

One layer only per invocation for Expense vertical slice.

---

## 4. Explicit Exclusions — Do NOT Generate

- `expense_categories` table (Phase 10 future)
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Next: `04_audit_logs.md`.

---

## 6. Database Contract

```text
expenses
├── id           UUID PRIMARY KEY
├── title        VARCHAR(200) NOT NULL
├── amount       DECIMAL(12,2) NOT NULL
├── expense_date DATE NOT NULL
├── remarks      TEXT
└── audit cols
```

---

## 7. Coding Standards

Per `AGENTS.md`. Soft delete only. Amount must be positive (BR-079).

---

## 8. Definition of Done

- [ ] CRUD with validation
- [ ] Linked payment support via generic payment engine (reference_type = EXPENSE)

---

*Prompt SERVICE-03 — Approved for production use*
