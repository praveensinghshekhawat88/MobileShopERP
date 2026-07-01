# PROJECT_CONTEXT.md

# ==============================================================================
# Mobile Shop ERP
# Project Context Document
# Version : 1.0
# ==============================================================================

## Project Name

Mobile Shop ERP

---

# Project Vision

Mobile Shop ERP is an enterprise-grade retail management system designed for mobile stores and electronics retailers.

The project aims to provide a scalable, secure, and production-ready backend that can eventually evolve into a complete Retail ERP platform.

Current focus is Backend API only.

---

# Current Scope

Phase-1 includes

- Spring Boot Backend
- PostgreSQL Database
- REST APIs
- Authentication
- Product Management
- Purchase Management
- Inventory
- Sales
- Repair
- Warranty
- Reports
- Docker Deployment

Current scope DOES NOT include

- React Admin
- Multi Branch
- Warehouse
- Online Store

These will be implemented in later phases.

---

# Business Domain

The business is a Mobile Shop.

The shop sells

- Mobile Phones
- Tablets
- Smart Watches
- Accessories

Future support

- Laptop
- Printer
- Camera
- Consumer Electronics

The system must be generic enough to support all retail products.

---

# Main Business Flow

Supplier

↓

Purchase

↓

Purchase Items

↓

Stock

↓

Sale

↓

Payment

↓

Warranty

↓

Repair

↓

Reports

---

# Product Structure

Brand

↓

Category

↓

Product

↓

Variant

↓

Variant Attributes

↓

Price

↓

Stock

A Product represents a Model.

Example

Samsung Galaxy S25

Variant represents an actual sellable item.

Example

Black

8GB

128GB

---

# Variant Strategy

Every Product

↓

Multiple Variants

Every Variant

↓

Multiple Attribute Values

Examples

Color

RAM

Storage

Processor

Display

Battery

Variant should never store free text specifications.

Everything comes from the Attribute Engine.

---

# Price Strategy

Prices belong to Variant.

A Variant can contain

MRP

Retail Price

Dealer Price

Wholesale Price

Offer Price

Price history should always be maintained.

Old prices must never be overwritten.

---

# Inventory Strategy

Every Purchase Item creates Stock.

Each mobile device has

Unique IMEI

Accessories may not contain IMEI.

Every stock movement must be recorded.

---

# Stock Lifecycle

PURCHASED

↓

AVAILABLE

↓

RESERVED

↓

SOLD

↓

REPAIR

↓

RETURNED

↓

DAMAGED

↓

LOST

Stock history must always be traceable.

---

# Sales Strategy

Every Sale belongs to one Customer.

One Sale contains multiple Sale Items.

Every Sale updates Inventory.

Every Sale generates Stock Movement.

Every Sale may generate Warranty.

---

# Payment Strategy

Payments are generic.

Payment table supports

SALE

PURCHASE

REPAIR

EXPENSE

Never create separate payment tables.

Payment Modes (Locked Enum)

CASH, UPI, CARD, BANK_TRANSFER, FINANCE, EMI

---

# Repair Strategy

Repair can be created for

Sold Device

or

External Device

Repair Status

RECEIVED

CHECKING

WAITING_PARTS

REPAIRING

READY

DELIVERED

CANCELLED

---

# Warranty Strategy

Warranty belongs to Sold Items.

Warranty starts from Sale Date.

Warranty expires automatically based on warranty period.

---

# Category Strategy

Categories are self-referencing.

Example

Electronics

↓

Mobiles

↓

Android Phones

↓

Samsung

Never use a separate sub_categories table.

---

# Attribute Engine

Attribute Groups

↓

Attributes

↓

Attribute Values

↓

Variant Attributes

Examples

Color

Black

Blue

Silver

RAM

8GB

12GB

Storage

128GB

256GB

This engine should support future products without database changes.

---

# Database Strategy

Database

PostgreSQL 17

Migration

Flyway

Business Tables

UUID

Master Tables

BIGINT Identity

Soft Delete

Enabled

Audit

Enabled

---

# Architecture

Architecture follows

Clean Architecture

Layered Architecture

Repository Pattern

DTO Pattern

Service Pattern

SOLID Principles

No business logic inside Controllers.

---

# Security

Authentication

JWT

Password Encryption

BCrypt

Role Based Authorization

All secured APIs require authentication.

---

# Coding Principles

Readable Code

Reusable Code

Maintainable Code

Scalable Code

Production Ready Code

Never generate demo implementations.

---

# API Principles

REST API

Plural Resources

Versioned URLs

/api/v1/products

/api/v1/customers

/api/v1/sales

Standard Response Format

ApiResponse<T>

---

# Development Workflow

Always develop in this order

Authentication

↓

Product

↓

Business

↓

Purchase

↓

Inventory

↓

Sales

↓

Repair

↓

Reports

Never skip sequence.

---

# Future Roadmap

Phase 2

- Warehouse
- Multi Branch
- Expense Categories
- Dashboard Analytics
- Advanced Reports

Phase 3

- React Admin
- Barcode Printing
- QR Code
- Notification
- Payment Gateway
- SMS
- WhatsApp Integration

---

# Project Goal

The final product should be

Production Ready

Enterprise Grade

Highly Maintainable

Scalable

Secure

Performance Optimized

Easy to Extend

The project should follow software engineering best practices and should not require major architectural changes in future releases.

# ==============================================================================
# END OF PROJECT_CONTEXT.md
# ==============================================================================