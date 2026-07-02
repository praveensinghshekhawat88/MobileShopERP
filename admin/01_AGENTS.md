# 01_AGENTS.md

# Mobile Shop ERP - React Admin Panel

Version: 1.1

Status: LOCKED

This is the POLICY document for the React Admin Panel.

It defines the canonical tech stack, folder/module structure, naming, and top-level rules.

Detailed standards live in specialized documents and are referenced from here, not repeated.

Read order and document index: see README.md.

All future implementations MUST follow this document.

Changing architecture without approval is NOT allowed.

---

# Project Overview

Project Name

Mobile Shop ERP

Frontend

React Admin Panel

Backend

Spring Boot 3.5

Language

TypeScript

Framework

React 19

Bundler

Vite

API

REST

Authentication

JWT + Refresh Token

Database

PostgreSQL

Design

Material UI

Architecture

Feature Based

---

# Tech Stack (LOCKED)

React 19

TypeScript

Vite

Material UI

React Router v7 (routing library — locked version)

TanStack Query

Redux Toolkit

Axios

React Hook Form

Zod

React Toastify

ESLint

Prettier

---

# Folder Structure (LOCKED)

admin/

├── public/
│
├── src/
│
│── app/            (app bootstrap, providers, root router)
│── assets/         (static images, fonts)
│── auth/           (cross-cutting auth infra only: ProtectedRoute, AuthGuard, token helpers)
│── common/         (shared non-UI utilities/constants used across modules)
│── components/     (shared reusable UI components, not tied to one module)
│── config/         (axios.ts, env config, query client config)
│── layouts/         (AdminLayout, AuthLayout, Sidebar, Topbar)
│── modules/         (every ERP business domain — see Module Structure below)
│── pages/           (global/system pages only: Login, Dashboard shell, 404, 403, Unauthorized)
│── routes/          (centralized route definitions)
│── services/        (empty by convention — module API calls live in modules/<module>/services/)
│── store/           (Redux Toolkit store + slices: auth, theme, settings)
│── theme/           (MUI theme: theme.ts, palette.ts, typography.ts, shadows.ts, components.ts)
│── types/           (shared cross-module types)
│── utils/           (shared pure utility functions)
│
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts

`components/` vs `common/`: `components/` holds shared UI (renders JSX). `common/` holds shared non-UI logic (formatters, constants, guards).

`pages/` vs `modules/<module>/pages/`: root `pages/` is ONLY for app-shell/system screens with no business domain (Login, 404, 403, Unauthorized, Dashboard shell). Every business screen (list, create, edit, detail) lives inside its owning module's `pages/`.

Do not change this structure.

---

# Module Structure (LOCKED — Canonical, Flat)

Every ERP business domain is a top-level sibling folder directly under `src/modules/`.

Modules are FLAT. A module is never nested inside another module (e.g. `brand` and `category` are siblings of `product`, not children of it).

```
src/modules/
├── auth/
├── dashboard/
├── brand/
├── category/
├── attribute/
├── product/
├── customer/
├── supplier/
├── purchase/
├── inventory/
├── sales/
├── repair/
├── warranty/
├── expense/
├── report/
├── settings/
├── user/
└── role/
```

Every module contains the identical internal structure:

```
modules/<module>/
├── api/          (raw endpoint path constants for this module)
├── components/   (module-only UI components)
├── hooks/        (React Query hooks for this module)
├── pages/        (route-target screens for this module)
├── services/     (Axios calls + DTO mapping for this module)
├── types/        (module DTOs / models)
├── validation/   (Zod schemas for this module)
└── index.ts      (public exports of the module)
```

This structure is referenced, not repeated, by 03_ARCHITECTURE.md.

---

# Naming Convention

Pages

PascalCase

Example

ProductPage.tsx

BrandPage.tsx

Components

PascalCase

Example

ProductTable.tsx

CustomerDialog.tsx

Hooks

camelCase

Example

useProducts.ts

useSales.ts

Services

camelCase

Example

productService.ts

saleService.ts

Types

PascalCase

Example

Product.ts

Sale.ts

Constants

UPPER_CASE

Example

API_URL.ts

Routes

camelCase

Example

productRoutes.ts

---

# Import Order

React

Third Party

Material UI

Components

Hooks

Services

Utils

CSS

Always maintain import order.

---

# TypeScript Rules

Strict mode enabled.

No any.

No implicit any.

Prefer interface over type.

Readonly wherever possible.

Never disable TypeScript checks.

---

# React Rules

Only Functional Components.

No Class Components.

Always use Hooks.

No duplicated logic.

Extract reusable components.

Prefer composition over inheritance.

Keep components small.

One responsibility per component.

---

# State Management

Redux Toolkit

Only

Authentication

Logged User

Global Theme

Global Settings

Everything else

TanStack Query

Never store API lists in Redux.

---

# Routing

React Router

Protected Routes

Public Routes

Unauthorized Page

Forbidden Page

404 Page

No inline route definitions.

---

# API Rules

Never call fetch()

Always use Axios.

Always use the single instance in config/axios.ts

Always use interceptors.

Never hardcode URLs.

Use environment variables only.

Full API contract (pagination, errors, auth DTOs): see 06_API_INTEGRATION.md and BACKEND_API_CONTRACT.md.

---

# Authentication Rules

JWT Access Token + Refresh Token, both returned in the login/refresh JSON response body (backend does not set cookies).

Protected Route

Auto Refresh on 401

Auto Logout on refresh failure

Unauthorized Redirect

No token logic inside UI components.

Full JWT flow and token DTOs: see BACKEND_API_CONTRACT.md and 08_SECURITY.md.

---

# Environment Variables

.env

VITE_API_BASE_URL

Only environment variables.

No hardcoded URLs.

---

# Component Rules (LOCKED)

All reusable UI must be placed inside

src/components/

Business components must stay inside their own module.

Example

modules/product/components/

ProductTable.tsx

ProductDialog.tsx

ProductFilters.tsx

ProductToolbar.tsx

Never place Product components inside common components.

---

# Component Guidelines

Every component must have only one responsibility.

Bad

ProductPage

↓

Table

↓

Dialog

↓

Form

↓

Filters

↓

Pagination

↓

Toolbar

inside one file.

Good

ProductPage

↓

ProductTable

↓

ProductDialog

↓

ProductForm

↓

ProductFilters

↓

ProductToolbar

↓

ProductPagination

---

# File Size Rule

Recommended

150-250 lines

Maximum

400 lines

If larger

Split component.

---

# Props Rules

Always create interfaces.

Example

interface ProductTableProps {

products: Product[]

loading: boolean

onEdit()

onDelete()

}

No inline prop typing.

---

# Table Rules

Every table must support

Pagination

Sorting

Search

Loading

Empty State

Error State

Skeleton

Row Selection

Column Visibility (future)

Export (future)

Responsive Layout

No table should directly call APIs.

Tables only display data.

---

# Dialog Rules

Every CRUD operation must use Dialogs.

Create

Edit

Delete Confirmation

View Details

Dialogs must be reusable.

Never duplicate dialog code.

---

# Form Rules

Use

React Hook Form

+

Zod

Only.

No uncontrolled forms.

Validation must be shared.

Validation files

validation/

Example

productValidation.ts

customerValidation.ts

supplierValidation.ts

---

# Form Layout

Desktop

2 Columns

Mobile

1 Column

All forms responsive.

---

# Input Components

Reusable only.

TextField

Password

Number

Currency

Date

DateTime

Select

Autocomplete

Radio

Checkbox

Switch

Textarea

File Upload

Image Upload

Search

Barcode

QR Code

Never use raw Material UI TextField directly inside pages.

Always wrap it.

---

# Button Rules

Primary

Contained

Secondary

Outlined

Danger

Error

Success

Green

Warning

Orange

Loading Button

Disabled State

Every button must support loading.

---

# Icons

Use only

Material Icons

No mixed icon libraries.

---

# Snackbar Rules

React Toastify

Success

Error

Warning

Information

No browser alerts.

---

# Loading Rules

Every API

↓

Loading Spinner

Every Table

↓

Skeleton

Every Page

↓

Page Loader

Never show blank screens.

---

# Error Handling

API Error

↓

Snackbar

Validation Error

↓

Field Error

Unexpected Error

↓

Error Boundary

401

↓

Logout

403

↓

Forbidden Page

404

↓

Not Found

500

↓

Error Page

---

# Theme Rules

Material UI Theme only.

No inline colors, font sizes, or spacing.

Everything from theme/

Full color palette, typography, spacing scale, and border radius: see 05_UI_STANDARDS.md. Not repeated here.

---

# Responsive Rules

Desktop

Laptop

Tablet

Mobile

All pages responsive.

Never use fixed widths.

Prefer Flex/Grid.

---

# Page Structure

Topbar

↓

Breadcrumb

↓

Toolbar

↓

Filters

↓

Table

↓

Pagination

↓

Dialogs

Every module follows same layout.

---

# Dashboard Rules

Dashboard contains only

Statistics

Charts

Recent Sales

Low Stock

Recent Purchases

Quick Actions

No CRUD on Dashboard.

---

---

# React Query Rules (LOCKED)

React Query is the default server state manager.

Use React Query for

- Lists
- Details
- Pagination
- Search
- Filters
- CRUD
- Dashboard widgets

Never use Redux for server data.

---

# Query Keys

Always centralize query keys.

Example

queryKeys.ts

product.list

product.detail

customer.list

sale.detail

Never hardcode query keys.

---

# Mutations

Create

Update

Delete

Status Change

Upload

All must use useMutation().

Invalidate related queries after success.

Never reload pages.

---

# Cache Rules

Keep staleTime reasonable.

Default

5 minutes

Dashboard

1 minute

Settings

30 minutes

Do not disable cache globally.

---

# Redux Rules

Redux Toolkit is ONLY for

Authentication (tokens, logged-in user, role)

Theme

Application Settings

Never store

Products

Customers

Suppliers

Purchases

Sales

Reports

inside Redux.

This is the canonical Redux scope. Do not restate a different list in other documents — reference this section instead.

---

# Axios Rules

Create only one axios instance.

config/

axios.ts

Use interceptors.

Automatically

Attach JWT

Refresh Token

Retry Request

Logout on invalid refresh token

Never create multiple axios instances.

---

# API Response Rules

Backend format is locked. Every response is `ApiResponse<T>`:

success, message, data, errorCode, timestamp, path

`errorCode` and `data` are omitted (null) when not applicable.

Never parse responses manually.

Create reusable response types.

Exact shape, error codes, and validation error format: see BACKEND_API_CONTRACT.md.

---

# Authentication Flow

User Login

↓

Receive Access Token

↓

Receive Refresh Token

↓

Store securely

↓

Protected Routes

↓

Axios Interceptor

↓

Auto Refresh

↓

Continue Request

↓

Logout on Refresh Failure

Never refresh tokens inside UI components.

Exact login/refresh request-response DTOs: see BACKEND_API_CONTRACT.md.

---

# Role & Permission Rules (Backend Aligned)

Backend Roles (Locked, only two exist): ADMIN, STAFF

Access control is role-based only. The backend has no granular per-action (Can View / Can Create / Can Update / Can Delete) permission entity or API.

Frontend must:

Read `roleName` from the authenticated user returned by login.

Show or hide navigation/actions based on role (ADMIN vs STAFF), not assumed granular permissions.

Never invent additional roles or a permission matrix not exposed by the backend.

Backend `@PreAuthorize` remains the real enforcement point; frontend role checks are UX only.

---

# Security Rules

Never store passwords.

Never log JWT.

Never expose refresh token.

Never hardcode secrets.

Never trust frontend validation.

Backend validation is final.

Always sanitize file uploads.

Always escape HTML rendering.

Never use dangerouslySetInnerHTML unless approved.

Full security standards: see 08_SECURITY.md. Not repeated here.

---

# Error Handling Rules

401

↓

Redirect Login

403

↓

Forbidden Page

404

↓

Not Found

400 (VALIDATION_FAILED)

↓

Validation Errors (field-level, from `data` map)

500

↓

Global Error Page

Unexpected

↓

Error Boundary

Never swallow exceptions.

Always show user-friendly messages.

Exact error codes and HTTP statuses: see BACKEND_API_CONTRACT.md.

---

# Performance Rules

Use lazy loading.

Use React.memo when required.

Use useMemo only when beneficial.

Use useCallback only when beneficial.

Virtualize long tables.

Debounce searches.

Avoid unnecessary renders.

Never fetch the same data twice.

Full performance budgets and targets: see 09_PERFORMANCE.md. Not repeated here.

---

# Code Splitting

Every module must support lazy loading.

React.lazy()

Suspense

Loading Screen

Dashboard

Brand

Category

Product

Purchase

Sales

Reports

All lazy loaded.

---

# File Upload Rules

Maximum size configurable.

Validate type.

Show preview.

Show upload progress.

Never upload directly from UI without service layer.

---

# Logging Rules

console.log()

❌ Forbidden

console.error()

Only during development.

Use logger utility when introduced.

---

# Environment Rules

Never hardcode

API URL

JWT

Ports

Secrets

Everything must come from

.env

---

# Testing Rules

Every module should have

Component Tests

Hook Tests

Service Tests

Utility Tests

Critical Pages

E2E Tests

Never merge untested features.

Testing stack, tools, and coverage rules: see TESTING.md. Not repeated here.

---

# Accessibility Rules

Buttons must have labels.

Inputs must have labels.

Keyboard navigation required.

Dialogs must trap focus.

Proper aria attributes.

Contrast should meet accessibility guidelines.

---

# Browser Support

Chrome

Edge

Firefox

Latest Safari

Responsive on

Desktop

Tablet

Mobile

---

# AI Generation Rules (Cursor)

Before generating any code, always read in this order:

01_AGENTS.md (this document — policy, canonical structure)

02_PROJECT_CONTEXT.md

03_ARCHITECTURE.md

04_TASKS.md

05_UI_STANDARDS.md

06_API_INTEGRATION.md

07_CODING_STANDARDS.md

08_SECURITY.md

09_PERFORMANCE.md

BACKEND_API_CONTRACT.md

TESTING.md

Full index and purpose of each document: see README.md.

Never generate multiple ERP modules together.

Generate only one module at a time.

Never modify architecture.

Never rename folders.

Never move files.

Never create duplicate components.

Always reuse existing components.

Always follow folder structure.

Always use TypeScript.

Always follow Material UI.

Always generate production-ready code.

Always stop after completing one task.

Wait for user approval before continuing.

---

# Code Review Checklist

Before considering any task complete

✓ Project builds successfully

✓ TypeScript passes

✓ ESLint passes

✓ No console errors

✓ No console warnings

✓ Responsive verified

✓ API integrated correctly

✓ Theme followed

✓ No duplicate code

✓ No hardcoded values

✓ No unused imports

✓ No any types

✓ React Query used correctly

✓ Redux used only for global state

✓ Forms validated

✓ Loading state implemented

✓ Error state implemented

✓ Empty state implemented

✓ Accessibility verified

✓ Ready for code review

---

# Architecture Freeze

The following items are LOCKED

Folder Structure

Theme

State Management

Routing

Authentication Flow

API Layer

Component Hierarchy

Module Structure

Technology Stack

No changes are allowed without approval.

---

END OF AGENTS.md