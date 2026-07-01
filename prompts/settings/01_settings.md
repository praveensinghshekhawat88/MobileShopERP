# Settings — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | SETTINGS-01 |
| **Module** | Authentication / Shop Configuration |
| **Table** | `settings` |
| **Primary Key** | BIGINT Identity |
| **Flyway Migration** | `V2__authentication.sql` |
| **Backend Package** | `com.mobileshoperp.modules.auth` |
| **Depends On** | Auth module (AUTH-01 minimum) |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Settings Rule (structured fields, NOT key/value JSON)
2. `docs/05_Data_Dictionary.md` — `settings`
3. `tasks/phase-01-authentication.md`

---

## 2. Objective

Implement **Settings** as a structured singleton (or single-row) shop configuration: company name, GST, invoice prefix, logo path, etc.

---

## 3. Scope — What to Generate

One layer only for Settings vertical slice.

Pattern: GET current settings + PUT/PATCH update (Admin only). No arbitrary key-value store.

---

## 4. Explicit Exclusions — Do NOT Generate

- JSONB key/value settings pattern (forbidden by AGENTS.md)
- Multiple settings rows without business justification
- User or Role CRUD
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after requested layer. Settings complete — continue product module if not started.

---

## 6. Database Contract

```text
settings
├── id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
├── company_name    VARCHAR(200)
├── owner_name      VARCHAR(150)
├── gst_number      VARCHAR(20)
├── mobile          VARCHAR(15)
├── email           VARCHAR(150)
├── address         TEXT
├── logo            TEXT          (file path/URL only)
└── invoice_prefix  VARCHAR(20)
```

---

## 7. Business Rules

- BR-077: Validate GST format when provided
- BR-078: Validate email format
- BR-076: Validate mobile format
- Seed data in V10__future.sql provides defaults

---

## 8. Coding Standards

Per `AGENTS.md`. Admin-only mutation endpoints.

---

## 9. Definition of Done

- [ ] Structured fields only — no generic key/value API
- [ ] Validation on all fields
- [ ] Read available to authorized roles per business policy

---

*Prompt SETTINGS-01 — Approved for production use*
