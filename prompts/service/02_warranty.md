# Warranty — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | SERVICE-02 |
| **Module** | Service |
| **Table** | `warranty` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V8__service.sql` |
| **Backend Package** | `com.mobileshoperp.modules.service` |
| **Depends On** | SERVICE-01, Phase 6 Sales (`sale_items`) |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Warranty Rule
2. `docs/02_Business_Rules.md` — BR-066, BR-067, BR-068
3. `docs/05_Data_Dictionary.md` — `warranty` (`sale_item_id` FK)
4. `tasks/phase-07-service.md`

---

## 2. Objective

Implement **Warranty** linked exclusively to **`sale_item_id`** (sold item). Warranty starts from sale date.

---

## 3. Architecture Decision (Locked)

**Warranty MUST reference `sale_item_id`.** Do NOT use `stock_id` as the primary warranty FK.

---

## 4. Scope — What to Generate

One layer only per invocation for Warranty vertical slice including expiry calculation service.

---

## 5. Explicit Exclusions — Do NOT Generate

- Warranty FK to `stock_id` as primary reference (forbidden)
- Warranty on purchase or unsold stock
- Multiple layers in one response

---

## 6. Stop Condition

**STOP** after requested layer. Next: `03_expenses.md`.

---

## 7. Database Contract

```text
warranty
├── id               UUID PRIMARY KEY
├── sale_item_id     UUID FK → sale_items.id (indexed) ← REQUIRED
├── warranty_months  INTEGER
├── start_date       DATE NOT NULL
├── end_date         DATE NOT NULL
├── claim_status     VARCHAR(30)
└── audit cols
```

---

## 8. Business Rules

- BR-066: Warranty starts from sale date
- BR-067: Expiry calculated automatically from `warranty_months`
- BR-068: Expired warranty cannot be claimed

---

## 9. Definition of Done

- [ ] FK is `sale_item_id` only
- [ ] Automatic expiry calculation implemented
- [ ] Claim validation rejects expired warranty

---

*Prompt SERVICE-02 — Approved for production use*
