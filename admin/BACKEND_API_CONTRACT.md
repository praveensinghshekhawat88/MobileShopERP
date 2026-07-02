# BACKEND_API_CONTRACT.md

# Mobile Shop ERP — Frozen Backend API Contract

Version: 1.0

Status: LOCKED (reflects the actual, hardened backend implementation — Phases 0–8)

---

# Purpose

This document is the single source of truth for the backend contract the React Admin Panel is built against. It exists to remove any ambiguity or guessing in `01_AGENTS.md`, `02_PROJECT_CONTEXT.md`, `06_API_INTEGRATION.md`, and `08_SECURITY.md`.

If any frontend document conflicts with this file, this file wins, because it reflects the actual backend code (`GlobalExceptionHandler`, `ApiResponse`, `ErrorCode`, `JwtAuthenticationFilter`, `AuthController`, `Role` seed data).

This document does not define frontend behavior — see the numbered documents for that.

---

# Base URL

Development: `http://localhost:8081/api/v1`

Configured via `VITE_API_BASE_URL`. Never hardcode.

---

# Roles (Locked)

Only two roles are seeded in the database (`V2__authentication.sql`):

- `ADMIN`
- `STAFF`

There is no Manager, Sales, Inventory, Service, or Read-Only role. There is no granular per-action permission entity or API (no "Can View / Can Create / Can Update / Can Delete" matrix). Authorization is enforced purely by role via Spring Security `@PreAuthorize`.

`GET /api/v1/roles` exists for administrative role management (`RoleController`), but this manages the `roles` master table, not a permission matrix.

---

# `ApiResponse<T>` Envelope

Every endpoint — success or error — returns the same envelope shape:

```json
{
  "success": true,
  "message": "string",
  "data": { },
  "errorCode": null,
  "timestamp": "2026-07-01T12:00:00Z",
  "path": "/api/v1/products"
}
```

- `success`: boolean
- `message`: human-readable summary
- `data`: the payload (object, array, or `Page<T>` — omitted/null on error unless it's a validation error, see below)
- `errorCode`: null on success, one of the locked error codes below on failure
- `timestamp`: ISO-8601 instant (UTC)
- `path`: the request URI

---

# Error Codes (Locked Enum)

| errorCode | HTTP Status | Meaning |
|---|---|---|
| `VALIDATION_FAILED` | 400 | Request body failed `@Valid` validation |
| `RESOURCE_NOT_FOUND` | 404 | Entity not found |
| `BUSINESS_RULE_VIOLATION` | 400 | Domain rule violated (e.g. invalid stock transition) |
| `UNAUTHORIZED` | 401 | Missing/invalid/expired JWT, or inactive/deleted user |
| `FORBIDDEN` | 403 | Authenticated but role not permitted |
| `CONFLICT` | 409 | Uniqueness violation (duplicate mobile, IMEI, invoice number, etc.) |
| `INTERNAL_ERROR` | 500 | Unhandled exception |

There is **no 422 status** anywhere in this backend. Validation failures are always HTTP **400** with `errorCode: VALIDATION_FAILED`.

## Validation Error Shape

For `@Valid` failures, `data` is a flat map of field name to message:

```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "mobile": "must not be blank",
    "password": "size must be between 1 and 100"
  },
  "errorCode": "VALIDATION_FAILED",
  "timestamp": "2026-07-01T12:00:00Z",
  "path": "/api/v1/auth/login"
}
```

---

# Authentication Endpoints

## `POST /api/v1/auth/login`

Request:

```json
{
  "mobile": "9876543210",
  "password": "string"
}
```

Response (`data`):

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "firstName": "string",
    "lastName": "string",
    "mobile": "string",
    "roleName": "ADMIN"
  }
}
```

Both tokens are returned in this single JSON body. The backend does **not** set any cookies (no `Set-Cookie` header). Frontend is fully responsible for storing both tokens (see `08_SECURITY.md` § Token Storage).

## `POST /api/v1/auth/refresh`

Request:

```json
{ "refreshToken": "string" }
```

Response: identical shape to `/auth/login` (new access + refresh token pair).

## Token usage rules

- Send the access token as `Authorization: Bearer <accessToken>` on every protected request.
- The refresh token must **only** ever be sent to `/auth/refresh`. Sending it as a Bearer token on any other endpoint is explicitly rejected by `JwtAuthenticationFilter` with `401 UNAUTHORIZED`.
- A user whose account is inactive or soft-deleted (`deletedAt` set) is rejected with `401 UNAUTHORIZED` even with a structurally valid token.

---

# Pagination (Spring `Pageable`)

All list endpoints that support pagination use Spring's standard `Pageable` query binding:

```
GET /api/v1/products?page=0&size=20&sort=name,asc
```

- `page` — **0-based**. First page is `page=0`.
- `size` — page size (backend default is Spring Boot's default of 20 unless a controller overrides it).
- `sort` — `field,direction` combined in one parameter (`asc` or `desc`). Repeatable for multi-field sort: `sort=name,asc&sort=createdAt,desc`.

There is **no** separate `direction` query parameter and no generic cross-resource `search=` parameter. Each resource exposes its own specific filter parameters (e.g. `CustomerController` supports mobile/name-based lookup params) — consult the relevant controller when building a module's list screen.

Response shape for paginated endpoints (`data` field of `ApiResponse`) is a standard Spring `Page<T>` JSON object: `content`, `totalElements`, `totalPages`, `number` (current page, 0-based), `size`, etc.

---

# CORS

Allowed origins are configured via `app.cors.allowed-origins` (default: `http://localhost:3000,http://localhost:8081`). Configured on the backend — the frontend must never attempt to work around CORS restrictions.

---

# What Does NOT Exist Yet

The following are referenced as future/roadmap items in `04_TASKS.md` but have **no backend endpoint today**. Do not build frontend code against an assumed API for these:

- Forgot password / password reset
- Granular permission matrix (beyond role-based `ADMIN`/`STAFF`)
- PDF / Excel / CSV export or download endpoints
- Invoice PDF generation

# What Does Exist (commonly missed)

- Profit & Loss report: `ProfitReportController`
- Warranty auto-creation on sale completion (`SaleCompletionService`)
- Dedicated stock status transition endpoint: `PUT /api/v1/stock/{id}/status` (separate from the metadata update `PUT /api/v1/stock/{id}`, which cannot change status)
- Generic payments API keyed by `referenceType`/`referenceId` (`SALE`, `PURCHASE`, `REPAIR`, `EXPENSE`) — there are no per-module payment endpoints
- Audit log read API (`AuditLogController`)

---

END OF BACKEND_API_CONTRACT.md
