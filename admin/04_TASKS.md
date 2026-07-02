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

Pending

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

Pending

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

Tasks

P02-T001 — Statistics Cards

P02-T002 — Sales Chart

P02-T003 — Revenue Chart

P02-T004 — Recent Sales

P02-T005 — Recent Purchases

P02-T006 — Low Stock

P02-T007 — Quick Actions

Exit Criteria

Dashboard Fully Functional

---

# Phase 03

Masters

Tasks

P03-T001 — Brand Module

P03-T002 — Category Module

P03-T003 — Attribute Group

P03-T004 — Attributes

P03-T005 — Attribute Values

Exit Criteria

Master Data Complete

---

# Phase 04

Product

Tasks

P04-T001 — Product CRUD

P04-T002 — Variant CRUD

P04-T003 — Images

P04-T004 — Price History

P04-T005 — Dynamic Attributes

Exit Criteria

Product Management Complete

---

# Phase 05

Business

Tasks

P05-T001 — Customer Module

P05-T002 — Supplier Module

Exit Criteria

Business Module Complete

---

# Phase 06

Purchase & Inventory

Tasks

P06-T001 — Purchase

P06-T002 — Purchase Items

P06-T003 — Stock

P06-T004 — Stock Movement

P06-T005 — Stock Status *(dedicated status endpoint — see BACKEND_API_CONTRACT.md; status can no longer be changed via the metadata update endpoint)*

Exit Criteria

Inventory Complete

---

# Phase 07

Sales

Tasks

P07-T001 — Sales

P07-T002 — Sale Items

P07-T003 — Payments

P07-T004 — Invoice **[Backend Pending — no invoice/PDF generation endpoint exists; build invoice view from Sale + Settings data, defer print/PDF export until a backend endpoint is available]**

Exit Criteria

Sales Flow Complete

---

# Phase 08

Service

Tasks

P08-T001 — Repair

P08-T002 — Warranty

P08-T003 — Expense

Exit Criteria

Service Module Complete

---

# Phase 09

Reports

Tasks

P09-T001 — Sales Reports

P09-T002 — Purchase Reports

P09-T003 — Inventory Reports

P09-T004 — Customer Reports

P09-T005 — Supplier Reports

P09-T006 — Repair Reports

P09-T007 — Warranty Reports

P09-T008 — Expense Reports

P09-T009 — Profit & Loss Report *(backend `ProfitReportController` exists; was missing from this roadmap)*

Export (PDF / Excel / CSV) **[Backend Pending — no export endpoints exist yet; screen-only reports for this phase]**

Exit Criteria

Reports Complete

---

# Phase 10

Settings

Tasks

P10-T001 — Users

P10-T002 — Roles (list/display only — ADMIN, STAFF; role CRUD via `RoleController`)

P10-T003 — Permissions **[Backend Pending — no permission-matrix endpoint exists; backend is role-based only. Do not build a granular permission editor against a non-existent API]**

P10-T004 — Application Settings

P10-T005 — Profile Settings

Exit Criteria

Settings Complete

---

# Phase 11

Production Readiness

Tasks

P11-T001 — Responsive Testing

P11-T002 — Performance Audit

P11-T003 — Accessibility Audit

P11-T004 — SEO

P11-T005 — Bundle Optimization

P11-T006 — Error Monitoring

P11-T007 — Production Build

P11-T008 — Final Review

Exit Criteria

Production Ready

---

# Golden Rules

Never implement multiple ERP modules together.

One Phase → One Review → One Merge → Next Phase

Always maintain production quality.

---

END OF 04_TASKS.md
