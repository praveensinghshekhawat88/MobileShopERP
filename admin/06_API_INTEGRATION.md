# 06_API_INTEGRATION.md

# Mobile Shop ERP - API Integration Standards

Version: 1.1

Status: LOCKED

Policy owner: 01_AGENTS.md. Exact backend contract (DTOs, error codes, pagination params): see BACKEND_API_CONTRACT.md — not repeated in full here.

---

# Purpose

This document defines how the React Admin Panel communicates with the Spring Boot backend.

All API communication MUST follow these standards.

---

# Backend

Framework

Spring Boot 3.5

Base URL

/api/v1

Authentication

JWT (access + refresh tokens returned in the login/refresh JSON response body — backend does not set cookies)

Response Format

JSON (`ApiResponse<T>` envelope — see BACKEND_API_CONTRACT.md)

---

# Environment Variables

.env

VITE_API_BASE_URL=http://localhost:8081/api/v1

Never hardcode API URLs.

---

# Axios Architecture

UI → React Query → Service Layer → Axios Client → Backend

Pages never call Axios directly.

---

# Axios Instance

Create only one axios instance.

Location

src/config/axios.ts

Responsibilities

Base URL, Headers, Timeout, JWT attach, Refresh Token, Retry Logic, Interceptors.

Never create multiple Axios instances.

---

# Request Flow

Page → Hook → Service → Axios → Spring Boot

---

# Response Flow

Spring Boot → Axios → Service → React Query → Page → Component

---

# Standard Response

Every API returns an `ApiResponse<T>` envelope:

success, message, data, errorCode, timestamp, path

`errorCode` is present only on error responses. `data` is omitted (null) when not applicable.

Frontend must never assume a different response structure.

Exact JSON shape and field types: see BACKEND_API_CONTRACT.md.

---

# Error Response

Errors use the same `ApiResponse<T>` envelope as success responses (no separate error shape):

success: false, message, data (null, or a field→message map for validation errors), errorCode, timestamp, path

Error Codes (locked backend enum): `VALIDATION_FAILED` (400), `RESOURCE_NOT_FOUND` (404), `BUSINESS_RULE_VIOLATION` (400), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `CONFLICT` (409), `INTERNAL_ERROR` (500).

Validation Errors return HTTP 400 (not 422) with `errorCode: VALIDATION_FAILED` and `data` containing a `{ field: message }` map.

Always map backend errors to UI using `errorCode`, never by parsing `message` text.

---

# Authentication Flow

Login → Access Token + Refresh Token (both in the same JSON response body) → Redux → Axios → Protected APIs

Refresh tokens must never be sent as a Bearer access token — the backend rejects this.

Request/response DTOs: see BACKEND_API_CONTRACT.md.

---

# Token Storage

Access Token

Memory / Secure Storage

Refresh Token

Memory / Secure Storage (the backend returns both tokens in the response body — there is no httpOnly cookie mechanism to rely on)

Never expose tokens.

Never log tokens.

---

# Refresh Flow

API Call → 401 → Call `/auth/refresh` with the stored refresh token → New Access Token + New Refresh Token → Retry Original Request → Success

If Refresh fails → Logout → Redirect Login

---

# HTTP Methods

GET — Read

POST — Create

PUT — Replace / dedicated status-change endpoints (e.g. stock status)

PATCH — Partial Update

DELETE — Soft Delete

Never misuse HTTP methods.

---

# Query Parameters

Server Side Pagination, Sorting, Filtering, Searching — backend uses Spring `Pageable` binding.

Example

```
GET /api/v1/products?page=0&size=20&sort=name,asc
```

`page` is 0-based (first page is `page=0`, not `page=1`).

`sort` combines field and direction in one parameter: `sort=field,asc` or `sort=field,desc`. There is no separate `direction` parameter.

Filter/search parameters are resource-specific query params (e.g. `mobile=`, `name=`) — there is no single generic `search=` parameter across all list endpoints.

Full per-endpoint parameter list: see BACKEND_API_CONTRACT.md.

---

# Pagination

Backend controls Current Page, Page Size, Total Elements, Total Pages (standard Spring `Page<T>` JSON shape).

Never paginate locally.

---

# Sorting

Always server-side, using the `sort=field,direction` convention above.

---

# Filtering

Server-side only, using resource-specific query params. Filters should be reusable at the component level.

---

# Searching

Debounced, server-side, using the specific query param each endpoint documents (see BACKEND_API_CONTRACT.md).

---

# File Upload

Multipart, Progress, Preview, Validation, Image Compression (future).

---

# Download APIs

PDF, Excel, CSV — **future enhancement**. No backend export/download endpoint exists in the frozen backend today. Do not build against an assumed export API; see 04_TASKS.md Phase 09.

---

# Timeout

Global Timeout

30 seconds

Handle timeout gracefully.

---

# Retry Policy

Network Failure — Retry once

401 — Refresh Flow

500 — No retry

Validation Errors (400) — No retry

---

# API Versioning

Use /api/v1

Never hardcode versions elsewhere.

---

# Service Layer

Each module has service/ (inside `modules/<module>/services/` — see 01_AGENTS.md § Module Structure)

Example

productService.ts

customerService.ts

purchaseService.ts

Only services communicate with backend.

---

# DTO Mapping

Backend DTO → Frontend Model

Never expose backend DTO directly to UI.

---

# React Query

Queries — Lists, Details

Mutations — CRUD

Cache — Invalidate after mutation

---

# Error Handling

401 — Logout

403 — Forbidden

404 — Not Found

400 (VALIDATION_FAILED) — Validation

500 — Server Error

Timeout — Retry Option

---

# Offline

Future Enhancement

No offline implementation now.

---

# Logging

Never log JWT, Passwords, Sensitive Data.

Only log errors during development.

---

# API Freeze

Locked

Axios, JWT, Refresh Token, Response Format, Pagination, Filtering, Searching, Error Handling, Service Layer.

No changes without approval.

---

END OF 06_API_INTEGRATION.md
