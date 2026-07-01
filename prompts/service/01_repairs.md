# Repairs — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | SERVICE-01 |
| **Module** | Service |
| **Table** | `repairs` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V8__service.sql` |
| **Backend Package** | `com.mobileshoperp.modules.service` |
| **Depends On** | Phase 6 Sales, Phase 5 Inventory complete |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md`
2. `docs/02_Business_Rules.md` — BR-063, BR-064, BR-065
3. `docs/05_Data_Dictionary.md` — `repairs`
4. `tasks/phase-07-service.md`

---

## 2. Objective

Implement **Repair** management for sold devices or external customer devices with locked status workflow.

---

## 3. Repair Status (Locked Enum)

RECEIVED, CHECKING, WAITING_PARTS, REPAIRING, READY, DELIVERED, CANCELLED

---

## 4. Scope — What to Generate

One layer only per invocation: Entity → Repository → DTO → Mapper → Service → Controller → Exception → Unit Test.

---

## 5. Explicit Exclusions — Do NOT Generate

- Warranty module (SERVICE-02)
- Expense or audit modules
- Physical delete of repair history (BR-065)
- Multiple layers in one response

---

## 6. Stop Condition

**STOP** after requested layer. Next: `02_warranty.md`.

---

## 7. Database Contract

```text
repairs
├── id                 UUID PRIMARY KEY
├── stock_id           UUID FK → stock.id (nullable for external devices)
├── customer_id        UUID FK → customers.id
├── repair_status      VARCHAR(30) NOT NULL
├── issue_description  TEXT
├── estimated_cost     DECIMAL(12,2)
├── actual_cost        DECIMAL(12,2)
└── audit cols
```

---

## 8. Coding Standards

Per `AGENTS.md`. Status transitions validated in service layer. Stock status may move to REPAIR per stock lifecycle rules.

---

## 9. Definition of Done

- [ ] Repair status enum matches locked values
- [ ] Repair history never physically deleted
- [ ] `ApiResponse<T>` on all endpoints

---

*Prompt SERVICE-01 — Approved for production use*
