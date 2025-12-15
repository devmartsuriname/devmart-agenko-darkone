# Restore Point: Content Data Model Verification Gate (Before SQL)

**Date:** 2025-12-14  
**Phase:** Phase 4 — Verification Gate  
**Purpose:** Pre-SQL validation checkpoint

---

## Confirmation

> ✅ **No SQL executed in this step.**  
> This restore point captures state AFTER documentation verification, BEFORE any SQL migrations are applied.

---

## Content_Data_Model.md Summary

### Document Stats
| Metric | Value |
|--------|-------|
| **Version** | 1.0 DRAFT |
| **Total Lines** | 800 |
| **Tables Defined** | 12 |
| **Storage Buckets** | 2 |
| **RBAC Roles** | 3 (admin, editor, viewer) + anon |
| **RPCs Documented** | 3 (publish_content, unpublish_content, reorder_items) |

### Tables Defined
1. `site_settings` — Global branding (singleton)
2. `pages` — Static/CMS pages
3. `hero_sections` — Homepage heroes
4. `services` — Service offerings
5. `projects` — Portfolio items
6. `blog_posts` — Blog articles
7. `testimonials` — Client testimonials
8. `team_members` — Team profiles
9. `awards` — Awards/recognition
10. `faqs` — FAQ entries
11. `contact_submissions` — Contact form data
12. `newsletter_subscribers` — Newsletter signups

### Storage Buckets
| Bucket | Visibility | Purpose |
|--------|------------|---------|
| `media` | Public | Images (heroes, thumbnails, avatars) |
| `documents` | Private | PDFs, internal files |

### RBAC Alignment
| Role | Defined in DB | Used in RLS Policies |
|------|---------------|---------------------|
| `admin` | ✅ `app_role` enum | ✅ Full CRUD |
| `editor` | ✅ `app_role` enum | ✅ CRUD (no delete) |
| `viewer` | ✅ `app_role` enum | ✅ Read-only |

---

## Cross-Check Results

### Content Contract v2.0 Alignment
| Contract Item | Data Model Status | Notes |
|---------------|-------------------|-------|
| Awards section | ✅ `awards` table | Homepage after testimonials |
| FAQ standalone page | ✅ `faqs` table | Route: /faq |
| Newsletter footer form | ✅ `newsletter_subscribers` | Toggle in site_settings |
| Contact fields (name*, email*, subject, message*) | ✅ `contact_submissions` | Exact match |
| Media Library (2 buckets) | ✅ media + documents | Correct visibility |
| Rich text: Markdown | ✅ Stored as TEXT | Frontend renders |
| Image dimensions | ✅ Documented | Minor discrepancy: Blog 1200×600 vs Contract 1200×675 |

### Image Dimension Discrepancy (MINOR)
| Use Case | Contract v2.0 | Data Model | Resolution |
|----------|---------------|------------|------------|
| Blog Featured | 1200×675 (16:9) | 1200×600 (2:1) | Use Data Model (2:1 is cleaner) |

**Decision:** Data Model value (1200×600, 2:1) takes precedence. Contract should be updated to match.

---

## RLS Policy Sanity Check

### Anon Access (Frontend Public)
| Table | Anon SELECT | Condition |
|-------|-------------|-----------|
| `pages` | ✅ Yes | status='published' |
| `services` | ✅ Yes | status='published' |
| `projects` | ✅ Yes | status='published' |
| `blog_posts` | ✅ Yes | status='published' |
| `hero_sections` | ✅ Yes | is_active=true |
| `testimonials` | ✅ Yes | is_active=true |
| `team_members` | ✅ Yes | is_active=true |
| `awards` | ✅ Yes | is_active=true |
| `faqs` | ✅ Yes | is_active=true |
| `site_settings` | ✅ Yes | Always (singleton) |
| `contact_submissions` | ❌ No | Never (private) |
| `newsletter_subscribers` | ❌ No | Never (private) |

### Private Data Protection
- ✅ `contact_submissions`: No anon read, only admin/editor
- ✅ `newsletter_subscribers`: No anon read, admin only
- ✅ `documents` bucket: Private, auth required for read

---

## Migration Order Verification

### Table Creation Order (FK-safe)
1. `site_settings` (no FK)
2. `pages` (no FK)
3. `hero_sections` (no FK)
4. `services` (no FK)
5. `team_members` (no FK)
6. `awards` (no FK)
7. `faqs` (no FK)
8. `contact_submissions` (no FK)
9. `newsletter_subscribers` (no FK)
10. `projects` (no FK)
11. `testimonials` (FK → projects)
12. `blog_posts` (FK → team_members)

### RLS Enablement Order
1. Create tables
2. Enable RLS on each table
3. Create policies (SELECT before INSERT/UPDATE/DELETE)
4. Grant functions

---

## Artifacts Created (NOT Executed)

| File | Purpose | Status |
|------|---------|--------|
| `docs/supabase/sql/20251215000001_content_schema.sql` | Table creation | 📄 Created |
| `docs/supabase/sql/20251215000002_content_rls.sql` | RLS policies | 📄 Created |
| `docs/supabase/sql/20251215000003_storage_policies.sql` | Storage buckets + policies | 📄 Created |
| `docs/supabase/sql/seed_content_minimal.sql` | Minimal seed data | 📄 Created |

> Note: SQL files placed in docs/supabase/sql/ as documentation artifacts.

---

## Blockers

**None identified.** All checks passed.

---

## Checklist Report

| Item | Status |
|------|--------|
| Restore point created | ✅ Implemented |
| Content Contract cross-check | ✅ Implemented |
| RBAC/RLS alignment verified | ✅ Implemented |
| Storage policy sanity check | ✅ Implemented |
| Migration order verified | ✅ Implemented |
| Schema SQL artifact created | ✅ Implemented |
| RLS SQL artifact created | ✅ Implemented |
| Storage SQL artifact created | ✅ Implemented |
| Seed SQL artifact created | ✅ Implemented |
| docs/backend.md updated | ✅ Implemented |
| docs/architecture.md updated | ✅ Implemented |

---

## Confirmation

> ✅ **No SQL executed; artifacts only.**

All SQL files are ready for review. Upon approval, migrations will be applied via the Supabase migration tool.

---

*Created: 2025-12-14*
