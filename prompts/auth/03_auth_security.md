# JWT Security Infrastructure — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | AUTH-03 |
| **Module** | Authentication / Security |
| **Tables** | None (infrastructure) |
| **Backend Package** | `com.mobileshoperp.config`, `com.mobileshoperp.security` |
| **Depends On** | AUTH-02 (User) complete |
| **Architecture** | Locked |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md` — Security Rules, Security Architecture
2. `ARCHITECTURE.md` — Security Architecture
3. `docs/02_Business_Rules.md` — BR-005 (JWT 8h), BR-081 through BR-084
4. `tasks/phase-01-authentication.md`

---

## 2. Objective

Implement production-grade **Spring Security + JWT** infrastructure: token generation, validation, filter chain, and role-based authorization foundation.

---

## 3. Scope — What to Generate

Generate **one component only** when invoked:

| Component | Output |
|-----------|--------|
| JWT Config | `JwtProperties` bound from `application.yml` |
| JWT Utility | `JwtUtil` — generate, validate, extract claims (userId, email, role) |
| Security Config | `SecurityConfig` — permit `/api/v1/auth/**`, secure all other `/api/v1/**` |
| JWT Filter | `JwtAuthenticationFilter` — extract Bearer token, set SecurityContext |
| Entry Point | `JwtAuthenticationEntryPoint`, `JwtAccessDeniedHandler` |
| Password Encoder | `BCryptPasswordEncoder` bean |

---

## 4. Explicit Exclusions — Do NOT Generate

- Login/refresh controller endpoints (see `04_login_refresh.md`)
- User or Role CRUD
- Business module security rules beyond role extraction
- Refresh token persistence table (use stateless JWT unless explicitly approved)
- Frontend token storage logic
- Logging of JWT tokens or passwords
- Multiple security components in one response

---

## 5. Stop Condition

**STOP** after the single requested component.

When all security infrastructure is complete, **STOP** before `04_login_refresh.md`.

---

## 6. Security Contract

| Setting | Value |
|---------|-------|
| Public endpoints | `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh` |
| Protected | All other `/api/v1/**` |
| Header | `Authorization: Bearer <token>` |
| Access token expiry | 8 hours (BR-005) |
| Password encoding | BCrypt |
| Injection | Constructor only |

---

## 7. Coding Standards

- No `@Autowired` on fields
- No secrets hardcoded — use environment/`application.yml`
- Never log JWT or passwords
- Return HTTP 401 for unauthorized, 403 for forbidden (BR-083, BR-084)

---

## 8. Definition of Done

- [ ] Unauthenticated requests to protected endpoints return 401
- [ ] Valid JWT grants access with correct role in SecurityContext
- [ ] Auth endpoints remain publicly accessible
- [ ] Configuration externalized

---

*Prompt AUTH-03 — Approved for production use*
