# Login & Refresh Token — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | AUTH-04 |
| **Module** | Authentication |
| **Tables** | `users` (read only) |
| **Backend Package** | `com.mobileshoperp.modules.auth` |
| **Depends On** | AUTH-02, AUTH-03 complete |
| **Architecture** | Locked |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — API Response Rule, Security Rules
2. `docs/02_Business_Rules.md` — BR-003, BR-004, BR-005, BR-072
3. `ARCHITECTURE.md` — Security Architecture
4. `tasks/phase-01-authentication.md`

---

## 2. Objective

Implement **login** and **refresh token** endpoints that authenticate users and issue JWT access tokens.

---

## 3. Scope — What to Generate

Generate **one layer only** when invoked:

| Layer | Output |
|-------|--------|
| DTO | `LoginRequest`, `LoginResponse`, `RefreshTokenRequest` (records) |
| Service | `AuthService` — authenticate, generateToken, refreshToken, update last_login |
| Controller | `AuthController` — `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh` |
| Exception | `InvalidCredentialsException`, `InactiveUserException` |
| Integration Test | `AuthControllerIntegrationTest` |

---

## 4. Explicit Exclusions — Do NOT Generate

- User CRUD endpoints
- Role management
- Registration / forgot-password flows
- OAuth or social login
- Password in response body
- Session-based auth
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after the requested layer.

When Auth module is complete, proceed to `settings/01_settings.md`, then `product/01_brand.md`.

---

## 6. API Contract

```text
POST /api/v1/auth/login
  Request:  { mobile, password }
  Response: ApiResponse<LoginResponse>  { accessToken, tokenType, expiresIn, user summary }

POST /api/v1/auth/refresh
  Request:  { refreshToken } or Bearer refresh strategy per design
  Response: ApiResponse<LoginResponse>
```

---

## 7. Business Rules

- BR-004: Reject login for inactive users
- BR-005: Token expiry 8 hours
- BR-072: Log every login in audit_logs (when audit service exists — stub interface acceptable only if audit module not yet built; document dependency)

---

## 8. Coding Standards

- `ApiResponse<T>` wrapper on all endpoints
- `@Valid` on request bodies
- No business logic in controller
- Generic error messages for invalid credentials (do not reveal whether mobile exists)

---

## 9. Definition of Done

- [ ] Active user with valid credentials receives JWT
- [ ] Inactive user receives appropriate error
- [ ] Invalid credentials handled securely
- [ ] Integration test covers happy path and failure cases

---

*Prompt AUTH-04 — Approved for production use*
