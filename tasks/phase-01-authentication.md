# Phase 1 — Authentication Module

**Status:** ⬜ Pending

**Master Roadmap:** [TASKS.md](../TASKS.md)

**Task ID Format:** `P01-Txxx`

**Depends on:** [phase-00-foundation.md](./phase-00-foundation.md)

**Flyway Migration:** `V2__authentication.sql`

---

## Status Legend

⬜ Pending | 🟨 In Progress | 🟩 Completed | 🟥 Blocked

---

## Goal

Implement roles, users, settings, JWT authentication, and secured API access.

---

## Tables (3)

- `roles`
- `users`
- `settings`

---

## Tasks

### Role

- [ ] P01-T001 — Role Entity
- [ ] P01-T002 — Role Repository
- [ ] P01-T003 — Role DTO
- [ ] P01-T004 — Role Mapper
- [ ] P01-T005 — Role Service
- [ ] P01-T006 — Role Controller
- [ ] P01-T007 — Role Exception
- [ ] P01-T008 — Role Unit Tests

### User

- [ ] P01-T009 — User Entity
- [ ] P01-T010 — User Repository
- [ ] P01-T011 — User DTO (`UserDto`, `CreateUserRequest`, `UpdateUserRequest`)
- [ ] P01-T012 — User Mapper
- [ ] P01-T013 — User Service
- [ ] P01-T014 — User Controller
- [ ] P01-T015 — User Exception
- [ ] P01-T016 — User Unit Tests

### Auth & Security

- [ ] P01-T017 — Configure Spring Security (permit auth endpoints, secure rest)
- [ ] P01-T018 — Create `JwtUtil` (generate, validate, extract claims)
- [ ] P01-T019 — Create `JwtAuthenticationFilter`
- [ ] P01-T020 — AuthController (login, refresh token)
- [ ] P01-T021 — AuthService (authenticate, generateToken, refreshToken)
- [ ] P01-T022 — Auth Integration Test

### Settings

- [ ] P01-T023 — Settings Entity
- [ ] P01-T024 — Settings Repository
- [ ] P01-T025 — Settings DTO + Mapper
- [ ] P01-T026 — Settings Service
- [ ] P01-T027 — Settings Controller

---

## Exit Criteria

- [ ] Login and refresh token endpoints work
- [ ] Protected endpoints require valid JWT
- [ ] Role CRUD and User CRUD are functional
- [ ] Settings API is functional

---

## Notes

Generate one layer at a time. Do not proceed to Phase 2 until this phase is complete.
