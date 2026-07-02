# 03_ARCHITECTURE.md

# Mobile Shop ERP - React Admin Architecture

Version: 1.1

Status: LOCKED

Policy owner: 01_AGENTS.md. This document explains architectural layering and data flow; the canonical folder/module structure itself is defined once in 01_AGENTS.md and referenced here.

---

# Purpose

This document defines the frontend architecture of the Mobile Shop ERP Admin Panel.

Every implementation MUST follow this architecture.

Changing the architecture requires approval.

---

# Architecture Style

Feature Based Architecture

Presentation Layer

↓

Business Layer

↓

Service Layer

↓

API Layer

↓

Backend

---

# Technology Stack

Framework

React 19

Language

TypeScript

Bundler

Vite

UI

Material UI

Routing

React Router v7

Forms

React Hook Form

Validation

Zod

HTTP

Axios

Server State

TanStack Query

Global State

Redux Toolkit

Notifications

React Toastify

---

# High Level Architecture

Browser

↓

React App

↓

Routes

↓

Layouts

↓

Pages

↓

Components

↓

Hooks

↓

Services

↓

Axios

↓

Spring Boot API

---

# Folder Architecture

Canonical folder tree and the meaning of every top-level folder (`app/`, `auth/`, `common/`, `components/`, `pages/`, `modules/`, etc.) is defined once in 01_AGENTS.md § Folder Structure. Not repeated here.

Every folder has a single responsibility.

---

# Module Architecture

Every module is a flat top-level sibling under `modules/` and follows exactly the same internal structure.

Canonical module list and internal structure: see 01_AGENTS.md § Module Structure.

Example (one module, structure is identical for every other module — brand, category, customer, etc. are siblings of `product`, never nested inside it):

modules/product/

api/

components/

hooks/

pages/

services/

types/

validation/

index.ts

Never change this structure.

---

# Layer Responsibilities

Pages

- Screen composition
- Routing target
- No business logic

Components

- Reusable UI
- No API calls

Hooks

- React Query
- State orchestration
- Reusable logic

Services

- Axios calls
- DTO mapping
- API communication

Types

- Interfaces
- DTOs

Validation

- Zod schemas
- Form validation

---

# Routing Architecture

Public Routes

- Login

Protected Routes

- Dashboard
- Products
- Customers
- Purchases
- Sales
- Reports

Unauthorized

403

Not Found

404

Error

500

Routes are centralized.

Never declare routes inside pages.

---

# Layout Architecture

App

↓

AdminLayout

↓

Sidebar

↓

Topbar

↓

Content

↓

Footer

Authentication pages use

AuthLayout

---

# State Architecture

Redux

Authentication (tokens, logged-in user, role)

Theme

Application Settings

React Query

Products

Customers

Purchases

Inventory

Sales

Reports

Never mix responsibilities.

---

# API Architecture

UI

↓

React Query

↓

Service

↓

Axios

↓

Spring Boot

Never skip the service layer.

Never call Axios directly inside pages.

---

# Authentication Architecture

Login

↓

Access Token

↓

Refresh Token

↓

Redux

↓

Axios Interceptor

↓

Protected Route

↓

Backend

Logout clears

Redux

Storage

React Query cache

Exact login/refresh DTOs and token flow: see BACKEND_API_CONTRACT.md.

---

# Theme Architecture

theme/

theme.ts

palette.ts

typography.ts

shadows.ts

components.ts

No inline styling.

Always use theme.

---

# Component Hierarchy

Page

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

↓

Forms

↓

Inputs

Small reusable components are preferred.

---

# Form Architecture

Page

↓

Dialog

↓

Form

↓

React Hook Form

↓

Zod

↓

Service

↓

Backend

Validation exists in one place only.

---

# Table Architecture

Toolbar

↓

Filters

↓

Search

↓

Table

↓

Pagination

↓

Actions

↓

Dialogs

Server-side

Pagination

Sorting

Filtering

Searching

---

# Error Architecture

Axios Error

↓

Interceptor

↓

Snackbar

↓

Error Boundary

↓

Fallback UI

Never expose backend stack traces.

---

# Loading Architecture

Page Loader

↓

Section Loader

↓

Table Skeleton

↓

Button Loading

↓

Progress Indicators

Never leave blank screens.

---

# Security Architecture

JWT

Refresh Token

Protected Routes

Role Based UI (ADMIN / STAFF — see 01_AGENTS.md § Role & Permission Rules)

Frontend security complements backend security.

Backend remains the source of truth.

---

# Dependency Rules

Pages

↓

Components

↓

Hooks

↓

Services

↓

Axios

↓

Backend

Components must never depend on pages.

Services must never depend on UI.

Hooks must never render UI.

---

# Naming Rules

Page

ProductPage.tsx

Component

ProductTable.tsx

Hook

useProducts.ts

Service

productService.ts

Validation

productValidation.ts

Types

Product.ts

---

# Performance

Lazy Loading

Memoization

Virtualized Tables

Debounced Search

Caching

No unnecessary re-renders.

---

# Build Requirements

npm install

↓

npm run dev

↓

npm run build

↓

ESLint

↓

TypeScript

↓

Ready for Review

---

# Architecture Freeze

Locked

Technology Stack

Folder Structure

Routing

Theme

State Management

Authentication Flow

Module Structure

API Layer

Component Hierarchy

No architectural changes are allowed without approval.

---

END OF 03_ARCHITECTURE.md