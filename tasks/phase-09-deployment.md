# Phase 9 — Deployment

**Status:** ⬜ Pending

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

- [ ] P09-T001 — Finalize `Dockerfile` for backend
- [ ] P09-T002 — Finalize `docker-compose.yml` (PostgreSQL + backend)
- [ ] P09-T003 — Environment-specific configuration (dev, staging, prod)

### CI/CD

- [ ] P09-T004 — GitHub Actions: build and test pipeline
- [ ] P09-T005 — GitHub Actions: Docker image build
- [ ] P09-T006 — Database migration strategy for production

### Monitoring & Health

- [ ] P09-T007 — Spring Actuator health endpoints
- [ ] P09-T008 — Application logging configuration
- [ ] P09-T009 — API documentation export (OpenAPI spec)

### Production Readiness

- [ ] P09-T010 — Security hardening review (JWT, CORS, secrets)
- [ ] P09-T011 — Performance smoke tests
- [ ] P09-T012 — Deployment documentation in `docs/`

### Postman

- [ ] P09-T013 — Postman collection for all API endpoints
- [ ] P09-T014 — Postman environment files (local, staging)

---

## Exit Criteria

- [ ] Application deploys via Docker Compose on a clean server
- [ ] Database name `mobile_shop_erp` configured consistently
- [ ] CI pipeline passes on every push
- [ ] Postman collection covers all modules

---

## Notes

Target deployment: Ubuntu Server with Docker. See `ARCHITECTURE.md` deployment section.
