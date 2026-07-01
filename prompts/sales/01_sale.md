# Sale — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | SALES-01 |
| **Module** | Sales |
| **Table** | `sales` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V7__sales.sql` |
| **Backend Package** | `com.mobileshoperp.modules.sales` |
| **Depends On** | Customer, Stock modules |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md`
2. `docs/02_Business_Rules.md` — BR-051, BR-053, BR-057
3. `docs/05_Data_Dictionary.md` — `sales`
4. `tasks/phase-06-sales.md`

---

## 2. Objective

Implement **Sale** header — customer, invoice, date, totals, payment status.

---

## 3. Scope — What to Generate

One layer only for Sale header vertical slice.

---

## 4. Explicit Exclusions — Do NOT Generate

- SaleItem (SALES-02)
- Payment records (payment module)
- Stock status updates (SALES-03)
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Next: `02_sale_item.md`.

---

## 6. Database Contract

```text
sales
├── id              UUID PRIMARY KEY
├── customer_id     UUID FK → customers.id (indexed)
├── invoice_number  VARCHAR(100) NOT NULL UNIQUE
├── invoice_date    DATE NOT NULL
├── total_amount    DECIMAL(12,2) NOT NULL
├── payment_status  VARCHAR(30) NOT NULL  -- PENDING | PARTIAL | PAID | REFUNDED
└── audit cols
```

---

## 7. Business Rules

- BR-051: One customer per sale
- BR-053: Unique invoice number
- BR-057: Total equals sum of sale items
- Invoice prefix from settings (when available)

---

## 8. Coding Standards

Per `AGENTS.md`.

---

## 9. Definition of Done

- [ ] Customer validated active
- [ ] Invoice number generation strategy documented
- [ ] Payment status enum aligned with BR-061 partial payments

---

*Prompt SALES-01 — Approved for production use*
