# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial repository structure
- Documentation suite (`docs/01`–`05`, `AGENTS.md`, `ARCHITECTURE.md`, `PROJECT_CONTEXT.md`)
- Phase task trackers (`tasks/phase-00` through `phase-10`) with globally unique task IDs (`Pxx-Txxx`)
- Cursor prompt library (`prompts/`) with 40 micro-prompts across 11 module folders
- `prompts/service/` module: repairs, warranty, expenses, audit_logs
- `docs/DOCUMENTATION_CONSISTENCY_REPORT.md` — post-harmonization audit

### Changed

- **Task IDs:** Renumbered all tasks to globally unique format `P00-T001`, `P01-T001`, … `P10-T022` (eliminated collisions)
- **Flyway strategy:** Standardized to locked migration files `V1__foundation.sql` through `V10__future.sql` (removed mixed 001–029 numbering)
- **Database name:** Standardized to `mobile_shop_erp` across all documents
- **Table count:** Updated all references to **Total Tables = 26** (locked)
- **AGENTS.md:** Added `business` and `report` to package structure; updated migration order
- **ARCHITECTURE.md:** Added `report` module, database name, table count, deployment in module flow
- **README.md:** Expanded with full folder purposes, docs index, Flyway map, package list
- **TASKS.md:** Added task ID convention and architecture summary
- **prompts/README.md:** Updated execution order (Service before Reports), Flyway mapping, service folder index
- **Enums standardized:**
  - Payment Mode: CASH, UPI, CARD, BANK_TRANSFER, FINANCE, EMI
  - Repair Status: RECEIVED, CHECKING, WAITING_PARTS, REPAIRING, READY, DELIVERED, CANCELLED
  - Stock Status: AVAILABLE, RESERVED, SOLD, REPAIR, RETURNED, DAMAGED, LOST
- **docs/02_Business_Rules.md:** Updated BR-045, BR-060, BR-064 enum values
- **docs/03_Database_Design.md:** Replaced per-table migration list with locked V1–V10 strategy
- **docs/04_ER_Diagram.md:** Table count summary updated to 26 (diagram unchanged)
- **docs/05_Data_Dictionary.md:** Payment mode enum documented; table count marked locked
- **docs/01_Project_Requirement.md:** Folder structure, milestones aligned with phase roadmap
- **PROJECT_CONTEXT.md:** Repair status enum standardized
- **phase-02-product.md:** Renamed variant image tasks; removed duplicate report tasks from phase-05/07
- **prompts/sales/03_sale_completion_workflow.md:** Warranty creation deferred to service module (`sale_item_id`)

### Fixed (Complete Documentation Consistency Audit — Pass 2)

- **Flyway backticks:** Corrected malformed `\Vn__*.sql\` entries across 18 product, business, purchase, stock, and sales prompts
- **Report prompts:** Fixed broken Flyway formatting in all 7 existing report prompts; added `08_expense_report.md` (P08-T011) and `09_warranty_report.md` (P08-T013)
- **ER diagram:** Warranty relationship aligned to `Sale Items → Warranty` (1:1); stock lifecycle enums uppercased; summary module table aligned with ARCHITECTURE (`Business`, `Reports`)
- **docs/01:** Added Expense Report and Warranty Report to reports list; inventory flow enums already uppercase
- **docs/03:** Added locked database name and table count to document header
- **AGENTS.md:** Added locked Stock Status enum under STOCK RULE
- **prompts/stock/03:** Added missing Flyway Migration row (`V6__inventory.sql`)
- **prompts/README.md:** Report count 7 → 9; total micro-prompts 38 → 40

### Fixed

- Task ID collisions across phases (e.g., T200 used in both Phase 7 and Phase 8)
- Missing `prompts/service/` folder for Phase 7 implementation
- Inconsistent Flyway naming between AGENTS.md and docs/03
- Inconsistent database names (`mobileshop_erp`, `mobileshoperp`, `mobile_shop_erp`)
- Prompt execution order skipping Service module before Reports

### Architecture

- **No architectural changes.** Schema, ER diagram, warranty `sale_item_id` FK, variant images, generic payments, attribute engine, and 26-table model remain locked.
