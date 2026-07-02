# 02_PROJECT_CONTEXT.md

# Mobile Shop ERP - React Admin Panel

Version: 1.1

Status: LOCKED

Policy owner: 01_AGENTS.md. This document provides business/domain context only — it does not restate policy rules.

---

# Project Overview

This project is the official React Admin Panel for the Mobile Shop ERP system.

Backend and database architecture are already finalized.

The frontend MUST follow the backend architecture exactly.

The frontend must NEVER redesign backend behavior.

---

# Backend Overview

Backend Technology

Spring Boot 3.5

Language

Java 21

Database

PostgreSQL 17

ORM

Spring Data JPA

Authentication

JWT (access + refresh tokens returned in the JSON response body — no cookies)

API Style

REST

Documentation

OpenAPI / Swagger

Migration

Flyway

Architecture

Layered Architecture

Deployment

Docker

---

# Frontend Technology

React 19

TypeScript

Vite

Material UI

TanStack Query

Redux Toolkit

Axios

React Hook Form

Zod

React Router v7

React Toastify

---

# Project Goal

Create a modern enterprise ERP Admin Panel for managing

- Products
- Brands
- Categories
- Customers
- Suppliers
- Purchases
- Inventory
- Sales
- Repairs
- Warranty
- Expenses
- Reports
- Users
- Roles
- Settings

The UI should be

Fast

Responsive

Professional

Reusable

Maintainable

Production Ready

---

# Backend API

Base URL

/api/v1

Environment Variable

VITE_API_BASE_URL

Never hardcode API URLs.

Full endpoint list and DTOs: see BACKEND_API_CONTRACT.md.

---

# Authentication Flow

Summary only — full request/response DTOs are in BACKEND_API_CONTRACT.md.

User Login → Access Token + Refresh Token (returned together in the login response body) → Redux → Protected Route → Axios Interceptor → Automatic Refresh on 401 → Continue Request → Logout if Refresh Fails

---

# User Roles (Backend Locked)

ADMIN

STAFF

These are the only two roles seeded by the backend (`V2__authentication.sql`). There is no Manager, Sales, Inventory, Service, or Read-Only role today.

Role name comes from the authenticated user (`roleName` field). The frontend must not invent additional roles.

There is no granular per-action permission API — access control is role-based only. See 01_AGENTS.md § Role & Permission Rules and 08_SECURITY.md.

---

# Backend Response Format

Every API returns an `ApiResponse<T>` envelope:

success, message, data, errorCode, timestamp, path

Never assume a different response structure. Exact shape: see BACKEND_API_CONTRACT.md.

---

# Module List

Authentication

Dashboard

Brand

Category

Product

Customer

Supplier

Purchase

Inventory

Sales

Payment

Repair

Warranty

Expense

Reports

Users

Roles

Settings

---

# Product Flow

Brand → Category → Product → Variant → Price → Stock → Sale

---

# Purchase Flow

Supplier → Purchase → Purchase Item → Stock

---

# Sales Flow

Customer → Sale → Sale Item → Payment → Invoice → Warranty

---

# Service Flow

Repair → Expense → Status → Delivery

---

# Dashboard Widgets

Sales Today

Monthly Sales

Revenue

Low Stock

Out of Stock

Pending Repairs

Recent Purchases

Recent Sales

Top Selling Products

Quick Actions

---

# UI Philosophy

Minimal, Professional, Enterprise, Responsive, Reusable, Consistent, Accessible.

No unnecessary animations.

Full UI standards: see 05_UI_STANDARDS.md.

---

# Folder Responsibility

Summary only — canonical structure is defined once in 01_AGENTS.md § Folder Structure.

pages/ → global/system screens only

modules/<module>/pages/ → business screens

components/ → reusable shared UI

modules/ → business logic per domain

services/ → module-level API communication (inside each module)

hooks/ → custom hooks

store/ → global state (Redux)

theme/ → Material UI theme

utils/ → shared utilities

---

# State Management

Redux: Authentication, Theme, Application Settings only.

React Query: everything fetched from APIs.

Never duplicate state. Full scope: see 01_AGENTS.md § Redux Rules.

---

# API Communication

Axios → Service Layer → React Query → UI

Pages must never call APIs directly.

Full flow and contract: see 06_API_INTEGRATION.md and BACKEND_API_CONTRACT.md.

---

# Error Handling

401 → Logout

403 → Forbidden

404 → Not Found

400 (VALIDATION_FAILED) → Validation

500 → Server Error

Always show user-friendly messages. Exact error codes: see BACKEND_API_CONTRACT.md.

---

# File Upload

Image Upload, Progress, Preview, Validation.

Backend handles storage. Frontend handles UX only.

---

# Pagination

Server Side. Sorting. Filtering. Searching.

Never implement client-side pagination for ERP modules.

Query parameter format (Spring `Pageable`, 0-based page index): see BACKEND_API_CONTRACT.md.

---

# Theme

Material UI. Light Theme. Dark Mode is a future enhancement.

No custom CSS framework.

---

# Development Rules

One module at a time.

One feature per Pull Request.

Review after every milestone.

Never implement multiple ERP modules together.

---

# Project Status

Backend: Completed (Phases 0–8 implemented and hardened; see backend TASKS.md)

Frontend: React Admin Panel Foundation — documentation hardening complete, implementation not yet started.

---

# Next Milestones

Phase A: Foundation → Authentication → Dashboard → Brand → Category → Product → Business → Purchase → Inventory → Sales → Service → Reports → Settings

Full phase-by-phase task breakdown: see 04_TASKS.md.

---

END OF PROJECT_CONTEXT.md
