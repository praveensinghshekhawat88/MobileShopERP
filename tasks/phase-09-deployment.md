# Phase 9 — Deployment

**Status:** 🟨 In Progress

**Master Roadmap:** [TASKS.md](../TASKS.md)

**Task ID Format:** `P09-Txxx`

**Depends on:** [phase-08-reports.md](./phase-08-reports.md)

**Flyway Migration:** `V10__future.sql` (seed data and future placeholders)

---

## Status Legend

⬜ Pending | 🟨 In Progress | 🟩 Completed | 🟥 Blocked

---

## Goal

Prepare production-ready deployment with Docker, CI/CD, monitoring, and environment configuration.

---

## Tasks

### Docker

- [x] P09-T001 — Finalize `Dockerfile` for backend (`backend/Dockerfile` — multi-stage, non-root user, healthcheck)
- [x] P09-T002 — Finalize `docker-compose.yml` (PostgreSQL + backend + pgAdmin, `docker/docker-compose.yml`)
- [x] P09-T003 — Environment-specific configuration (`application-dev.yml`, `application-docker.yml`, `application-staging.yml`, `application-prod.yml`)

### CI/CD

- [x] P09-T004 — GitHub Actions: build and test pipeline (`.github/workflows/ci.yml`)
- [x] P09-T005 — GitHub Actions: Docker image build (`docker-image` job in `.github/workflows/ci.yml`, validates `docker build` succeeds; registry push intentionally deferred until a registry/target is chosen — see Notes)
- [x] P09-T006 — Database migration strategy for production (Flyway auto-applies on startup; backup-before-deploy documented in `docs/09_Deployment.md`)

### Monitoring & Health

- [x] P09-T007 — Spring Actuator health endpoints (`/actuator/health`, exposure locked down per profile in `application-staging.yml` / `application-prod.yml`)
- [x] P09-T008 — Application logging configuration (`logback-spring.xml`, profile-aware log levels)
- [x] P09-T009 — API documentation export (OpenAPI spec) (runtime export at `GET /api-docs`, documented in `docs/09_Deployment.md`)

### Production Readiness

- [x] P09-T010 — Security hardening review (JWT, CORS, secrets) — completed as part of the Enterprise Hardening pass (see `TASKS.md` § Enterprise Hardening: CORS, JWT entry/access handlers, refresh-token rejection, `ProductionSecurityValidator`)
- [x] P09-T011 — Performance smoke tests (`scripts/smoke-test.sh` — health, auth, authenticated read, refresh-token-rejection, with a response-time budget)
- [x] P09-T012 — Deployment documentation in `docs/` (`docs/09_Deployment.md`)

### Postman

- [x] P09-T013 — Postman collection for all API endpoints (`postman/MobileShopERP.postman_collection.json`)
- [x] P09-T014 — Postman environment files (local, staging) (`postman/local.postman_environment.json`, `postman/staging.postman_environment.json`)

---

## Exit Criteria

- [x] Application deploys via Docker Compose on a clean server (`docker compose up -d --build` from `docker/`)
- [x] Database name `mobile_shop_erp` configured consistently (compose, all profiles, `docs/09_Deployment.md`)
- [x] CI pipeline passes on every push (build+test job; Docker image build job validates the image builds)
- [x] Postman collection covers all modules

---

## Notes

Target deployment: Ubuntu Server with Docker. See `ARCHITECTURE.md` deployment section.

Remaining before this phase can be marked fully 🟩 Completed: decide on a container registry (GHCR/Docker Hub/ECR) and add the corresponding push step + tagging strategy to the `docker-image` CI job. This was intentionally left out because it requires an infrastructure decision (registry choice, credentials) outside the scope of this pass — flagged here rather than guessed.
