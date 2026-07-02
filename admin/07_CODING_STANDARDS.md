# 07_CODING_STANDARDS.md

# Mobile Shop ERP - Coding Standards

Version: 1.1

Status: LOCKED

Policy owner: 01_AGENTS.md. This document defines code-level conventions only; Redux/React Query scope policy lives in 01_AGENTS.md and is referenced, not repeated.

---

# Purpose

This document defines coding standards for the entire React Admin Panel.

Every developer and AI assistant must follow these standards.

---

# General Principles

Write clean code.

Write readable code.

Write maintainable code.

Write reusable code.

Optimize for long-term maintenance.

Never optimize for fewer lines of code.

---

# Architecture Principles

Follow SOLID.

Follow DRY.

Follow KISS.

Follow Feature Based Architecture.

Never violate architecture. See 03_ARCHITECTURE.md.

---

# Language

TypeScript only.

Strict mode enabled.

Never disable strict mode.

---

# Naming Convention

Folders

lowercase

Example

product

customer

sales

Files

PascalCase for Components

camelCase for hooks/services

Examples

ProductPage.tsx

ProductTable.tsx

useProducts.ts

productService.ts

Variables

camelCase

Constants

UPPER_CASE

Interfaces

PascalCase

Enums

PascalCase

Types

PascalCase

---

# File Rules

One component per file.

One hook per file.

One service per file.

One interface per file when large.

Avoid files larger than 300 lines.

Maximum 400 lines.

Split if necessary.

---

# Component Rules

Functional Components only.

No Class Components.

Export default only for pages.

Named exports for reusable components.

Keep components focused.

Avoid business logic inside UI.

---

# Hook Rules

Custom hooks start with use

Examples

useProducts

useSales

useCustomers

Hooks never return JSX.

Hooks contain reusable logic only.

---

# Service Rules

Every API call belongs inside service layer.

Never call Axios inside pages.

Never duplicate endpoints.

Services return typed models.

---

# React Query / Redux Scope

Query and state-management policy (what belongs in React Query vs Redux) is defined once in 01_AGENTS.md § React Query Rules and § Redux Rules. Not repeated here.

Code-level convention: queries use `useQuery`, mutations use `useMutation`, invalidate cache after mutations, never manually refresh pages.

---

# Props Rules

Always define interfaces.

Avoid optional props unless necessary.

Never use any.

Prefer readonly props.

---

# State Rules

Prefer local state.

Use Redux only for global state (see 01_AGENTS.md § Redux Rules).

Use React Query for server state.

---

# Error Handling

Always catch expected errors.

Display friendly messages.

Never expose stack traces.

Map backend `errorCode` to UI messages — see BACKEND_API_CONTRACT.md.

---

# Async Rules

Always use async/await.

Avoid nested promises.

Never ignore promise rejections.

---

# Styling Rules

Use Material UI.

Use sx sparingly.

Prefer reusable styled components.

Never hardcode colors.

Never hardcode spacing.

Full theme rules: see 05_UI_STANDARDS.md.

---

# Import Order

React → Third Party → Material UI → Internal Components → Hooks → Services → Utils → CSS

Maintain consistent order.

---

# Comments

Write comments only when needed.

Code should explain itself.

Do not comment obvious code.

---

# Magic Values

Never hardcode URLs, Colors, Timeouts, Limits, Roles, Statuses.

Move them to constants.

---

# Logging

console.log() — Forbidden

console.error() — Development only.

Remove debug logs before merge.

---

# Null Safety

Always handle undefined, null, empty arrays, empty strings.

Avoid runtime crashes.

---

# Performance

Memoize only when needed.

Lazy load pages.

Debounce search.

Virtualize large tables.

Avoid unnecessary renders.

Full performance budgets: see 09_PERFORMANCE.md.

---

# Accessibility

Labels required.

Keyboard support.

ARIA attributes.

Visible focus.

Proper contrast.

---

# Testing

Testing stack, tools, and required coverage: see TESTING.md. Not repeated here.

---

# Git Rules

Small commits.

Meaningful commit messages.

One feature per commit.

No direct commits to main.

---

# Code Review Checklist

✓ Build passes

✓ No TypeScript errors

✓ ESLint clean

✓ No duplicate code

✓ No any

✓ Reusable

✓ Responsive

✓ Accessible

✓ API follows standards (06_API_INTEGRATION.md, BACKEND_API_CONTRACT.md)

✓ Theme follows UI standards (05_UI_STANDARDS.md)

---

# Coding Freeze

These standards are mandatory.

No exceptions without approval.

---

END OF 07_CODING_STANDARDS.md
