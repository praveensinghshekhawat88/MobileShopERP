# TESTING.md

# Mobile Shop ERP — React Admin Panel Testing Strategy

Version: 1.0

Status: LOCKED

Policy owner: 01_AGENTS.md § Testing Rules references this document for detail. Coding-standard testing expectations in 07_CODING_STANDARDS.md also reference this document.

---

# Purpose

This document defines the testing stack, folder conventions, and required coverage for the React Admin Panel. It exists because no testing document existed prior to this hardening pass, despite `01_AGENTS.md`, `07_CODING_STANDARDS.md`, and `09_PERFORMANCE.md` all requiring tests.

---

# Testing Stack

| Layer | Tool |
|---|---|
| Unit / Component | Vitest + React Testing Library |
| Hooks | Vitest + `@testing-library/react` `renderHook` |
| API mocking | MSW (Mock Service Worker) |
| End-to-End | Playwright |
| Type checking (part of CI) | `tsc --noEmit` |
| Lint (part of CI) | ESLint |

Do not introduce Jest, Cypress, or Enzyme — the stack above is locked to avoid tooling fragmentation.

---

# Folder Convention

Tests live next to the code they test, using the `.test.ts` / `.test.tsx` suffix:

```
modules/product/
├── components/
│   ├── ProductTable.tsx
│   └── ProductTable.test.tsx
├── hooks/
│   ├── useProducts.ts
│   └── useProducts.test.ts
├── services/
│   ├── productService.ts
│   └── productService.test.ts
```

End-to-end tests live in a top-level `e2e/` folder, one spec file per critical flow (e.g. `e2e/auth-login.spec.ts`, `e2e/purchase-to-stock.spec.ts`).

---

# What Must Be Tested Per Module

Every module (see `01_AGENTS.md` § Module Structure) must have:

1. **Service tests** — mock Axios/MSW responses, assert correct request shape (URL, method, params) and correct DTO mapping of the response.
2. **Hook tests** — assert React Query hooks expose the correct loading/success/error states and call the right service function.
3. **Component tests** — for components with logic (forms, tables with actions), assert rendering, user interaction, and validation error display.
4. **Critical flow E2E test** — one Playwright spec per module covering create → list → edit → delete (or the module's equivalent core flow).

Pure presentational components with no logic are exempt from mandatory unit tests but must still render without throwing (a minimal smoke test is sufficient).

---

# Priority Order for Test Coverage

Aligned with `04_TASKS.md` phase order — write tests as each phase is implemented, not retroactively:

1. Authentication (login, refresh, logout, protected route redirect, role-based navigation) — **done** (`authValidation`, `authService`, `ProtectedRoute`, `LoginPage`, `e2e/auth-login.spec.ts`)
2. Purchase → Stock flow — **done** (`receivePurchaseValidation`, `purchaseService`, `useReceivePurchase`, `ReceivePurchaseDialog`, `e2e/purchase-to-stock.spec.ts`)
3. Sales → Payment → Warranty flow — **done** (`paymentValidation`, `warrantyValidation`, `saleService`, `paymentService`, `warrantyService`, mutation hooks, `PaymentFormDialog`, `WarrantyFormDialog`, `e2e/sale-payment-warranty.spec.ts`)
4. Inventory (stock status transitions via the dedicated status endpoint) — **done** (`stockStatusValidation`, `stockService`, `useUpdateStockStatus`, `StockStatusFormDialog`, `e2e/stock-status-transition.spec.ts`)

These four flows are the frontend equivalent of the backend's own hardened integration test suite (`EnterpriseIntegrationTest`) and must be covered by E2E tests before any release build.

---

# API Mocking Rules

Use MSW handlers that mirror the actual `ApiResponse<T>` envelope and error codes defined in `BACKEND_API_CONTRACT.md`. Never mock a response shape that the backend does not actually return (e.g. do not mock a bare array when the backend returns `{ success, message, data, ... }`).

---

# Validation Testing

Every form must have a test asserting that:

- Client-side Zod validation blocks submission with an invalid value.
- A `VALIDATION_FAILED` (400) response from the backend is mapped to the correct field-level error message (see `BACKEND_API_CONTRACT.md` § Validation Error Shape).

---

# CI Gate

A pull request cannot merge unless:

✓ `npm run build` passes

✓ `tsc --noEmit` passes

✓ ESLint passes with zero errors

✓ All unit/component/hook tests pass

✓ E2E suite passes for any flow touched by the change

---

# Out of Scope (for now)

Visual regression testing and load/performance testing are not part of this phase. They may be added in Phase 11 (Production Readiness, see `04_TASKS.md`) if approved.

---

END OF TESTING.md
