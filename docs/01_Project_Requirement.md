# 01_Project_Requirement.md

---

# Mobile Shop ERP System

**Version:** 1.0

**Document Type:** Project Requirement Document (PRD)

**Prepared By:** Praveen Singh Shekhawat

**Prepared On:** 30 June 2026

---

# 1. Introduction

## 1.1 Project Overview

Mobile Shop ERP is a complete Retail Management System specially designed for mobile shops and electronic stores.

The system will manage:

- Product Master
- Inventory
- Purchase
- Sales
- Repair
- Warranty
- Customer Management
- Supplier Management
- Reports
- Authentication
- Audit Logs

The system will be developed using Java Spring Boot and PostgreSQL following Enterprise Architecture.

---

# 2. Project Objective

The primary objective of this project is to provide a complete ERP solution for mobile retailers.

The software should eliminate manual work and provide:

- Complete inventory tracking
- IMEI Tracking
- Purchase Management
- Sales Management
- Warranty Tracking
- Repair Management
- Reports
- Audit History

---

# 3. Project Goals

The application should:

- Increase inventory accuracy
- Reduce manual work
- Track every mobile by IMEI
- Generate invoices
- Track stock movement
- Manage customer history
- Manage supplier history
- Generate business reports
- Support future multi-branch architecture
- Be scalable for future Retail ERP

---

# 4. Technology Stack

## Backend

- Java 21 LTS
- Spring Boot 3.5.x
- Spring Security
- Spring Data JPA
- Hibernate
- PostgreSQL 17
- Flyway
- JWT Authentication
- MapStruct
- Lombok
- Jakarta Validation
- OpenAPI (Swagger)
- Docker
- GitHub Actions

## Database

- PostgreSQL 17

## API

- REST API
- JSON
- OpenAPI Specification

---

# 5. User Roles

Initially the system will support:

1. Administrator
2. Manager
3. Sales Executive

Future Roles

- Technician
- Accountant
- Warehouse Manager

---

# 6. Functional Modules

## Authentication

Responsibilities

- Login
- Logout
- JWT Authentication
- Password Encryption
- Role Management

---

## Product Management

Responsibilities

- Brand Management
- Category Management
- Product Management
- Product Variant Management
- Product Images
- Product Attributes
- Product Pricing

---

## Purchase Management

Responsibilities

- Supplier Management
- Purchase Entry
- Purchase History
- Purchase Invoice
- Purchase Payment

---

## Inventory Management

Responsibilities

- IMEI Tracking
- Stock Movement
- Stock Availability
- Inventory Reports

---

## Sales Management

Responsibilities

- Customer Management
- Sales Invoice
- Payment Collection
- Sales History

---

## Repair Management

Responsibilities

- Device Receiving
- Repair Status
- Delivery
- Repair Payment

---

## Warranty Management

Responsibilities

- Warranty Tracking
- Warranty Validation

---

## Expense Management

Responsibilities

- Daily Expenses
- Monthly Expenses

---

## Reports

System should provide

- Sales Report
- Purchase Report
- Profit Report
- Stock Report
- Expense Report
- Repair Report
- Warranty Report
- Customer Report
- Supplier Report

---

# 7. Product Flow

Brand

↓

Category

↓

Product

↓

Variant

↓

Attributes

↓

Prices

↓

Purchase

↓

Stock

↓

Sale

↓

Warranty

↓

Repair

---

# 8. Purchase Flow

Supplier

↓

Purchase

↓

Purchase Items

↓

Stock Creation

↓

Inventory Update

---

# 9. Sales Flow

Customer

↓

Sales

↓

Sale Items

↓

Payment

↓

Invoice

↓

Warranty

---

# 10. Repair Flow

Customer

↓

Receive Device

↓

Inspection

↓

Repair

↓

Delivery

↓

Payment

---

# 11. Inventory Flow

Purchase

↓

Stock

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

---

# 12. Business Rules Summary

- Every mobile must have a unique IMEI.
- Every product may contain multiple variants.
- One variant can have multiple prices.
- Every sale generates stock movement.
- Physical delete is not allowed.
- Soft delete will be used.
- Every update should be logged.
- Every transaction must contain created_at and updated_at.
- UUID will be used for business tables.
- Lookup tables will use BIGINT Identity.

---

# 13. Non Functional Requirements

## Performance

- API response should be less than 500 ms.

## Security

- JWT Authentication
- BCrypt Password
- SQL Injection Protection
- Input Validation

## Scalability

- Support more than 100,000 products.
- Support more than 1 Million stock records.

## Availability

- 99.9% uptime target.

---

# 14. Database Strategy

Database
PostgreSQL 17
Migration Tool
Flyway
ORM
Hibernate
Soft Delete
Enabled
Audit
Enabled
UUID
Business Tables
BIGINT
Master Tables
---

# 15. Folder Structure

MobileShopERP

- backend
- database
- docs
- docker
- postman
- prompts
- tasks
- .github

Root Files

- AGENTS.md
- ARCHITECTURE.md
- PROJECT_CONTEXT.md
- TASKS.md
- README.md
- CHANGELOG.md

Database Name (Locked)

mobile_shop_erp

Total Tables (Locked)

26

---

# 16. Coding Standards

- Clean Architecture
- SOLID Principles
- Constructor Injection
- DTO Pattern
- Repository Pattern
- Service Layer
- Global Exception Handling
- MapStruct Mapping
- Flyway Migration
- Swagger Documentation

---

# 17. Future Scope

Future versions may include:

- Multi Branch
- Warehouse Management
- Barcode Printing
- QR Code Support
- React Admin Panel
- Customer Loyalty
- EMI Management
- Exchange Management
- Online Store
- WhatsApp Integration
- SMS Integration
- Payment Gateway Integration

---

# 18. Project Milestones

Phase 0 — Foundation

- Documentation
- Spring Boot project setup
- Docker
- Flyway V1–V10

Phase 1 — Authentication

- roles, users, settings
- JWT security

Phase 2 — Product

- Product master (10 tables)

Phase 3 — Business

- customers, suppliers

Phase 4 — Purchase

Phase 5 — Inventory

Phase 6 — Sales

Phase 7 — Service

- repairs, warranty, expenses, audit_logs

Phase 8 — Reports

Phase 9 — Deployment

Phase 10 — Future

- Multi Branch, Warehouse, React Admin, Integrations

---

# 19. Success Criteria

The project will be considered successful if:

- Inventory is fully trackable.
- Every IMEI is uniquely managed.
- Sales and Purchase workflows are automated.
- Reports are generated correctly.
- APIs are production-ready.
- Database follows 3NF normalization.
- Code follows enterprise coding standards.

---

# 20. Conclusion

The Mobile Shop ERP project aims to build a scalable, secure, and enterprise-grade retail management system using Spring Boot and PostgreSQL. The architecture is designed to support future expansion into a complete Retail ERP platform while maintaining clean architecture, high performance, and maintainability.