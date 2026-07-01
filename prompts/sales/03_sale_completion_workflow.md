# Sale Completion Workflow — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | SALES-03 |
| **Module** | Sales → Inventory (workflow) |
| **Tables** | `sales`, `sale_items`, `stock`, `stock_movements`, `payments` |
| **Flyway Migration** | `V7__sales.sql` |
| **Backend Package** | `com.mobileshoperp.modules.sales` |
| **Depends On** | SALES-02, STOCK-03, PAYMENT-01 |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Stock Movement Rule
2. `docs/02_Business_Rules.md` — BR-055, BR-056, BR-061
3. `tasks/phase-06-sales.md`

---

## 2. Objective

Implement **sale finalize** and **sale cancel** orchestration:

**Finalize:** validate items → mark stock SOLD → create stock_movements → optional initial payment → update payment_status

**Cancel:** restore stock to AVAILABLE → reverse movements → update sale status

---

## 3. Scope — What to Generate

One workflow component per invocation:

| Component | Output |
|-----------|--------|
| `SaleCompletionService` | finalizeSale(saleId) |
| `SaleCancellationService` | cancelSale(saleId) |
| DTO | `FinalizeSaleRequest`, `SaleCompletionResponse` |
| Exception | `SaleCannotBeModifiedException`, `StockNotAvailableException` |

---

## 4. Explicit Exclusions — Do NOT Generate

- New tables
- Skipping stock_movement (BR-046)
- **Warranty records** — owned by `prompts/service/02_warranty.md` via `sale_item_id` FK
- Full payment module (use PaymentService from PAYMENT-01)
- Multiple workflows in one response

---

## 5. Stop Condition

**STOP** after requested component. Sales module complete — proceed to `payment/01_payment_engine.md`.

---

## 6. Workflow Contract

```text
Finalize Sale (@Transactional):
  1. Validate all sale_items have AVAILABLE stock
  2. For each item: stock → SOLD, record stock_movement
  3. Update sale payment_status (PENDING if no payment)
  4. Return invoice summary DTO

Cancel Sale:
  1. Validate sale not fully paid/refunded per policy
  2. Restore stock → AVAILABLE
  3. Record RETURN movements
  4. Soft-cancel sale
```

Stock status enum (locked): AVAILABLE, RESERVED, SOLD, REPAIR, RETURNED, DAMAGED, LOST

---

## 7. Business Rules

- BR-055: Stock → SOLD on successful sale
- BR-056: Cancel restores stock
- BR-061: Partial payment supported
- BR-092: Single transaction boundary

---

## 8. Definition of Done

- [ ] Atomic finalize/cancel
- [ ] No orphaned SOLD stock without sale
- [ ] Integration test covers happy path + cancel

---

*Prompt SALES-03 — Approved for production use*
