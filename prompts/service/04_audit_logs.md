# Audit Logs — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | SERVICE-04 |
| **Module** | Utility |
| **Table** | `audit_logs` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V8__service.sql` |
| **Backend Package** | `com.mobileshoperp.modules.utility` |
| **Depends On** | Phase 1 Auth (users) |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md`
2. `docs/02_Business_Rules.md` — BR-069 through BR-072
3. `docs/05_Data_Dictionary.md` — `audit_logs`
4. `tasks/phase-07-service.md`

---

## 2. Objective

Implement **AuditLog** service for recording create, update, delete, and login events across the system.

---

## 3. Scope — What to Generate

| Component | Output |
|-----------|--------|
| Entity | `AuditLog` mapped to `audit_logs` |
| Repository | `AuditLogRepository` |
| Service | `AuditLogService.recordCreate/Update/Delete/Login(...)` |
| DTO | `AuditLogResponse` (read-only) |
| Controller | Search/list APIs (Admin only) |

Generate **one layer only** per invocation.

---

## 4. Explicit Exclusions — Do NOT Generate

- Mutable audit records (append-only)
- Logging passwords or JWT tokens
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Service module complete — proceed to `report/01_sales_report.md`.

---

## 6. Database Contract

```text
audit_logs
├── id          UUID PRIMARY KEY
├── module_name VARCHAR(50)
├── table_name  VARCHAR(100)
├── record_id   UUID
├── action      VARCHAR(20)   -- CREATE, UPDATE, DELETE, LOGIN
├── old_data    JSONB
├── new_data    JSONB
├── user_id     UUID FK → users.id
├── ip_address  VARCHAR(50)
└── created_at  TIMESTAMPTZ
```

---

## 7. Business Rules

- BR-069/070/071: Log all create/update/delete operations
- BR-072: Log every login

---

## 8. Definition of Done

- [ ] `AuditLogService` callable from other modules
- [ ] Login audit integrated with auth module
- [ ] Search API paginated and read-only

---

*Prompt SERVICE-04 — Approved for production use*
