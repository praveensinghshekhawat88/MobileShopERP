# Phase 2 — Product Module

**Status:** ⬜ Pending

**Master Roadmap:** [TASKS.md](../TASKS.md)

**Task ID Format:** `P02-Txxx`

**Depends on:** [phase-01-authentication.md](./phase-01-authentication.md)

**Flyway Migration:** `V3__product.sql`

---

## Status Legend

⬜ Pending | 🟨 In Progress | 🟩 Completed | 🟥 Blocked

---

# Goal

Implement the complete Product Master module including Brands, Categories, Products, Variants, Dynamic Attributes, Variant Images, Pricing and Product Search.

---

# Business Rules Reference

- BR-009 through BR-031

---

# Database Tables (10)

- brands
- categories (self-referencing via `parent_id`)
- products
- product_variants
- attribute_groups
- attributes
- attribute_values
- product_variant_attributes
- product_images (linked to `variant_id` only)
- product_prices

---

# Section 1 — Brand

- [ ] P02-T001 — Brand Entity
- [ ] P02-T002 — Brand Repository
- [ ] P02-T003 — Brand DTO
- [ ] P02-T004 — Brand Mapper
- [ ] P02-T005 — Brand Service
- [ ] P02-T006 — Brand Controller
- [ ] P02-T007 — Brand CRUD APIs
- [ ] P02-T008 — Brand Unit Tests

---

# Section 2 — Category

- [ ] P02-T009 — Category Entity (self-referencing using `parent_id`)
- [ ] P02-T010 — Category Repository
- [ ] P02-T011 — Category DTO
- [ ] P02-T012 — Category Mapper
- [ ] P02-T013 — Category Service
- [ ] P02-T014 — Category Controller
- [ ] P02-T015 — Category Tree API
- [ ] P02-T016 — Category Unit Tests

---

# Section 3 — Attribute Engine

### Attribute Group

- [ ] P02-T017 — AttributeGroup Entity
- [ ] P02-T018 — AttributeGroup Repository
- [ ] P02-T019 — AttributeGroup DTO
- [ ] P02-T020 — AttributeGroup Mapper
- [ ] P02-T021 — AttributeGroup Service
- [ ] P02-T022 — AttributeGroup Controller

### Attribute

- [ ] P02-T023 — Attribute Entity
- [ ] P02-T024 — Attribute Repository
- [ ] P02-T025 — Attribute DTO
- [ ] P02-T026 — Attribute Mapper
- [ ] P02-T027 — Attribute Service
- [ ] P02-T028 — Attribute Controller

### Attribute Value

- [ ] P02-T029 — AttributeValue Entity
- [ ] P02-T030 — AttributeValue Repository
- [ ] P02-T031 — AttributeValue DTO
- [ ] P02-T032 — AttributeValue Mapper
- [ ] P02-T033 — AttributeValue Service
- [ ] P02-T034 — AttributeValue Controller

---

# Section 4 — Product

- [ ] P02-T035 — Product Entity
- [ ] P02-T036 — Product Repository
- [ ] P02-T037 — Product DTO
- [ ] P02-T038 — Product Mapper
- [ ] P02-T039 — Product Service
- [ ] P02-T040 — Product Controller
- [ ] P02-T041 — Product CRUD APIs
- [ ] P02-T042 — Product Validation
- [ ] P02-T043 — Product Unit Tests

---

# Section 5 — Variant

- [ ] P02-T044 — ProductVariant Entity
- [ ] P02-T045 — ProductVariant Repository
- [ ] P02-T046 — ProductVariant DTO
- [ ] P02-T047 — ProductVariant Mapper
- [ ] P02-T048 — ProductVariant Service
- [ ] P02-T049 — ProductVariant Controller
- [ ] P02-T050 — ProductVariant CRUD APIs

---

# Section 6 — Variant Attributes

- [ ] P02-T051 — ProductVariantAttribute Entity
- [ ] P02-T052 — ProductVariantAttribute Repository
- [ ] P02-T053 — ProductVariantAttribute DTO
- [ ] P02-T054 — ProductVariantAttribute Mapper
- [ ] P02-T055 — ProductVariantAttribute Service
- [ ] P02-T056 — ProductVariantAttribute Controller

---

# Section 7 — Variant Images

Images belong to **Variant**, not Product.

- [ ] P02-T057 — ProductImage Entity
- [ ] P02-T058 — ProductImage Repository
- [ ] P02-T059 — ProductImage DTO
- [ ] P02-T060 — ProductImage Mapper
- [ ] P02-T061 — ProductImage Service
- [ ] P02-T062 — ProductImage Controller
- [ ] P02-T063 — Upload Variant Image
- [ ] P02-T064 — Delete Variant Image
- [ ] P02-T065 — Reorder Variant Images

---

# Section 8 — Product Prices

Price types: MRP, Retail, Wholesale, Dealer, Offer. Maintain complete price history.

- [ ] P02-T066 — ProductPrice Entity
- [ ] P02-T067 — ProductPrice Repository
- [ ] P02-T068 — ProductPrice DTO
- [ ] P02-T069 — ProductPrice Mapper
- [ ] P02-T070 — ProductPrice Service
- [ ] P02-T071 — ProductPrice Controller
- [ ] P02-T072 — Price History
- [ ] P02-T073 — Effective Date Validation

---

# Section 9 — Product Search

- [ ] P02-T074 — Search by Brand
- [ ] P02-T075 — Search by Category
- [ ] P02-T076 — Search by SKU
- [ ] P02-T077 — Search by Barcode
- [ ] P02-T078 — Search by Attribute
- [ ] P02-T079 — Search by Price Range
- [ ] P02-T080 — Pagination
- [ ] P02-T081 — Sorting
- [ ] P02-T082 — Filtering

---

# Section 10 — Testing

- [ ] P02-T083 — Product Module Integration Tests
- [ ] P02-T084 — Product API Tests
- [ ] P02-T085 — Validation Tests
- [ ] P02-T086 — Performance Tests

---

# Exit Criteria

- [ ] Brand CRUD completed
- [ ] Category hierarchy works using `parent_id`
- [ ] Product CRUD completed
- [ ] Variant CRUD completed
- [ ] Dynamic Attribute Engine working
- [ ] Variant Images working (`variant_id` FK only)
- [ ] Multiple Price Types supported
- [ ] Price History maintained
- [ ] Product Search APIs completed
- [ ] All APIs return ApiResponse<T>

---

## Notes

- Never create a separate `sub_categories` table.
- Images are linked to **Product Variants**, not Products.
- **Total Tables (project):** 26 — locked.
