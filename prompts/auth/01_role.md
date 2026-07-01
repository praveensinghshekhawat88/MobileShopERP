# Role — Cursor Execution Prompt

| Field | Value |
|-------|-------|
| **Prompt ID** | AUTH-01 |
| **Module** | Authentication |
| **Table** | `roles` |
| **Primary Key** | BIGINT Identity |
| **Flyway Migration** | `V2__authentication.sql` |
| **Backend Package** | `com.mobileshoperp.modules.auth` |
| **Architecture** | Locked — 26 Tables |

---

## 1. Mandatory Reading (In Order)

1. `AGENTS.md`
2. `docs/02_Business_Rules.md` — BR-001 through BR-008 (auth context)
3. `docs/04_ER_Diagram.md` — Authentication module
4. `docs/05_Data_Dictionary.md` — `roles` table
5. `tasks/phase-01-authentication.md`

---

## 2. Objective

Implement the **Role** master entity and its full vertical slice (layer by layer) as the first authentication domain object. Roles define authorization boundaries for all secured APIs.

---

## 3. Scope — What to Generate

Generate **one layer only** when invoked. Valid layers for this prompt:

| Layer | Output |
|-------|--------|
| Entity | `Role` JPA entity mapped to `roles` |
| Repository | `RoleRepository` extending `JpaRepository<Role, Long>` |
| DTO | `RoleResponse`, `CreateRoleRequest`, `UpdateRoleRequest` (Java records) |
| Mapper | `RoleMapper` (MapStruct) |
| Service | `RoleService` with CRUD and business validation |
| Controller | `RoleController` under `/api/v1/roles` |
| Exception | `RoleNotFoundException` with error code `ROLE_NOT_FOUND` |
| Unit Test | `RoleServiceTest` |

---

## 4. Explicit Exclusions — Do NOT Generate

- User entity, UserService, or UserController
- JWT utilities, security filters, or login endpoints
- Settings module
- Any product, purchase, sales, or inventory code
- Flyway migration file modifications after V2__authentication.sql is committed
- Frontend or Android code
- `@Data` on entities
- Field injection (`@Autowired` on fields)
- Raw entity exposure in API responses
- Multiple layers in a single response

---

## 5. Stop Condition

**STOP immediately** after completing the single layer requested.

Do not proceed to the next layer unless explicitly instructed with the layer name (e.g., "Now generate Repository").

When all layers are complete for Role, **STOP** before opening `02_user.md`.

---

## 6. Database Contract

```text
roles
├── id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
├── name        VARCHAR(50) UNIQUE NOT NULL
├── description TEXT
└── is_active   BOOLEAN DEFAULT TRUE
```

Master table — no UUID, no soft-delete audit columns required beyond master-table conventions in `AGENTS.md`.

---

## 7. Business Rules

- Role name must be unique (BR implied by schema).
- Only active roles should be assignable to new users.
- Role is a master table — use `is_active`, not physical delete.

---

## 8. Coding Standards

- Constructor injection only
- `@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor` on entity — never `@Data`
- DTOs as Java 21 records with Jakarta Validation annotations
- All controller methods return `ApiResponse<T>`
- Service methods throw `RoleNotFoundException` when not found
- `@Transactional` on service layer only
- Swagger annotations on controller
- JavaDoc on public service methods

---

## 9. Definition of Done

- [ ] Layer compiles without warnings
- [ ] Matches `docs/05_Data_Dictionary.md` exactly
- [ ] No table or column invented outside ER diagram
- [ ] Validation and exception handling in place (when applicable to layer)
- [ ] Swagger updated (controller layer)
- [ ] Unit tests pass (service layer)

---

*Prompt AUTH-01 — Approved for production use*
