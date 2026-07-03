# 04_TASKS.md

# Mobile Shop ERP - React Admin Tasks

Version: 1.1

Status: LOCKED

Policy owner: 01_AGENTS.md. This document is the implementation roadmap only.

---

# Purpose

This document defines the complete implementation roadmap of the React Admin Panel.

Every task must be completed sequentially.

Do not skip phases.

Do not start a new phase before completing the current phase.

Tasks marked **[Backend Pending]** depend on a backend API that does not exist yet as of the frozen backend (Phases 0–8). Do not implement the UI against an assumed API — wait for the backend endpoint or implement a reduced scope as noted. See BACKEND_API_CONTRACT.md for what currently exists.

---

# Task ID Format

Global format

Pxx-Txxx

Example

P00-T001

P00-T002

P01-T001

P02-T001

Task IDs must never be duplicated.

---

# Development Workflow

Task → Code → Review → Build → Test → Commit → Next Task

Never skip review.

---

# Phase 00

Foundation

Status

Completed

Tasks

P00-T001 — Create React Project

P00-T002 — Configure Vite

P00-T003 — Configure TypeScript

P00-T004 — Install Material UI

P00-T005 — Configure Theme

P00-T006 — Configure React Router

P00-T007 — Configure Redux Toolkit

P00-T008 — Configure React Query

P00-T009 — Configure Axios

P00-T010 — Environment Configuration

P00-T011 — Protected Routes

P00-T012 — Authentication Layout

P00-T013 — Admin Layout

P00-T014 — Sidebar

P00-T015 — Topbar

P00-T016 — Footer

P00-T017 — Login Page

P00-T018 — Dashboard Placeholder

P00-T019 — Error Boundary

P00-T020 — 404 Page

P00-T021 — Forbidden Page

P00-T022 — Unauthorized Page

P00-T023 — Reusable Dialog

P00-T024 — Reusable Table

P00-T025 — Reusable Form

P00-T026 — Reusable Inputs

P00-T027 — Loading Components

P00-T028 — Toast Configuration

P00-T029 — ESLint

P00-T030 — Prettier

P00-T031 — Project Build Validation

Exit Criteria

✔ npm install

✔ npm run dev

✔ npm run build

✔ No TypeScript Errors

✔ No ESLint Errors

---

# Phase 01

Authentication

Status

Completed

Tasks

P01-T001 — JWT Login

P01-T002 — Refresh Token

P01-T003 — Logout

P01-T004 — Forgot Password UI **[Backend Pending — no forgot-password endpoint exists in the frozen backend]**

P01-T005 — Profile Page

P01-T006 — Role Based Navigation (ADMIN / STAFF only — see BACKEND_API_CONTRACT.md)

P01-T007 — Role Based UI *(renamed from "Permission Based UI" — backend exposes role only, no granular permission matrix; see 01_AGENTS.md § Role & Permission Rules)*

Exit Criteria

Login Flow Complete

---

# Phase 02

Dashboard

Status

Completed

Tasks

P02-T001 — Statistics Cards

P02-T002 — Sales Chart *(reduced scope — backend exposes only single-range aggregate summaries via `SalesReportSummaryDto`, no day-wise bucketed endpoint; implemented as a "this week vs last week" comparison chart using two existing `/reports/sales/summary` calls instead of one call per day, which would violate 09_PERFORMANCE.md's "Avoid Repeated Queries" rule — see `PeriodComparisonChart`)*

P02-T003 — Revenue Chart *(reduced scope — same backend limitation as above; implemented as a "this month vs last month" `netProfit` comparison using two existing `/reports/profit/summary` calls — see `PeriodComparisonChart`)*

P02-T004 — Recent Sales

P02-T005 — Recent Purchases

P02-T006 — Low Stock

P02-T007 — Quick Actions *(target create screens don't exist until their own module phase ships — Sale/Purchase/Customer/Product/Expense creation — so actions render disabled with an explanatory tooltip rather than routing to a non-existent screen)*

Exit Criteria

Dashboard Fully Functional

---

# Phase 03

Masters

Status

Completed

Tasks

P03-T001 — Brand Module

P03-T002 — Category Module *(self-referencing hierarchy — see AGENTS.md § Category Rule; the flat paginated table resolves "Parent" via the active category tree since `GET /categories` only returns `parentId`, and the parent picker excludes the category itself plus its descendants client-side to pre-empt `CircularCategoryReferenceException`)*

P03-T003 — Attribute Group *(hard delete — no `active` field on this master, matching `AttributeGroupService#delete`)*

P03-T004 — Attributes *(hard delete — no `active` field on this master, matching `AttributeService#delete`; supports filtering by attribute group via `GET /attributes?attributeGroupId=`)*

P03-T005 — Attribute Values *(soft deactivate; supports filtering by attribute via `GET /attribute-values?attributeId=`; the attribute picker is create-only since `UpdateAttributeValueRequest` does not accept `attributeId`)*

Note: P03-T003/T004/T005 are combined into a single tabbed `modules/attribute` page ("Attribute Groups" / "Attributes" / "Attribute Values" tabs) rather than three separate sidebar entries — 01_AGENTS.md § Module Structure lists one `attribute` module, not three, since the three masters form a single hierarchical workflow (AGENTS.md § Attribute Engine).

Note: Brand/Category list screens have no search box. 05_UI_STANDARDS.md § Tables lists "Searching" as a standard table feature, but `BrandController`/`CategoryController` expose no search/name query parameter (see BACKEND_API_CONTRACT.md) — client-side filtering was rejected since it would only filter the current page's 20 rows, not the full server-side dataset, silently misleading the user. Sorting and server-side pagination are fully implemented for every Masters table.

Exit Criteria

Master Data Complete

---

# Phase 04

Product

Status

Completed

Tasks

P04-T001 — Product CRUD *(paginated/sortable list filterable by `brandId`/`categoryId`; create/edit dialog; soft deactivate + soft delete — `ProductController` exposes both `PATCH /deactivate` and `DELETE`, unlike the Phase 03 masters)*

P04-T002 — Variant CRUD *(same deactivate+delete pattern as Product; SKU/barcode uniqueness enforced server-side; no IMEI/price/image fields on the variant itself — see AGENTS.md § Product Structure)*

P04-T003 — Images *(nested under a Variant detail tab; `GET /variants/{id}/images` returns a plain non-paginated list ordered `displayOrder ASC`, so the table paginates that list client-side; no `isPrimary` flag exists — lowest `displayOrder` is documented as the de facto lead image)*

P04-T004 — Price History *(nested under a Variant detail tab; append-only — only `GET`/`POST` exist, matching AGENTS.md § Product Price Rule: "Never overwrite prices. Always create new record."; creating a new active RETAIL price auto-closes the previous one server-side)*

P04-T005 — Dynamic Attributes *(nested under a Variant detail tab; assign one attribute value at a time via `POST /variant-attributes` and remove via `DELETE /variant-attributes/{id}`; the bulk `PUT /variant-attributes/replace` endpoint was intentionally not wired up — single add/remove fully covers the CRUD requirement with a simpler, safer UI)*

Note: Product/Variant/Image/Price/Attributes are one `modules/product` module (not five) per 01_AGENTS.md § Module Structure. The screen flow is a master-detail drill-down: `/products` (list) → `/products/:productId` (Product fields + Variants table) → `/products/:productId/variants/:variantId` (Variant fields + Images/Price History/Attributes tabs, mirroring the Phase 03 tabbed-page pattern for a single hierarchical workflow).

Note: Product list has no search box, same rationale as Phase 03 Brand/Category — `GET /products` exposes only `brandId`/`categoryId` filters (see BACKEND_API_CONTRACT.md), which double as the list's filter controls.

Exit Criteria

Product Management Complete

---

# Phase 05

Business

Status

Completed

Tasks

P05-T001 — Customer Module *(paginated/sortable list; server-side search by `name`/`mobile` debounced 300ms per 09_PERFORMANCE.md — `mobile` search takes priority over `name` when both are supplied, matching `CustomerService#findAll`; soft delete only — no `active`/deactivate field on this entity; Create/Edit available to ADMIN and STAFF, Delete is `hasRole('ADMIN')` only)*

P05-T002 — Supplier Module *(same shape as Customer plus a `contactPerson` field; every mutating action — create/update/delete — is `hasRole('ADMIN')` only per `SupplierController`, so STAFF get read-only list/search access)*

Note: Customer/Supplier are two top-level sibling modules (`modules/customer`, `modules/supplier`) per 01_AGENTS.md § Module Structure, not nested under a single `business` module — each has its own full vertical slice (api/types/services/validation/hooks/components/pages).

Note: Mobile number and GST number client-side validation mirror the backend's imperative checks exactly (`MobileValidator`: `^[6-9]\d{9}$`; `GstValidator`: 15-char GSTIN pattern, both from `common/validation/`) since neither is expressed as a Jakarta Bean Validation annotation on the DTOs — see BACKEND_API_CONTRACT.md.

Note: **Known backend defect (not fixed — awaiting approval per AGENTS.md § Modification Rules):** a soft-deleted business record (`DELETE /customers/{id}`, `/suppliers/{id}`, `/products/{id}`, etc. — any entity extending `BaseAuditableEntity`) still returns `200 OK` with its data on a subsequent `GET /{resource}/{id}`, instead of `404 RESOURCE_NOT_FOUND`. Root cause: Hibernate's `@SQLRestriction("deleted_at IS NULL")` on `BaseAuditableEntity` is applied to derived-query repository methods (`findAllByOrderBy...`, `findByNameContaining...`) but **not** to `JpaRepository#findById` (which compiles to `EntityManager.find()`, a primary-key lookup that bypasses the restriction in Hibernate 6). Confirmed reproducible on both `Customer` and `Product` via direct API calls against the Docker backend — this is systemic across every soft-deleted entity, not specific to this phase's modules. List screens are unaffected (their queries correctly exclude soft-deleted rows), but any direct `GET /{resource}/{id}` for a deleted record — e.g. a bookmarked Product/Variant detail URL — is affected. Flagged for backend team decision; no backend code was modified.

Exit Criteria

Business Module Complete

---

# Phase 06

Purchase & Inventory

Status

Completed

Tasks

P06-T001 — Purchase *(paginated/sortable list filterable by `supplierId`; master-detail drill-down `/purchases` → `/purchases/:purchaseId`; create/edit/receive/cancel are ADMIN-only; no DELETE endpoint — cancel is the lifecycle terminal action; `received` state inferred client-side via `GET /stock-movements?referenceType=PURCHASE&referenceId=` since `PurchaseResponse` exposes no received flag)*

P06-T002 — Purchase Items *(nested on Purchase detail; full non-paginated list from backend — table paginates client-side; item add/edit/delete blocked in UI after receive since backend does not enforce this)*

P06-T003 — Stock *(paginated list filterable by `variantId`/`status`; detail at `/stock/:stockId`; metadata update via `PUT /stock/{id}` — IMEI/serial only)*

P06-T004 — Stock Movement *(global audit list at `/stock-movements` with filters for `stockId`, paired `referenceType`+`referenceId`, and optional `from`/`to` date range; per-stock movement history also shown on Stock detail)*

P06-T005 — Stock Status *(dedicated `PUT /stock/{id}/status` dialog with allowed transitions from `StockStatusService`; status cannot be changed via metadata update — see BACKEND_API_CONTRACT.md)*

Note: Purchase and Inventory are two top-level sibling modules (`modules/purchase`, `modules/inventory`) per 01_AGENTS.md § Module Structure. Receive dialog sends every line item; IMEIs optional per line (all blank = accessory stock, all filled = serialized with count matching quantity). Client-side IMEI validation uses `^\d{15}$` (recommended on receive; backend enforces fully only on metadata update).

Note: Added `useSupplierOptions` (supplier module) and `useProductVariantOptions` (product module) to support Purchase/Stock pickers.

Exit Criteria

Inventory Complete

---

# Phase 07

Sales

Status

Completed

Tasks

P07-T001 — Sales *(paginated/sortable list filterable by `customerId`; master-detail drill-down `/sales` → `/sales/:saleId`; create/finalize available to ADMIN+STAFF; update header and cancel are ADMIN-only; no DELETE endpoint — cancel is the lifecycle terminal action; `finalized` state inferred client-side via `GET /stock-movements?movementType=SALE&referenceType=SALE&referenceId=` since `SaleResponse` exposes no status flag)*

P07-T002 — Sale Items *(nested on Sale detail; full non-paginated list from backend — table paginates client-side; item add/edit/delete blocked in UI after finalize since backend does not enforce this)*

P07-T003 — Payments *(generic `payments` table via `referenceType=SALE`; balance from `GET /payments/balance`; record payment when pending balance > 0; optional initial payment at finalize via `FinalizeSaleRequest.initialPayment`)*

P07-T004 — Invoice *(read-only invoice view at `/sales/:saleId/invoice` composed from Sale + Customer + Settings + line items + payments; browser print only — no backend PDF endpoint)*

Note: Added `useCustomerOptions` (customer module) and `useAvailableStockOptions` (inventory module) to support Sale pickers. Cancel blocked in UI when `paymentStatus === PAID` (backend enforces).

Exit Criteria

Sales Flow Complete

---

# Phase 08

Service

Status

Completed

Tasks

P08-T001 — Repair *(paginated list filterable by `customerId`/`status`; master-detail `/repairs` → `/repairs/:repairId`; create/edit/status for ADMIN+STAFF; no DELETE endpoint — repair history is append-only; terminal statuses DELIVERED/CANCELLED block edits; status transitions enforced client-side via `ALLOWED_REPAIR_TRANSITIONS` matching `RepairService`; optional stock link for inventory devices or external device when stock omitted; repair payments via generic `payments` with `referenceType=REPAIR` when `actualCost` is set)*

P08-T002 — Warranty *(paginated list; create via sale + sale-item picker; claim via `POST /warranties/{id}/claim` when ACTIVE and not expired; no update/delete API; one warranty per sale item)*

P08-T003 — Expense *(paginated list with optional `from`/`to` date range — both required together; create/edit/delete ADMIN-only per `ExpenseController`; STAFF read-only; soft delete via DELETE; Phase-1 has no expense categories)*

Note: Repair, Warranty, and Expense are three top-level sibling modules per 01_AGENTS.md § Module Structure. Added `useRepairStockOptions` (inventory) and `useSaleOptions` (sale) for pickers.

Exit Criteria

Service Module Complete

---

# Phase 09

Reports

Status

Completed

Tasks

P09-T001 — Sales Reports *(summary + detail list + by-customer aggregation at `/reports/sales`; date range required)*

P09-T002 — Purchase Reports *(summary + detail list + by-supplier aggregation at `/reports/purchases`)*

P09-T003 — Inventory Reports *(tabbed page: stock snapshot, low stock, movements, IMEI lookup at `/reports/inventory`)*

P09-T004 — Customer Reports *(top customers list + drill-down history at `/reports/customers/:customerId`)*

P09-T005 — Supplier Reports *(spend summary list + drill-down at `/reports/suppliers/:supplierId`)*

P09-T006 — Repair Reports *(summary with open-by-status breakdown + filterable list at `/reports/repairs`)*

P09-T007 — Warranty Reports *(summary counts + filterable list at `/reports/warranty`)*

P09-T008 — Expense Reports *(summary buckets DAY/MONTH + detail list at `/reports/expenses`)*

P09-T009 — Profit & Loss Report *(summary-only KPI cards at `/reports/profit`)*

Note: Single `report` module per 01_AGENTS.md § Module Structure. Hub at `/reports` links to all sub-reports. Screen-only — no PDF/Excel/CSV export (backend has no export endpoints). Reuses existing dashboard report endpoints where applicable; dedicated `reportService` covers all `/api/v1/reports/*` read APIs.

Exit Criteria

Reports Complete

---

# Phase 10

Settings

Status

Completed

Tasks

P10-T001 — Users *(paginated list at `/users` with create/edit/delete; ADMIN-only route via `RequireRole`; default sort `createdAt,desc`; cannot delete own account)*

P10-T002 — Roles *(read-only active role list at `/roles`; no role CRUD in UI — backend `RoleController` supports mutations but task scope is display-only)*

P10-T003 — Permissions **[Backend Pending — no permission-matrix endpoint exists; backend is role-based only. Do not build a granular permission editor against a non-existent API]**

P10-T004 — Application Settings *(singleton shop settings at `/shop-settings`; GET for ADMIN+STAFF, PUT for ADMIN; STAFF read-only form)*

P10-T005 — Profile Settings *(STAFF read-only from auth session; ADMIN editable profile via `PUT /users/{ownId}` — no dedicated profile endpoint)*

Note: Three new modules — `user`, `role`, and `settings` (settings started in Phase 07 for invoice, completed here). Sale invoice `useSettings` now re-exports from `@/modules/settings`. P10-T003 skipped per backend gap.

Exit Criteria

Settings Complete

---

# Phase 11

Production Readiness

Status

Completed

Tasks

P11-T001 — Responsive Testing *(mobile drawer sidebar, horizontal table scroll, wrapped pagination toolbar, main landmark with skip link — verified against 05_UI_STANDARDS.md breakpoints)*

P11-T002 — Performance Audit *(React Query defaults aligned with 09_PERFORMANCE.md; settings staleTime 30 min; all routes lazy-loaded)*

P11-T003 — Accessibility Audit *(skip-to-main link, `role="alert"` error boundary, sidebar `aria-label`, reduced-motion CSS, existing MUI focus/dialog traps retained)*

P11-T004 — SEO *(admin is internal — `noindex,nofollow`, description meta, theme-color, noscript fallback; dynamic `document.title` from `VITE_APP_NAME`)*

P11-T005 — Bundle Optimization *(Vite `manualChunks` splits react, MUI, icons, charts, pickers, query, redux, utils; production sourcemaps disabled)*

P11-T006 — Error Monitoring *(`reportClientError` utility + global handlers + ErrorBoundary integration; optional `VITE_ERROR_REPORT_URL` POST in production — Sentry can replace later)*

P11-T007 — Production Build *(`npm run verify` = typecheck + lint + build; `.env.production.example` added)*

P11-T008 — Final Review *(full admin panel Phases 00–11 complete; E2E/unit tests deferred per TESTING.md priority — run manually before release)*

Exit Criteria

Production Ready

---

# Golden Rules

Never implement multiple ERP modules together.

One Phase → One Review → One Merge → Next Phase

Always maintain production quality.

---

END OF 04_TASKS.md
