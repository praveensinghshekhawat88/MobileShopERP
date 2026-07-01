# 02_Business_Rules.md

---

# Mobile Shop ERP

## Business Rules Document

Version : 1.0

Prepared By : Praveen Singh Shekhawat

---

# 1. Authentication Rules

### BR-001

Every user must have one unique mobile number.

---

### BR-002

Email address must be unique if provided.

---

### BR-003

Passwords must always be stored using BCrypt hashing.

---

### BR-004

Only active users can login.

---

### BR-005

JWT Token expiration time

8 Hours

---

### BR-006

Inactive users cannot access APIs.

---

### BR-007

Only Admin can create users.

---

### BR-008

Only Admin can deactivate users.

---

# 2. Product Rules

### BR-009

Every product belongs to exactly one Brand.

---

### BR-010

Every product belongs to exactly one Category.

---

### BR-011

One product can have multiple variants.

Example

Samsung Galaxy S25

↓

Black 8/128

↓

Blue 12/256

↓

Silver 8/256

---

### BR-012

Every variant must belong to one Product.

---

### BR-013

Product names should be unique within the same Brand.

---

### BR-014

Deleted products cannot be sold.

---

### BR-015

Products will use Soft Delete only.

---

# 3. Variant Rules

### BR-016

Each Variant must have one SKU.

---

### BR-017

SKU must be unique.

---

### BR-018

Barcode must be unique if available.

---

### BR-019

One Variant can have multiple prices.

---

### BR-020

Variant Images belong to Variant.

Not Product.

---

# 4. Attribute Rules

### BR-021

Attribute Groups define categories of attributes.

Example

Color

RAM

Storage

Processor

---

### BR-022

Attributes belong to one Attribute Group.

---

### BR-023

Attribute Values belong to one Attribute.

---

### BR-024

One Variant may have multiple Attribute Values.

---

### BR-025

Duplicate Attribute Values are not allowed under the same Attribute.

---

### BR-026

Variant Attributes must reference Attribute Values.

Never store free text.

---

# 5. Price Rules

### BR-027

One Variant can have multiple Prices.

---

### BR-028

Price Types

- MRP
- Retail
- Wholesale
- Dealer
- Offer

---

### BR-029

Only one active Retail price is allowed per Variant.

---

### BR-030

Price history must never be deleted.

---

### BR-031

Price changes should create a new record.

Never update history.

---

# 6. Supplier Rules

### BR-032

Supplier mobile number should be unique.

---

### BR-033

Supplier cannot be physically deleted.

---

### BR-034

Inactive suppliers cannot be selected in new Purchases.

---

# 7. Purchase Rules

### BR-035

One Purchase belongs to one Supplier.

---

### BR-036

One Purchase contains multiple Purchase Items.

---

### BR-037

Purchase Invoice Number must be unique.

---

### BR-038

Purchase cannot be deleted after stock generation.

---

### BR-039

Cancelling Purchase should reverse stock.

---

### BR-040

Purchase Total must equal sum of Purchase Items.

---

# 8. Inventory Rules

### BR-041

Each Mobile must have a unique IMEI.

---

### BR-042

Duplicate IMEI is never allowed.

---

### BR-043

Accessories may not contain IMEI.

---

### BR-044

Every Purchase Item creates Stock.

---

### BR-045

Stock Status

- AVAILABLE
- RESERVED
- SOLD
- REPAIR
- RETURNED
- DAMAGED
- LOST

---

### BR-046

Stock Movement must be recorded for every stock change.

---

### BR-047

Stock quantity cannot become negative.

---

# 9. Customer Rules

### BR-048

Customer mobile number should be unique.

---

### BR-049

Customers cannot be physically deleted.

---

### BR-050

Customer purchase history must always remain available.

---

# 10. Sales Rules

### BR-051

One Sale belongs to one Customer.

---

### BR-052

One Sale contains multiple Sale Items.

---

### BR-053

Invoice Number must be unique.

---

### BR-054

Selling unavailable stock is not allowed.

---

### BR-055

Stock status changes to SOLD after successful Sale.

---

### BR-056

Cancelling Sale restores Stock.

---

### BR-057

Sale Total must equal sum of Sale Items.

---

# 11. Payment Rules

### BR-058

Payments are generic.

Reference Types

- SALE
- PURCHASE
- REPAIR
- EXPENSE

---

### BR-059

Multiple payments are allowed for one reference.

---

### BR-060

Payment Modes

- CASH
- UPI
- CARD
- BANK_TRANSFER
- FINANCE
- EMI

---

### BR-061

Partial payment is supported.

---

### BR-062

Payment amount cannot exceed pending amount.

---

# 12. Repair Rules

### BR-063

Repair can be created for sold or external devices.

---

### BR-064

Repair Status

- RECEIVED
- CHECKING
- WAITING_PARTS
- REPAIRING
- READY
- DELIVERED
- CANCELLED

---

### BR-065

Repair history must never be deleted.

---

# 13. Warranty Rules

### BR-066

Warranty starts from Sale Date.

---

### BR-067

Warranty expiry must be calculated automatically.

---

### BR-068

Expired Warranty cannot be claimed.

---

# 14. Audit Rules

### BR-069

Every Create operation must be logged.

---

### BR-070

Every Update operation must be logged.

---

### BR-071

Every Delete operation must be logged.

---

### BR-072

Every Login must be logged.

---

# 15. Soft Delete Rules

### BR-073

Business tables use Soft Delete.

---

### BR-074

Deleted records are never permanently removed.

---

# 16. Validation Rules

### BR-075

Required fields must never be NULL.

---

### BR-076

Mobile numbers must be valid.

---

### BR-077

GST Number format must be validated.

---

### BR-078

Email format must be validated.

---

### BR-079

Prices must always be positive.

---

### BR-080

Quantities must always be greater than zero.

---

# 17. Security Rules

### BR-081

JWT required for every secured API.

---

### BR-082

Passwords must never be returned in API responses.

---

### BR-083

Unauthorized requests must return HTTP 401.

---

### BR-084

Forbidden requests must return HTTP 403.

---

# 18. Reporting Rules

### BR-085

Reports must never modify business data.

---

### BR-086

Reports should support date filters.

---

### BR-087

Reports should support pagination where applicable.

---

# 19. Database Rules

### BR-088

Business Tables use UUID.

---

### BR-089

Master Tables use BIGINT Identity.

---

### BR-090

Every Business Table must contain:

- created_at
- updated_at
- created_by
- updated_by
- deleted_at

---

# 20. General Rules

### BR-091

No Physical Delete.

---

### BR-092

Every transaction must be atomic.

---

### BR-093

All APIs should return standard response format.

---

### BR-094

Every Exception must be handled globally.

---

### BR-095

Flyway must manage every database change.

---

### BR-096

Never use Hibernate ddl-auto in Production.

---

### BR-097

Use Constructor Injection only.

---

### BR-098

Use DTOs for every API.

---

### BR-099

Use MapStruct for object mapping.

---

### BR-100

All code must follow Clean Architecture and SOLID Principles.