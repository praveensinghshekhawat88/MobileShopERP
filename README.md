# MobileShopERP

Enterprise-grade ERP backend for mobile and electronics retail operations.

**Architecture Status:** Locked  
**Total Tables:** 26  
**Database:** PostgreSQL 17 — `mobile_shop_erp`  
**Stack:** Java 21 · Spring Boot 3.5 · Flyway · JWT · Docker

---

## Repository Structure

```
MobileShopERP/
├── AGENTS.md                 # AI agent rules and coding standards (source of truth for implementation)
├── ARCHITECTURE.md           # Software architecture and module design
├── PROJECT_CONTEXT.md        # Business domain, strategies, and scope
├── TASKS.md                  # Master development roadmap (phase index)
├── CHANGELOG.md              # Documentation and release history
├── README.md                 # This file
│
├── backend/                  # Spring Boot application (Java 21, Gradle Kotlin DSL)
├── database/
│   └── migrations/           # Flyway SQL migrations (V1–V10, locked naming)
├── docker/                   # Dockerfile and Docker Compose configuration
├── docs/                     # Locked specification documents (requirements, rules, schema)
├── postman/                  # API collections and environment files
├── prompts/                  # Cursor micro-prompts per module (one layer at a time)
├── tasks/                    # Phase task trackers with globally unique task IDs (Pxx-Txxx)
└── .github/                  # GitHub Actions workflows and templates
```

---

## Folder Purposes

| Folder | Purpose |
|--------|---------|
| `backend/` | Spring Boot REST API source code (`com.mobileshoperp`) |
| `database/migrations/` | Flyway migrations: `V1__foundation.sql` through `V10__future.sql` |
| `docker/` | Container definitions for PostgreSQL, backend, and local development |
| `docs/` | Locked business, database, and requirements documentation |
| `postman/` | API testing collections aligned with `/api/v1` endpoints |
| `prompts/` | Module-scoped Cursor execution prompts (auth, product, business, etc.) |
| `tasks/` | Detailed phase checklists with unique IDs (`P00-T001`, `P01-T001`, …) |

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [AGENTS.md](./AGENTS.md) | Implementation rules for AI and developers |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Layered architecture, modules, and technology stack |
| [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) | Domain model, business flow, and scope boundaries |
| [TASKS.md](./TASKS.md) | Phase roadmap with links to `tasks/phase-XX-*.md` |
| [docs/01_Project_Requirement.md](./docs/01_Project_Requirement.md) | Project requirements (PRD) |
| [docs/02_Business_Rules.md](./docs/02_Business_Rules.md) | Business rules BR-001–BR-100 |
| [docs/03_Database_Design.md](./docs/03_Database_Design.md) | Database design principles and Flyway strategy |
| [docs/04_ER_Diagram.md](./docs/04_ER_Diagram.md) | Entity relationships (locked) |
| [docs/05_Data_Dictionary.md](./docs/05_Data_Dictionary.md) | Table and column definitions (26 tables) |
| [prompts/README.md](./prompts/README.md) | Cursor prompt library and execution order |

---

## Development Phases

| Phase | Module | Task File |
|-------|--------|-----------|
| 0 | Foundation | [tasks/phase-00-foundation.md](./tasks/phase-00-foundation.md) |
| 1 | Authentication | [tasks/phase-01-authentication.md](./tasks/phase-01-authentication.md) |
| 2 | Product | [tasks/phase-02-product.md](./tasks/phase-02-product.md) |
| 3 | Business | [tasks/phase-03-business.md](./tasks/phase-03-business.md) |
| 4 | Purchase | [tasks/phase-04-purchase.md](./tasks/phase-04-purchase.md) |
| 5 | Inventory | [tasks/phase-05-inventory.md](./tasks/phase-05-inventory.md) |
| 6 | Sales | [tasks/phase-06-sales.md](./tasks/phase-06-sales.md) |
| 7 | Service | [tasks/phase-07-service.md](./tasks/phase-07-service.md) |
| 8 | Reports | [tasks/phase-08-reports.md](./tasks/phase-08-reports.md) |
| 9 | Deployment | [tasks/phase-09-deployment.md](./tasks/phase-09-deployment.md) |
| 10 | Future | [tasks/phase-10-future.md](./tasks/phase-10-future.md) |

**Task ID format:** `P{phase}-T{number}` (e.g., `P02-T001`) — globally unique, no collisions.

---

## Flyway Migrations (Locked)

| Version | File | Module |
|---------|------|--------|
| V1 | `V1__foundation.sql` | Extensions, enums, shared DB objects |
| V2 | `V2__authentication.sql` | roles, users, settings |
| V3 | `V3__product.sql` | Product master (10 tables) |
| V4 | `V4__business.sql` | customers, suppliers |
| V5 | `V5__purchase.sql` | purchases, purchase_items |
| V6 | `V6__inventory.sql` | stock, stock_movements |
| V7 | `V7__sales.sql` | sales, sale_items, payments |
| V8 | `V8__service.sql` | repairs, warranty, expenses, audit_logs |
| V9 | `V9__reports.sql` | Report indexes/views |
| V10 | `V10__future.sql` | Seed data and future placeholders |

---

## Backend Packages (Locked)

```
com.mobileshoperp.modules.auth
com.mobileshoperp.modules.product
com.mobileshoperp.modules.business
com.mobileshoperp.modules.purchase
com.mobileshoperp.modules.inventory
com.mobileshoperp.modules.sales
com.mobileshoperp.modules.service
com.mobileshoperp.modules.report
com.mobileshoperp.modules.utility
```

---

## License

See [LICENSE](./LICENSE).
