# Generic Payment Engine — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | PAYMENT-01 |
| **Module** | Utility / Cross-cutting |
| **Table** | `payments` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V7__sales.sql` |
| **Backend Package** | `com.mobileshoperp.modules.utility` |
| **Depends On** | Sales/Purchase entities exist |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Payment Engine
2. `docs/02_Business_Rules.md` — BR-058 through BR-062
3. `docs/03_Database_Design.md` — Payment Strategy
4. `docs/05_Data_Dictionary.md` — `payments`
5. `ARCHITECTURE.md` — Payment Architecture

---

## 2. Objective

Implement the **generic payment engine** — one `payments` table serving SALE, PURCHASE, REPAIR, and EXPENSE via polymorphic reference.

Never create `sale_payments`, `purchase_payments`, or separate payment tables.

---

## 3. Scope — What to Generate

One layer only for Payment vertical slice + `PaymentService.recordPayment(referenceType, referenceId, ...)`.

---

## 4. Explicit Exclusions — Do NOT Generate

- Module-specific payment tables (forbidden)
- Payment amount exceeding pending balance (BR-062)
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Payment module complete.

---

## 6. Database Contract

```text
payments
├── id                 UUID PRIMARY KEY
├── reference_type     VARCHAR(30) NOT NULL  -- SALE | PURCHASE | REPAIR | EXPENSE
├── reference_id       UUID NOT NULL (indexed)
├── payment_mode       VARCHAR(30) NOT NULL  -- CASH | UPI | CARD | BANK_TRANSFER | FINANCE | EMI
├── amount             DECIMAL(12,2) NOT NULL
├── transaction_number VARCHAR(150)
├── payment_date       TIMESTAMPTZ NOT NULL
└── audit cols
```

Index: `(reference_type, reference_id)`

---

## 7. Business Rules

- BR-058: Generic reference pattern
- BR-059: Multiple payments per reference
- BR-060: Valid payment modes
- BR-061: Partial payment supported
- BR-062: Amount ≤ pending balance
- BR-079: Positive amounts

---

## 8. Coding Standards

`PaymentService` updates parent entity `payment_status` (sale/purchase) after each payment. Per `AGENTS.md`.

---

## 9. Definition of Done

- [ ] Single payments table only
- [ ] Pending balance calculation correct
- [ ] Payment history by reference queryable
- [ ] Unit tests for partial and full payment scenarios

---

*Prompt PAYMENT-01 — Approved for production use*
