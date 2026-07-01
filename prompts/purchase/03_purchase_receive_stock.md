# Purchase Receive & Stock Creation — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | PURCHASE-03 |
| **Module** | Purchase → Inventory (workflow) |
| **Tables** | `purchases`, `purchase_items`, `stock`, `stock_movements` |
| **Flyway Migration** | `V5__purchase.sql`, `V6__inventory.sql` |
| **Backend Package** | `com.mobileshoperp.modules.purchase`, `com.mobileshoperp.modules.inventory` |
| **Depends On** | PURCHASE-02, STOCK-01 (entities exist) |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Stock Rule, Stock Movement Rule
2. `docs/02_Business_Rules.md` — BR-038, BR-039, BR-044, BR-046
3. `docs/03_Database_Design.md` — Inventory Strategy
4. `tasks/phase-04-purchase.md`

---

## 2. Objective

Implement **purchase receive/finalize** workflow: when purchase is received, create **Stock** records (one per mobile/IMEI) and **StockMovement** PURCHASE entries. On cancel, reverse stock (BR-039).

---

## 3. Scope — What to Generate

**Service-layer workflow only** when invoked (one class/method group per request):

| Component | Responsibility |
|-----------|----------------|
| `PurchaseReceiveService` | Receive purchase → create stock + movements |
| `PurchaseCancelService` | Cancel → reverse stock if not yet sold |
| DTO | `ReceivePurchaseRequest` with IMEI list per serialized line |
| Exception | `PurchaseAlreadyReceivedException`, `PurchaseCannotBeCancelledException` |

---

## 4. Explicit Exclusions — Do NOT Generate

- New tables
- Warehouse logic (Phase 2)
- Sale or payment code
- Skipping stock_movement records (BR-046)
- Multiple workflows in one response

---

## 5. Stop Condition

**STOP** after the requested workflow component.

Purchase module complete — proceed to `stock/01_stock.md`.

---

## 6. Workflow Contract

```text
Receive Purchase:
  1. Validate purchase not already received
  2. For each purchase_item:
       - Serialized: create N stock rows (one per IMEI) with purchase_item_id FK
       - Accessory: create quantity-based stock or batch per business rule
  3. Create stock_movement (PURCHASE) for each stock change
  4. Update purchase payment_status if applicable
  5. Commit in single @Transactional boundary

Cancel Purchase:
  1. Validate stock not SOLD
  2. Reverse stock + movements
  3. Mark purchase cancelled
```

---

## 7. Business Rules

- BR-044: Every purchase item creates stock on receive
- BR-041/042: Unique IMEI for mobiles
- BR-043: Accessories — IMEI nullable
- BR-038: Cannot delete purchase after stock created — cancel workflow instead
- BR-092: Atomic transaction

---

## 8. Coding Standards

Per `AGENTS.md`. All logic in service layer. Controller exposes `POST /api/v1/purchases/{id}/receive` and `/cancel`.

---

## 9. Definition of Done

- [ ] Stock always traces to purchase_item_id
- [ ] Every stock change has movement record
- [ ] Rollback on any failure
- [ ] Integration test for receive flow

---

*Prompt PURCHASE-03 — Approved for production use*
