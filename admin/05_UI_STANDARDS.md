# 05_UI_STANDARDS.md

# Mobile Shop ERP - UI Standards

Version: 1.1

Status: LOCKED

Policy owner: 01_AGENTS.md. This document is the canonical source for theme, color, typography, spacing, and component visual standards — not repeated in other documents.

---

# Purpose

This document defines the complete UI/UX standards for the React Admin Panel.

Every screen, component and module must follow these rules.

No page should have its own custom design language.

Consistency is mandatory.

---

# Design Philosophy

Professional

Enterprise

Minimal

Modern

Responsive

Accessible

Fast

Reusable

Clean

No unnecessary animations.

---

# Theme

Material UI

Light Theme

Dark Mode

Future Enhancement

No Bootstrap

No Tailwind

No custom CSS framework

Use MUI Theme only.

---

# Color Palette

Primary

Blue

Secondary

Gray

Success

Green

Warning

Orange

Danger

Red

Info

Sky Blue

Background

#F8FAFC

Paper

White

Border

Light Gray

Text Primary

Dark Gray

Text Secondary

Medium Gray

Never hardcode colors.

Always use theme palette.

---

# Typography

Font Family

Inter

Fallback

Roboto

Headings

Bold

Body

Regular

Buttons

Medium

Captions

Regular

Never use custom fonts.

---

# Spacing

Use

theme.spacing()

Spacing Scale

4

8

12

16

24

32

40

48

Never write

margin: 17px

padding: 13px

No random spacing.

---

# Border Radius

Buttons

8px

Inputs

8px

Dialogs

12px

Cards

12px

Tables

8px

Keep rounded design consistent.

---

# Shadows

Use Material UI elevations.

Avoid custom shadows.

---

# Layout

Desktop

Sidebar → Topbar → Breadcrumb → Toolbar → Content → Footer

Mobile

Drawer → Topbar → Content

Responsive at all breakpoints.

---

# Sidebar

Collapsed

Expanded

Icons

Labels

Search (future)

Role Based Menu (ADMIN / STAFF — see 01_AGENTS.md § Role & Permission Rules)

Scrollable

Persistent on Desktop

Drawer on Mobile

---

# Topbar

Application Title

Breadcrumb

Notifications

Profile

Theme Switch (future)

Logout

Clean design.

---

# Breadcrumb

Every page must display breadcrumb.

Example

Dashboard → Products → Create Product

---

# Cards

Rounded

Padding

Shadow

Title

Subtitle

Action

Loading

Empty State

Responsive

Never overload cards.

---

# Buttons

Primary — Contained

Secondary — Outlined

Danger, Success, Warning

Loading, Disabled

Icons optional.

Consistent height.

---

# Inputs

Text, Number, Currency, Date, Date Time, Select, Autocomplete, Checkbox, Radio, Switch, Textarea, Search, Image Upload, Password.

All reusable.

---

# Forms

Desktop

2 Columns

Mobile

1 Column

Labels mandatory.

Validation below field.

Required fields marked.

Submit button bottom right.

Cancel button left.

Validation error messages must reflect the backend's field-level errors (see BACKEND_API_CONTRACT.md) as well as client-side Zod validation.

---

# Dialogs

Maximum Width

Responsive

Scrollable

Header

Body

Footer

Primary Action

Secondary Action

Escape closes dialog

Backdrop closes only if safe

---

# Tables

Server Side Pagination

Sorting

Filtering

Searching

Row Hover

Sticky Header

Loading Skeleton

Empty State

Error State

Responsive

No client-side pagination for ERP modules.

Pagination/sort query parameters must follow Spring `Pageable` conventions — see BACKEND_API_CONTRACT.md.

---

# Toolbar

Title

Search

Filters

Actions

Export (future — no backend export endpoint yet, see 04_TASKS.md Phase 09)

Refresh

Responsive layout.

---

# Search

Debounced

Server Side

Clear Button

Loading Indicator

---

# Pagination

Server Driven

Rows Per Page

Current Page

Total Records

Never implement manual pagination.

---

# Dashboard

Cards

Charts

Recent Sales

Recent Purchases

Low Stock

Pending Repairs

Quick Actions

Recent Activity

No CRUD actions.

---

# Charts

Responsive

Minimal

Readable

Legends

Tooltips

No 3D charts.

---

# Loading

Page Loader

Section Loader

Table Skeleton

Button Loading

Image Placeholder

Never show blank UI.

---

# Empty State

Illustration

Title

Description

Primary Action

Example

"No Products Found"

Add Product

---

# Error State

Friendly Message

Retry Button

Support Message

Never expose backend errors.

---

# Snackbar

Success

Error

Warning

Information

Top Right

Auto Hide

Consistent duration.

---

# Confirmation Dialog

Delete

Cancel Purchase

Complete Sale

Mark Repair Complete

Always ask confirmation.

---

# Icons

Material Icons only.

No mixed libraries.

Icons should always have meaning.

---

# Images

Lazy Loading

Preview

Placeholder

Error Fallback

Consistent Size

---

# Responsive Rules

Desktop ≥1200

Laptop 992–1199

Tablet 768–991

Mobile <768

Every page must be tested.

---

# Accessibility

Keyboard Navigation

Focus States

ARIA Labels

Color Contrast

Screen Reader Friendly

Dialogs trap focus.

---

# Animations

Minimal

Fade

Slide

Collapse

No flashy animations.

Animation duration

200–300ms

---

# Notifications

Success — Green

Error — Red

Warning — Orange

Info — Blue

Consistent wording.

---

# Date Format

dd/MM/yyyy

Currency

Indian Rupee ₹

Numbers

Indian Locale

---

# UI Consistency Rules

Every module must look identical.

Only content changes.

Never redesign individual pages.

---

# Design Freeze

Locked

Theme, Colors, Typography, Spacing, Buttons, Dialogs, Tables, Cards, Forms, Responsive Layout, Icons, Animations.

No design changes without approval.

---

END OF 05_UI_STANDARDS.md
