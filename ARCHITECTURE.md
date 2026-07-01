# ARCHITECTURE.md

# ==============================================================================
# Mobile Shop ERP
# Software Architecture Document
# Version : 1.0
# ==============================================================================

## Architecture Style

The project follows

- Clean Architecture
- Layered Architecture
- Domain Driven Design (Lightweight)
- REST Architecture
- SOLID Principles

---

# Technology Stack

Language

Java 21 LTS

Framework

Spring Boot 3.5.x

Database

PostgreSQL 17

ORM

Spring Data JPA

Migration

Flyway

Security

Spring Security

JWT

Validation

Jakarta Validation

Documentation

Swagger OpenAPI

Logging

SLF4J + Logback

Testing

JUnit 5

Mockito

Build

Gradle Kotlin DSL

Deployment

Docker

Docker Compose

---

# Project Structure

backend/

src/main/java

com.mobileshoperp

config

common

security

exception

modules

auth

product

business

purchase

inventory

sales

service

report

utility

---

# Module Structure

Every Module follows

module

entity

repository

dto

mapper

service

controller

exception

Example

product/

entity/

repository/

dto/

mapper/

service/

controller/

exception/

---

# Layer Flow

HTTP Request

↓

Controller

↓

Service

↓

Repository

↓

PostgreSQL

No shortcuts allowed.

---

# Module Dependency

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

Service

↓

Reports

↓

Deployment

Modules must remain loosely coupled.

---

# Database Architecture

Database Name (Locked)

mobile_shop_erp

Total Tables (Locked)

26

Module Table Count

| Module | Package | Tables |
|--------|---------|--------|
| Authentication | `modules.auth` | 3 |
| Product | `modules.product` | 10 |
| Business | `modules.business` | 2 |
| Purchase | `modules.purchase` | 2 |
| Inventory | `modules.inventory` | 2 |
| Sales | `modules.sales` | 3 |
| Service | `modules.service` | 2 |
| Utility | `modules.utility` | 2 |
| Reports | `modules.report` | 0 (read-only APIs) |

Master Tables

↓

Business Tables

↓

Transactions

↓

Audit

Master Tables

- roles
- brands
- categories
- attribute_groups
- attributes
- attribute_values
- settings

Business Tables

- users
- products
- product_images
- product_variants
- product_variant_attributes
- product_prices
- customers
- suppliers
- purchases
- purchase_items
- stock
- stock_movements
- sales
- sale_items
- payments
- repairs
- warranty
- expenses
- audit_logs

---

# Product Architecture

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

Price

↓

Stock

Product = Model

Variant = Sellable Item

---

# Attribute Engine

Attribute Group

↓

Attribute

↓

Attribute Value

↓

Variant Attribute

Dynamic system.

No schema changes required for future specifications.

---

# Payment Architecture

Generic Payment Engine

payments

reference_type

reference_id

Supports

SALE

PURCHASE

REPAIR

EXPENSE

---

# Inventory Architecture

Purchase

↓

Purchase Item

↓

Stock

↓

Stock Movement

↓

Sale

↓

Repair

↓

Warranty

Every movement must be traceable.

---

# API Architecture

REST API

Version

/api/v1/

Example

/api/v1/products

/api/v1/customers

/api/v1/sales

Response Format

ApiResponse<T>

---

# Security Architecture

JWT Authentication

↓

Role Authorization

↓

Controller

↓

Service

↓

Repository

Passwords

BCrypt

---

# Exception Architecture

Controller

↓

Service

↓

Business Exception

↓

Global Exception Handler

Never use try-catch in controllers.

---

# Logging Architecture

Controller

↓

Service

↓

Repository

Log Levels

INFO

WARN

ERROR

Never use System.out.println().

---

# Transaction Architecture

@Transactional

Service Layer only.

One business transaction

↓

One database transaction.

---

# Validation Architecture

Client Request

↓

DTO Validation

↓

Business Validation

↓

Database Constraint

Multiple validation layers.

---

# Performance Strategy

Pagination

Lazy Loading

Indexes

Batch Operations

Prepared Statements

Optimized Queries

---

# Database Rules

Business Tables

UUID

Master Tables

BIGINT

Soft Delete

Audit Columns

Referential Integrity

CHECK Constraints

---

# Deployment Architecture

Client

↓

REST API

↓

Spring Boot

↓

PostgreSQL

↓

Docker

↓

Ubuntu Server

---

# Future Architecture

Phase 2

Redis

Reports

Warehouse

Multi Branch

Analytics

Phase 3

React Admin

Notification Service

Payment Gateway

---

# Architecture Principles

Always

Readable

Maintainable

Scalable

Secure

Reusable

Production Ready

Architecture is considered LOCKED.

Do not change architecture without approval.

# ==============================================================================
# END OF ARCHITECTURE.md
# ==============================================================================