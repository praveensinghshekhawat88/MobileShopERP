# Phase 0 — Project Foundation

**Status:** ⬜ Pending

**Master Roadmap:** [TASKS.md](../TASKS.md)

**Task ID Format:** `P00-Txxx`

---

## Status Legend

⬜ Pending | 🟨 In Progress | 🟩 Completed | 🟥 Blocked

---

## Goal

Initialize the Spring Boot backend, shared infrastructure, Docker environment, PostgreSQL, Flyway, and common architecture required by all business modules.

---

## Prerequisites

- [ ] Repository structure created
- [ ] Documentation under `docs/` completed
- [ ] AGENTS.md available
- [ ] PROJECT_CONTEXT.md available
- [ ] ARCHITECTURE.md available

---

# Section 1 — Project Setup

- [ ] P00-T001 — Initialize Spring Boot project (Java 21, Spring Boot 3.5.x, Gradle Kotlin DSL)
- [ ] P00-T002 — Add all required dependencies
- [ ] P00-T003 — Configure `application.yml` (Datasource, JPA, Flyway, JWT, Swagger, Logging)
- [ ] P00-T004 — Configure Docker & Docker Compose
- [ ] P00-T005 — Create package structure
- [ ] P00-T006 — Configure Git Ignore
- [ ] P00-T007 — Configure Lombok
- [ ] P00-T008 — Configure MapStruct

---

# Section 2 — Common Infrastructure

- [ ] P00-T009 — Create BaseEntity
- [ ] P00-T010 — Create ApiResponse<T>
- [ ] P00-T011 — Create GlobalExceptionHandler
- [ ] P00-T012 — Create Base Exceptions
- [ ] P00-T013 — Create Common Constants
- [ ] P00-T014 — Create Common Utility Classes
- [ ] P00-T015 — Create Common Enums
- [ ] P00-T016 — Configure ObjectMapper

---

# Section 3 — PostgreSQL

- [ ] P00-T017 — Configure PostgreSQL 17
- [ ] P00-T018 — Create Database (`mobile_shop_erp`)
- [ ] P00-T019 — Configure Database User
- [ ] P00-T020 — Verify Database Connection

---

# Section 4 — Flyway

- [ ] P00-T021 — Configure Flyway
- [ ] P00-T022 — Verify Flyway Migration
- [ ] P00-T023 — Create Migration Naming Convention

### Database Migration Plan (Locked)

- [ ] P00-T024 — `V1__foundation.sql`
- [ ] P00-T025 — `V2__authentication.sql`
- [ ] P00-T026 — `V3__product.sql`
- [ ] P00-T027 — `V4__business.sql`
- [ ] P00-T028 — `V5__purchase.sql`
- [ ] P00-T029 — `V6__inventory.sql`
- [ ] P00-T030 — `V7__sales.sql`
- [ ] P00-T031 — `V8__service.sql`
- [ ] P00-T032 — `V9__reports.sql`
- [ ] P00-T033 — `V10__future.sql`

---

# Section 5 — UUID & Audit Verification

- [ ] P00-T034 — Verify UUID strategy for all business tables
- [ ] P00-T035 — Verify BIGINT Identity strategy for master tables
- [ ] P00-T036 — Verify audit columns

Audit Columns

- created_at
- updated_at
- created_by
- updated_by
- deleted_at

- [ ] P00-T037 — Verify Soft Delete strategy

---

# Section 6 — Docker

- [ ] P00-T038 — PostgreSQL Container
- [ ] P00-T039 — pgAdmin Container
- [ ] P00-T040 — Docker Compose Verification

---

# Section 7 — Swagger

- [ ] P00-T041 — Configure SpringDoc OpenAPI
- [ ] P00-T042 — Verify Swagger UI

---

# Section 8 — Security Foundation

- [ ] P00-T043 — Configure Spring Security
- [ ] P00-T044 — Disable Default Login
- [ ] P00-T045 — Create JWT Infrastructure
- [ ] P00-T046 — Configure Password Encoder

---

# Section 9 — Logging

- [ ] P00-T047 — Configure SLF4J
- [ ] P00-T048 — Configure Logback
- [ ] P00-T049 — Configure Log Levels

---

# Section 10 — Project Verification

- [ ] P00-T050 — Verify Project Builds Successfully
- [ ] P00-T051 — Verify Docker Starts Successfully
- [ ] P00-T052 — Verify PostgreSQL Connectivity
- [ ] P00-T053 — Verify Flyway Migrations
- [ ] P00-T054 — Verify Swagger Documentation
- [ ] P00-T055 — Verify Common Infrastructure

---

# Exit Criteria

- [ ] Spring Boot application starts successfully
- [ ] Docker Compose starts without errors
- [ ] PostgreSQL database `mobile_shop_erp` is connected
- [ ] Flyway executes all migrations successfully
- [ ] Swagger UI is accessible
- [ ] BaseEntity is available
- [ ] ApiResponse<T> is implemented
- [ ] GlobalExceptionHandler is configured
- [ ] UUID strategy verified
- [ ] Audit columns verified
- [ ] Soft Delete strategy verified
- [ ] Project is ready for Phase 1

---

## Notes

- Do not create any business entities in this phase.
- Do not implement authentication logic in this phase.
- Do not generate business modules.
- Focus only on project foundation and shared infrastructure.
- **Total Tables (project):** 26 — locked.
- This phase must be completed before starting **Phase 1 — Authentication**.
