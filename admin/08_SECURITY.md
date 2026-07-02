# 08_SECURITY.md

# Mobile Shop ERP - Frontend Security Standards

Version: 1.1

Status: LOCKED

Policy owner: 01_AGENTS.md. This document is the canonical source for security standards — not repeated in full elsewhere.

---

# Purpose

This document defines all frontend security standards.

Security is mandatory.

Convenience never overrides security.

---

# Security Principles

Zero Trust

Least Privilege

Defense in Depth

Secure by Default

Fail Secure

Never trust client input.

Backend is the source of truth.

---

# Authentication

JWT Authentication (access + refresh tokens, both returned in the login/refresh JSON response body)

Protected Routes

Role Based Access (ADMIN, STAFF — see 01_AGENTS.md § Role & Permission Rules)

Session Expiry Handling

---

# Token Storage

Access Token

Memory (Preferred)

Refresh Token

Memory / Secure Storage

The backend returns both tokens directly in the JSON response body — it does not set httpOnly cookies. Do not design around a cookie-based refresh flow that the backend does not implement.

If storage beyond memory is required (e.g. to survive a page refresh), use `sessionStorage`, never `localStorage`, and never store tokens unencrypted alongside other app data.

Never expose tokens.

Never print tokens.

Never log tokens.

---

# Login

Always use HTTPS in production.

Never cache login responses.

Disable browser autocomplete if required.

Clear password after submission.

---

# Logout

Clear Redux, React Query Cache, Storage, Session.

Redirect Login.

---

# Route Protection

Every private page must use ProtectedRoute.

Never expose protected pages.

Unauthorized users must never access routes directly.

---

# Role Rules

Role comes from the backend (`roleName`: ADMIN or STAFF).

Never hardcode a permission matrix — the backend does not expose one.

Hide UI / Disable Actions based on role only.

Backend `@PreAuthorize` re-validates every request; frontend role checks are UX only, never the security boundary.

---

# API Security

Always use Axios.

Always use interceptors.

Never bypass interceptor.

Always attach Authorization header (`Bearer <accessToken>`).

Never send the refresh token as a Bearer token — the backend explicitly rejects it.

Never hardcode JWT.

---

# XSS Protection

Never use dangerouslySetInnerHTML unless explicitly approved.

Escape dynamic HTML.

Sanitize user-generated content.

---

# CSRF

The API is stateless and authenticated via `Authorization: Bearer <token>` header, not cookies — CSRF tokens are not applicable to this authentication model.

If any future endpoint relies on cookies, a CSRF strategy must be added and approved at that time.

---

# Sensitive Data

Never display Passwords, Refresh Tokens, JWT, Secret Keys, OTP, or unnecessary internal IDs.

---

# Browser Storage

Never store Passwords, Secrets, API Keys, Sensitive customer data.

Prefer memory storage for tokens (see Token Storage above).

---

# File Upload

Validate Extension, MIME Type, File Size.

Preview.

Never trust filename.

Backend validates again.

---

# Download

Validate permissions.

Never expose direct file URLs.

Use authenticated download endpoints.

---

# Logging

Forbidden: console.log(jwt), console.log(password), console.log(user), any sensitive log.

Remove debug logs before production.

---

# Error Messages

Do not expose Stack traces, Database errors, Internal server details.

Show friendly messages, mapped from backend `errorCode` — see BACKEND_API_CONTRACT.md.

---

# Network Security

HTTPS only in production.

Reject mixed content.

Never call insecure HTTP APIs in production.

---

# Third Party Libraries

Only approved libraries.

Avoid abandoned packages.

Keep dependencies updated.

Run npm audit regularly.

---

# Dependency Security

Run npm audit before release.

Fix critical vulnerabilities.

Document accepted risks.

---

# CORS

Handled by backend (`app.cors.allowed-origins`).

Frontend must never attempt to bypass CORS.

---

# Environment Variables

Never commit .env

Use .env.example

No secrets inside repository.

---

# Input Validation

Frontend validates UX (Zod schemas).

Backend validates security (Jakarta Validation) — final authority.

Never rely only on frontend validation.

---

# Session Timeout

401 → Logout → Redirect Login

Show session expired message.

---

# Brute Force

Backend responsibility.

Frontend may throttle repeated submissions.

---

# Clickjacking

Handled through backend headers.

Frontend should not embed sensitive pages in iframes.

---

# Security Checklist

✓ JWT secure

✓ Protected Routes

✓ Role checks

✓ No sensitive logs

✓ HTTPS ready

✓ No hardcoded secrets

✓ Safe file upload

✓ Safe downloads

✓ Dependency audit

✓ No XSS

✓ No insecure storage

---

# Security Freeze

Authentication Flow, Token Handling, Role Rules, Route Protection, API Security cannot be changed without approval.

---

END OF 08_SECURITY.md
