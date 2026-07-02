# Mobile Shop ERP — React Admin Panel Documentation

This folder is the complete documentation set for the React Admin Panel frontend of the Mobile Shop ERP. The backend (Phases 0–8) is implemented, hardened, and frozen — this documentation describes how the frontend must be built against it.

No React code exists yet. These documents are the specification Cursor and developers must follow before writing any frontend code.

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

All 9 numbered documents plus `BACKEND_API_CONTRACT.md` and `TESTING.md` have completed a Documentation Hardening Pass (see `DOCUMENTATION_HARDENING_REPORT` delivered in the corresponding chat) that resolved every Critical (P1) and High (P2) finding from the Frontend Documentation Audit. Medium/Low findings were intentionally left open and are not blockers for starting Phase 00.

Do not add new documents, rename existing ones, or change the numbering without an explicit decision — this read order and numbering is now LOCKED.
