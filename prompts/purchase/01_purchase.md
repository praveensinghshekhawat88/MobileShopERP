# Purchase — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | PURCHASE-01 |
| **Module** | Purchase |
| **Table** | `purchases` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V5__purchase.sql` |
| **Backend Package** | `com.mobileshoperp.modules.purchase` |
| **Depends On** | Supplier module complete |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Module Order, Transaction Rules
2. `docs/02_Business_Rules.md` — BR-035 through BR-040
3. `docs/05_Data_Dictionary.md` — `purchases`
4. `tasks/phase-04-purchase.md`

---

## 2. Objective

Implement **Purchase** header — supplier invoice, dates, totals, payment status.

---

## 3. Scope — What to Generate

One layer only for Purchase header vertical slice (items in PURCHASE-02).

---

## 4. Explicit Exclusions — Do NOT Generate

- PurchaseItem (next prompt)
- Stock creation (PURCHASE-03)
- Automatic stock on save — only on receive/finalize
- Physical delete after stock generated (BR-038)
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Next: `02_purchase_item.md`.

---

## 6. Database Contract

```text
purchases
├── id              UUID PRIMARY KEY
├── supplier_id     UUID FK → suppliers.id (indexed)
├── invoice_number  VARCHAR(100) NOT NULL UNIQUE
├── invoice_date    DATE NOT NULL
├── total_amount    DECIMAL(12,2) NOT NULL
├── payment_status  VARCHAR(30) NOT NULL
└── audit cols
```

---

## 7. Business Rules

- BR-035: One supplier per purchase
- BR-037: Unique invoice number
- BR-038: No delete after stock generation
- BR-040: Total must equal sum of line items (enforce when items exist)

---

## 8. Coding Standards

Per `AGENTS.md`. Use `@Transactional` for operations affecting items + totals.

---

## 9. Definition of Done

- [ ] Supplier validated active
- [ ] Invoice uniqueness enforced
- [ ] Payment status enum aligned with business rules

---

*Prompt PURCHASE-01 — Approved for production use*
