# User — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | AUTH-02 |
| **Module** | Authentication |
| **Table** | `users` |
| **Primary Key** | UUID |
| **Flyway Migration** | `V2__authentication.sql` |
| **Backend Package** | `com.mobileshoperp.modules.auth` |
| **Depends On** | AUTH-01 (Role) complete |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md`
2. `docs/02_Business_Rules.md` — BR-001 through BR-008
3. `docs/04_ER_Diagram.md` — Roles → Users (1:N)
4. `docs/05_Data_Dictionary.md` — `users` table
5. `tasks/phase-01-authentication.md`

---

## 2. Objective

Implement the **User** business entity and its full vertical slice. Users authenticate via JWT and are linked to exactly one Role.

---

## 3. Scope — What to Generate

Generate **one layer only** when invoked:

| Layer | Output |
|-------|--------|
| Entity | `User` JPA entity with `@ManyToOne` to `Role` |
| Repository | `UserRepository` with findByMobile, findByEmail |
| DTO | `UserResponse`, `CreateUserRequest`, `UpdateUserRequest` — password never in response |
| Mapper | `UserMapper` |
| Service | `UserService` — BCrypt encode on create/update password |
| Controller | `UserController` under `/api/v1/users` — Admin-only create/deactivate |
| Exception | `UserNotFoundException` (`USER_NOT_FOUND`), `DuplicateMobileException` |
| Unit Test | `UserServiceTest` |

---

## 4. Explicit Exclusions — Do NOT Generate

- JWT filter, `AuthController`, login/refresh endpoints (see `03_auth_security.md`, `04_login_refresh.md`)
- Settings
- Role CRUD (already built in AUTH-01)
- Password hash in any API response (BR-082)
- Plain-text password storage (BR-003)
- Self-registration endpoints
- Multiple layers in one response

---

## 5. Stop Condition

**STOP** after the requested layer.

When User vertical slice is complete, **STOP** before `03_auth_security.md`.

---

## 6. Database Contract

```text
users
├── id           UUID PRIMARY KEY
├── role_id      BIGINT FK → roles.id (indexed)
├── first_name   VARCHAR(100) NOT NULL
├── last_name    VARCHAR(100)
├── mobile       VARCHAR(15) UNIQUE NOT NULL
├── email        VARCHAR(150) UNIQUE
├── password     VARCHAR(255) NOT NULL  (BCrypt hash)
├── is_active    BOOLEAN DEFAULT TRUE
├── last_login   TIMESTAMPTZ
└── audit cols   created_at, updated_at, created_by, updated_by, deleted_at
```

---

## 7. Business Rules

- BR-001: Unique mobile number
- BR-002: Unique email if provided
- BR-003: BCrypt password hashing
- BR-004: Only active users can login
- BR-007: Only Admin can create users
- BR-008: Only Admin can deactivate users
- BR-073/074: Soft delete only

---

## 8. Coding Standards

Per `AGENTS.md` — records for DTOs, `ApiResponse<T>`, constructor injection, MapStruct, no entity in API, `@Transactional` on service.

---

## 9. Definition of Done

- [ ] Schema matches data dictionary
- [ ] Password never returned in responses
- [ ] Role FK validated on create/update
- [ ] Soft delete implemented at service layer
- [ ] Admin authorization enforced on controller (when controller layer built)

---

*Prompt AUTH-02 — Approved for production use*
