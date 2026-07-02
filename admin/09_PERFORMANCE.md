# 09_PERFORMANCE.md

# Mobile Shop ERP - Performance Standards

Version: 1.1

Status: LOCKED

Policy owner: 01_AGENTS.md. This document is the canonical source for performance budgets and targets — not repeated in full elsewhere.

---

# Purpose

This document defines the frontend performance standards for the Mobile Shop ERP Admin Panel.

Every implementation must follow these rules.

Performance is a feature.

---

# Performance Goals

Fast, Responsive, Smooth, Low Memory Usage, Scalable, Maintainable, Production Ready.

---

# Core Web Vitals

Target

LCP < 2.5 sec

CLS < 0.1

INP < 200 ms

TTFB < 800 ms

Performance Score 95+

Accessibility 95+

Best Practices 100

SEO 90+

---

# Build Targets

npm run build — No warnings, No TypeScript errors, No ESLint errors, Bundle successfully generated.

---

# Bundle Size

Initial Bundle < 350 KB gzip

Vendor Bundle — Split

Charts — Lazy

Reports — Lazy

Images — Optimized

Never load everything at startup.

---

# Code Splitting

Every major page must be lazy loaded: Dashboard, Brand, Category, Product, Customer, Supplier, Purchase, Inventory, Sales, Repair, Warranty, Expense, Reports, Settings.

Use React.lazy() + Suspense.

---

# Lazy Loading

Always lazy load Pages, Charts, Dialogs (heavy), Report modules, Image Viewer, PDF Viewer, Excel Viewer.

---

# React Query

Default staleTime 5 minutes

Dashboard 1 minute

Settings 30 minutes

Retry 1

Refetch On Window Focus false

Invalidate after mutations.

---

# Caching

Server Data — React Query

Global Data — Redux (Authentication, Theme, Settings — see 01_AGENTS.md § Redux Rules)

Images — Browser Cache

Static Assets — Long Cache

Never duplicate caches.

---

# Pagination

Server Side. Page, Size, Sort, Filter, Search.

Never load entire datasets.

Query parameter convention (0-based page, `sort=field,direction`): see BACKEND_API_CONTRACT.md.

---

# Searching

Debounce 300 ms. Server Side. Reusable.

Never search in browser for ERP data.

---

# Memoization

Use React.memo only when required.

Use useMemo only for expensive calculations.

Use useCallback only when necessary.

Avoid premature optimization.

---

# Rendering

Avoid unnecessary re-renders.

Keep components small.

Split large pages.

Use stable keys.

Never use array index as key.

---

# Tables

Virtualize 1000+ rows.

Use server-side pagination.

Do not render massive datasets.

---

# Images

Lazy Load, Preview, Compression, Responsive, Fallback, Placeholder.

Never upload original 20MB files.

---

# Charts

Lazy loaded, Responsive, Minimal animation, Destroy on unmount.

Avoid rendering hidden charts.

---

# Forms

Avoid unnecessary validation.

Validate only changed fields.

Reset efficiently.

Never re-render whole form.

---

# State

Redux — Authentication, Theme, Settings (see 01_AGENTS.md § Redux Rules)

React Query — everything else.

Avoid duplicate state.

---

# API Calls

No duplicate requests.

Cancel obsolete requests.

Retry only network failures.

Throttle repetitive actions.

---

# Error Recovery

Retry Button, Refresh, Reconnect, Graceful fallback.

Never crash the UI.

---

# Memory Management

Cleanup timers, subscriptions, listeners, object URLs, intervals, observers.

---

# Event Listeners

Always remove listeners.

Never leak memory.

---

# File Upload

Show progress.

Validate before upload.

Compress images (future).

Limit file size.

---

# Download

Blob, Progress, Cancel option, Proper cleanup.

---

# Accessibility Performance

Keyboard Navigation, Focus Management, Reduced Motion Support, Readable Fonts, Proper Contrast.

---

# Responsive Performance

Desktop, Laptop, Tablet, Mobile.

No layout shift.

---

# Animation

Maximum Duration 300ms.

Avoid heavy transitions.

Prefer CSS transforms.

---

# Monitoring

Future: Sentry, Google Analytics, Performance Metrics, Error Tracking.

---

# Lighthouse Goals

Performance 95+

Accessibility 95+

Best Practices 100

SEO 90+

---

# Browser Support

Chrome, Edge, Firefox, Safari — Latest Stable Versions.

---

# Build Checklist

✓ npm install

✓ npm run dev

✓ npm run build

✓ No warnings

✓ No TypeScript errors

✓ No ESLint errors

✓ Lazy Loading verified

✓ React Query configured

✓ Bundle optimized

✓ Images optimized

✓ Responsive verified

✓ Lighthouse target achieved

---

# Performance Freeze

Locked

Lazy Loading, Caching Strategy, React Query, Redux Usage, Bundle Strategy, Pagination, Searching, Virtualization.

No changes without approval.

---

END OF 09_PERFORMANCE.md
