# Mobile Shop ERP — React Admin Panel Documentation

This folder contains the React Admin Panel frontend and its documentation for Mobile Shop ERP. The backend (Phases 0–8) is implemented, hardened, and frozen — the admin UI is built against [BACKEND_API_CONTRACT.md](BACKEND_API_CONTRACT.md).

---

## Read Order

Read these documents **in this exact order** before generating or reviewing any frontend code:

| # | Document | Purpose |
|---|----------|---------|
| 1 | [01_AGENTS.md](01_AGENTS.md) | **Policy document.** Tech stack, canonical folder/module structure, naming, and top-level rules for every category below. All other documents defer to this one and must not restate its rules. |
| 2 | [02_PROJECT_CONTEXT.md](02_PROJECT_CONTEXT.md) | Business/domain context: project goal, module list, business flows (product/purchase/sales/service), dashboard widgets. |
| 3 | [03_ARCHITECTURE.md](03_ARCHITECTURE.md) | Layered architecture, data flow, dependency rules, and how modules are wired together. |
| 4 | [04_TASKS.md](04_TASKS.md) | Full phase-by-phase implementation roadmap (P00–P11). Marks tasks that depend on backend APIs that don't exist yet. |
| 5 | [05_UI_STANDARDS.md](05_UI_STANDARDS.md) | Canonical theme, color palette, typography, spacing, and component visual standards. |
| 6 | [06_API_INTEGRATION.md](06_API_INTEGRATION.md) | How the frontend talks to the backend: Axios architecture, request/response flow, pagination, error handling. |
| 7 | [07_CODING_STANDARDS.md](07_CODING_STANDARDS.md) | Code-level conventions: naming, file rules, component/hook/service rules, imports, Git rules. |
| 8 | [08_SECURITY.md](08_SECURITY.md) | Frontend security standards: token handling, route protection, XSS/CSRF, secure storage. |
| 9 | [09_PERFORMANCE.md](09_PERFORMANCE.md) | Performance budgets: Core Web Vitals, bundle size, code splitting, caching, virtualization. |
| — | [BACKEND_API_CONTRACT.md](BACKEND_API_CONTRACT.md) | The single source of truth for the actual, frozen backend contract: roles, JWT flow, `ApiResponse<T>` envelope, error codes, pagination parameters, and auth endpoint DTOs. |
| — | [TESTING.md](TESTING.md) | Frontend testing stack, structure, and required coverage per module. |

---

## Document Ownership (avoiding duplication)

To avoid conflicting copies of the same rule, each topic has exactly one **owning document**. Other documents reference it instead of repeating it:

- **Folder/module structure** → owned by `01_AGENTS.md`
- **Roles & permission model** → owned by `01_AGENTS.md` (frontend policy) and `BACKEND_API_CONTRACT.md` (backend facts)
- **Theme / colors / typography / spacing** → owned by `05_UI_STANDARDS.md`
- **API contract (DTOs, error codes, pagination)** → owned by `BACKEND_API_CONTRACT.md`
- **Redux vs React Query scope** → owned by `01_AGENTS.md`
- **Testing stack and coverage rules** → owned by `TESTING.md`
- **Performance budgets** → owned by `09_PERFORMANCE.md`
- **Security rules** → owned by `08_SECURITY.md`

If you find the same rule stated differently in two documents, `01_AGENTS.md` wins, and the conflicting document should be corrected to reference it.

---

## Status

All admin frontend phases **P00–P11** in [04_TASKS.md](04_TASKS.md) are **Completed**. The app lives under `admin/src/` and can be run locally (`npm run dev` on port 3000) or via Docker Compose (see [docs/09_Deployment.md](../docs/09_Deployment.md)).

### Local development (backend in Docker, admin on host)

```bash
# Terminal 1 — from docker/
docker compose up -d postgres backend

# Terminal 2 — from admin/
cp .env.example .env
npm install
npm run dev
```

Use `.env` with `VITE_API_BASE_URL=http://localhost:8081/api/v1`.

### Full stack in Docker

```bash
cd docker
docker compose up -d --build
```

Open http://localhost:3000 — login with dev admin `9999999999` / `Admin@123456`.

### Tests

```bash
npm run test          # Vitest unit/component tests (MSW)
npm run test:e2e      # Playwright auth flow (builds preview server)
npm run verify        # typecheck + lint + unit tests + production build
```

See [TESTING.md](TESTING.md) for coverage priorities and conventions.

---

## Documentation hardening (historical)

All 9 numbered documents plus `BACKEND_API_CONTRACT.md` and `TESTING.md` completed a Documentation Hardening Pass before Phase 00 implementation.
