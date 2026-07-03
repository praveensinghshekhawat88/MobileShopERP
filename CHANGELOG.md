# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Admin Frontend — Phase 00 (Foundation):** React 19 + TypeScript + Vite scaffold; Material UI theme; Redux Toolkit (auth/theme/settings slices); TanStack Query client; Axios instance with JWT refresh interceptor; protected routing shell (`AdminLayout`/`AuthLayout`, Sidebar, Topbar, Footer); reusable `DataTable`, `Form`, form inputs, dialogs, loading/empty/error states; ESLint + Prettier
- **Admin Frontend — Phase 01 (Authentication):** JWT login, silent session-bootstrap refresh, client-side logout, role-based navigation/route guarding (`RequireRole`), read-only Profile page, reduced-scope Forgot Password UI (no backend endpoint yet)
- **Admin Frontend — Phase 02 (Dashboard):** Statistics cards (Sales Today, Purchases Today, Net Profit MTD, Low Stock count), reduced-scope period-comparison charts for Sales and Revenue (backend has no day-wise report endpoint — see `admin/04_TASKS.md` P02-T002/T003), Recent Sales / Recent Purchases widgets, Low Stock preview table, Quick Actions (disabled pending their owning modules); `@mui/x-charts` added and lazy-loaded per 09_PERFORMANCE.md
- **Admin Frontend — Phase 03 (Masters):** Brand and self-referencing Category modules (paginated/sortable list, create/edit dialog, soft deactivate); combined `attribute` module covering Attribute Group (hard delete), Attribute (hard delete, filterable by group), and Attribute Value (soft deactivate, filterable by attribute, displayOrder) in a single tabbed page per 01_AGENTS.md § Module Structure; Category parent picker built from `GET /categories/tree` with client-side circular-reference guarding; three new sidebar entries (list/read available to ADMIN+STAFF, create/edit/delete restricted to ADMIN via `useAuth().isAdmin`); no search box on Brand/Category lists (backend exposes no search query param — see `admin/04_TASKS.md` Phase 03 notes)
- **Admin Frontend — Phase 04 (Product):** Single `product` module covering Product, Variant, Image, Price History, and Dynamic Attributes as a master-detail drill-down (`/products` → `/products/:productId` → `/products/:productId/variants/:variantId`, the latter using the Phase 03 tabbed-page pattern for Images/Price History/Attributes); Product and Variant support both soft deactivate and soft delete (`ProductController`/`ProductVariantController` expose both `PATCH /deactivate` and `DELETE`); Price History is append-only (create-only dialog, no edit/delete, matching AGENTS.md § Product Price Rule); Dynamic Attributes assign/remove one attribute value at a time (`POST`/`DELETE /variant-attributes`), reusing the Phase 03 Attribute module's pickers; Product list filters by Brand/Category (no search query param on `GET /products`, same rationale as Phase 03 Masters); new `useBrandOptions` (brand module) and `useAttributeValueOptions` (attribute module) hooks added to support the Product/Variant pickers; new sidebar entry (list/read available to ADMIN+STAFF, create/edit/deactivate/delete restricted to ADMIN)
- **Admin Frontend — Phase 06 (Purchase & Inventory):** Two new modules — `purchase` (list/detail with line items, receive dialog with per-line IMEI capture, cancel) and `inventory` (Stock list/detail with metadata + dedicated status transition dialogs, global Stock Movements audit list); master-detail drill-down for purchases (`/purchases` → `/purchases/:purchaseId`); stock detail at `/stock/:stockId`; receive/cancel and all stock mutations are ADMIN-only; `received` state inferred from PURCHASE stock-movements since `PurchaseResponse` has no flag; three new sidebar entries (Purchases, Stock, Stock Movements); `useSupplierOptions` and `useProductVariantOptions` hooks added for pickers
- **Admin Frontend — Phase 07 (Sales):** New `sale` module covering Sales list/detail (`/sales` → `/sales/:saleId`), line items, payments panel, finalize dialog (optional initial payment), read-only invoice view (`/sales/:saleId/invoice` with browser print — no backend PDF endpoint); create/finalize/record payments available to ADMIN+STAFF; update header and cancel are ADMIN-only; cancel blocked when fully paid; `finalized` state inferred from SALE stock-movements; `useCustomerOptions` and `useAvailableStockOptions` hooks added for pickers; new sidebar entry (Sales)
- **Admin Frontend — Phase 08 (Service):** Three new modules — `repair` (list/detail with status workflow dialog, optional payments when actual cost set, no delete), `warranty` (list, create via sale-item picker, submit claim), and `expense` (list with date-range filter, ADMIN-only mutations); routes at `/repairs`, `/repairs/:repairId`, `/warranties`, `/expenses`; added `useRepairStockOptions` and `useSaleOptions` hooks; three new sidebar entries
- **Admin Frontend — Phase 09 (Reports):** New `report` module with hub at `/reports` and nine sub-report pages (Sales, Purchases, Inventory, Customers, Suppliers, Repairs, Warranty, Expenses, Profit & Loss); read-only screen reports consuming all `/api/v1/reports/*` endpoints; customer/supplier drill-down detail pages; no export (PDF/Excel/CSV deferred until backend endpoints exist); new sidebar entry (Reports)
- **Admin Frontend — Phase 10 (Settings):** Three new modules — `user` (paginated ADMIN-only user management at `/users`), `role` (read-only role list at `/roles`), and `settings` (shop settings at `/shop-settings` with STAFF read-only); ADMIN profile editing on `/profile` via `PUT /users/{id}` workaround; sale invoice settings hook migrated to `@/modules/settings`; P10-T003 (permissions matrix) skipped — no backend API
- **Admin Frontend — Phase 11 (Production Readiness):** Vite vendor chunk splitting, production sourcemaps off, `npm run verify` script, SEO meta (`noindex` for internal admin), skip-to-main accessibility link, reduced-motion CSS, client error reporting hook with optional `VITE_ERROR_REPORT_URL`, responsive table pagination toolbar
- **Admin Docker deployment:** Multi-stage `admin/Dockerfile` (Vite build + nginx), API reverse proxy via `admin/nginx.conf`, `admin` service in `docker/docker-compose.yml` at http://localhost:3000, CI builds admin image alongside backend
- **Admin Frontend testing:** Vitest + React Testing Library + MSW (auth service, validation, ProtectedRoute, LoginPage); Playwright E2E auth spec; `npm run test` / `npm run test:e2e` / CI `admin-test` job
- **Admin Frontend testing — Purchase → Stock (priority #2):** MSW purchase/stock handlers with in-memory receive state; unit tests for `receivePurchaseValidation`, `purchaseService` receive flow, `useReceivePurchase`, and `ReceivePurchaseDialog`; Playwright E2E `e2e/purchase-to-stock.spec.ts` (receive purchase → stock list shows IMEI); 18 unit + 3 E2E tests passing
- **Admin Frontend testing — Sales → Payment → Warranty (priority #3):** MSW sale/payment/warranty handlers with in-memory state; unit tests for payment/warranty validation, `saleService`, `paymentService`, `warrantyService`, mutation hooks, `PaymentFormDialog`, and `WarrantyFormDialog`; Playwright E2E `e2e/sale-payment-warranty.spec.ts`; shared `e2e/helpers/auth.ts`; 37 unit + 4 E2E tests passing
- **Admin Frontend testing — Inventory status transitions (priority #4):** MSW stock detail/status handlers with in-memory state; unit tests for `stockStatusValidation`, `stockService.updateStatus`, `useUpdateStockStatus`, and `StockStatusFormDialog`; Playwright E2E `e2e/stock-status-transition.spec.ts`; 44 unit + 5 E2E tests passing — all four TESTING.md priority flows complete
- **Admin Frontend — Phase 05 (Business):** Two new top-level sibling modules, `customer` and `supplier` (not nested under a shared `business` module, per 01_AGENTS.md § Module Structure); paginated/sortable lists with debounced (300ms) server-side search by name and mobile (`mobile` search takes priority over `name`, matching `CustomerService`/`SupplierService#findAll`); Customer create/edit is ADMIN+STAFF, delete is ADMIN-only; every Supplier mutation (create/update/delete) is ADMIN-only per `SupplierController`; client-side Zod validation mirrors the backend's imperative `MobileValidator` (10-digit Indian mobile) and `GstValidator` (15-char GSTIN) checks exactly since neither ships as a Jakarta annotation; two new sidebar entries
- **Frontend documentation hardening:** Renumbered `admin/` docs to canonical `01`–`09` order; created `admin/README.md` (index/ownership table), `admin/TESTING.md`, and `admin/BACKEND_API_CONTRACT.md` (single source of truth for roles, JWT flow, `ApiResponse`, error codes, pagination); aligned roles (ADMIN/STAFF), pagination (0-based, `sort=field,dir`), and validation errors (400, not 422) with the actual backend; resolved module folder structure ambiguity (flat modules); removed duplicated rules across frontend docs by making `01_AGENTS.md` the policy owner
- **Phase 9 (Deployment):** Postman collection covering every endpoint (`postman/MobileShopERP.postman_collection.json`) with `local`/`staging` environment files; CI job validating the Docker image builds (`docker-image` job in `.github/workflows/ci.yml`); post-deployment smoke-test script (`scripts/smoke-test.sh`) covering health, auth, authenticated access, and refresh-token-rejection
- **Enterprise hardening — security:** CORS (`CorsConfig`), JSON `401`/`403` handlers (`JwtAuthenticationEntryPoint`, `JwtAccessDeniedHandler`), refresh-token rejection on Bearer auth, active/non-deleted user validation in `JwtAuthenticationFilter`, `AuthenticatedUser` principal, production JWT secret validation (`ProductionSecurityValidator`)
- **Enterprise hardening — stock lifecycle:** `PUT /api/v1/stock/{id}` limited to IMEI/serial metadata; `PUT /api/v1/stock/{id}/status` routes through `StockStatusService`
- **Enterprise hardening — audit:** `JpaAuditingConfig` resolves `created_by` / `updated_by` from JWT user id
- **Enterprise hardening — users:** Paginated active-only user list; soft-deleted users excluded from get/list
- **Integration tests:** Testcontainers PostgreSQL + `EnterpriseIntegrationTest` (auth, purchase receive, sale finalize, stock status, audit fields)
- **Unit tests:** `UserServiceTest`, `JwtAuthenticationFilterTest`; extended `JwtUtilTest` for refresh vs access tokens
- Initial repository structure
- Documentation suite (`docs/01`–`05`, `AGENTS.md`, `ARCHITECTURE.md`, `PROJECT_CONTEXT.md`)
- Phase task trackers (`tasks/phase-00` through `phase-10`) with globally unique task IDs (`Pxx-Txxx`)
- Cursor prompt library (`prompts/`) with 40 micro-prompts across 11 module folders
- `prompts/service/` module: repairs, warranty, expenses, audit_logs
- `docs/DOCUMENTATION_CONSISTENCY_REPORT.md` — post-harmonization audit

### Changed

- **Task IDs:** Renumbered all tasks to globally unique format `P00-T001`, `P01-T001`, … `P10-T022` (eliminated collisions)
- **Flyway strategy:** Standardized to locked migration files `V1__foundation.sql` through `V10__future.sql` (removed mixed 001–029 numbering)
- **Database name:** Standardized to `mobile_shop_erp` across all documents
- **Table count:** Updated all references to **Total Tables = 26** (locked)
- **AGENTS.md:** Added `business` and `report` to package structure; updated migration order
- **ARCHITECTURE.md:** Added `report` module, database name, table count, deployment in module flow
- **README.md:** Expanded with full folder purposes, docs index, Flyway map, package list
- **TASKS.md:** Added task ID convention and architecture summary
- **prompts/README.md:** Updated execution order (Service before Reports), Flyway mapping, service folder index
- **Enums standardized:**
  - Payment Mode: CASH, UPI, CARD, BANK_TRANSFER, FINANCE, EMI
  - Repair Status: RECEIVED, CHECKING, WAITING_PARTS, REPAIRING, READY, DELIVERED, CANCELLED
  - Stock Status: AVAILABLE, RESERVED, SOLD, REPAIR, RETURNED, DAMAGED, LOST
- **docs/02_Business_Rules.md:** Updated BR-045, BR-060, BR-064 enum values
- **docs/03_Database_Design.md:** Replaced per-table migration list with locked V1–V10 strategy
- **docs/04_ER_Diagram.md:** Table count summary updated to 26 (diagram unchanged)
- **docs/05_Data_Dictionary.md:** Payment mode enum documented; table count marked locked
- **docs/01_Project_Requirement.md:** Folder structure, milestones aligned with phase roadmap
- **PROJECT_CONTEXT.md:** Repair status enum standardized
- **phase-02-product.md:** Renamed variant image tasks; removed duplicate report tasks from phase-05/07
- **prompts/sales/03_sale_completion_workflow.md:** Warranty creation deferred to service module (`sale_item_id`)

### Fixed (Complete Documentation Consistency Audit — Pass 2)

- **Flyway backticks:** Corrected malformed `\Vn__*.sql\` entries across 18 product, business, purchase, stock, and sales prompts
- **Report prompts:** Fixed broken Flyway formatting in all 7 existing report prompts; added `08_expense_report.md` (P08-T011) and `09_warranty_report.md` (P08-T013)
- **ER diagram:** Warranty relationship aligned to `Sale Items → Warranty` (1:1); stock lifecycle enums uppercased; summary module table aligned with ARCHITECTURE (`Business`, `Reports`)
- **docs/01:** Added Expense Report and Warranty Report to reports list; inventory flow enums already uppercase
- **docs/03:** Added locked database name and table count to document header
- **AGENTS.md:** Added locked Stock Status enum under STOCK RULE
- **prompts/stock/03:** Added missing Flyway Migration row (`V6__inventory.sql`)
- **prompts/README.md:** Report count 7 → 9; total micro-prompts 38 → 40

### Fixed

- Task ID collisions across phases (e.g., T200 used in both Phase 7 and Phase 8)
- Missing `prompts/service/` folder for Phase 7 implementation
- Inconsistent Flyway naming between AGENTS.md and docs/03
- Inconsistent database names (`mobileshop_erp`, `mobileshoperp`, `mobile_shop_erp`)
- Prompt execution order skipping Service module before Reports

### Architecture

- **No architectural changes.** Schema, ER diagram, warranty `sale_item_id` FK, variant images, generic payments, attribute engine, and 26-table model remain locked.

### Known Issues

- **Soft-deleted records remain fetchable by direct ID lookup:** Confirmed via live API testing (Customer and Product) that `GET /{resource}/{id}` returns `200 OK` with full data for a record that was already soft-deleted via `DELETE /{resource}/{id}` (i.e. `deleted_at` is set), instead of `404 RESOURCE_NOT_FOUND`. Root cause: `BaseAuditableEntity`'s `@SQLRestriction("deleted_at IS NULL")` is honored by derived-query repository methods (`findAllByOrderBy...`, `findByNameContaining...`) but not by `JpaRepository#findById`, which Hibernate 6 resolves via `EntityManager.find()` — a primary-key lookup path that bypasses `@SQLRestriction`. This is systemic across every entity extending `BaseAuditableEntity` (Customer, Supplier, Product, ProductVariant, etc.), not specific to any one module. List/search screens are unaffected. No backend code was changed — see `admin/04_TASKS.md` Phase 05 notes; awaiting an explicit decision before touching the locked backend per `AGENTS.md` § Modification Rules.
