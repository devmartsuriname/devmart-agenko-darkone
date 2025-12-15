# Restore Point: Execute Schema Migration (Before SQL)

**Date:** 2025-12-15  
**Phase:** Phase 4 — Schema Execution  
**Purpose:** Pre-execution checkpoint before CMS tables are created

---

## Confirmation

> ✅ **No SQL executed before this restore point.**  
> This restore point captures state BEFORE any CMS schema migrations are applied.

---

## Timestamp

- **Created:** 2025-12-15
- **Restore Point ID:** ExecuteSchemaMigration_BeforeSQL

---

## Preconditions Verified

| Precondition | Status |
|--------------|--------|
| Content Contract v2.0 FINAL | ✅ Verified |
| Content_Data_Model.md FINAL | ✅ Verified |
| RBAC (admin/editor/viewer) exists | ✅ Verified |
| has_role() function exists | ✅ Verified |
| Demo Library DEV-only intact | ✅ Verified |
| Tasks.md exists | ✅ Verified |

---

## Current Database State (Before Migration)

### Existing Tables
| Table | Purpose | Status |
|-------|---------|--------|
| `user_profiles` | User profile data | ✅ Active |
| `user_roles` | RBAC role assignments | ✅ Active |

### Existing Functions
| Function | Purpose |
|----------|---------|
| `has_role(user_id, role)` | Security definer for role checks |
| `get_user_roles(user_id)` | Returns user's roles |
| `assign_role(target_user_id, role)` | Admin-only role assignment |
| `revoke_role(target_user_id, role)` | Admin-only role revocation |
| `list_users_with_roles()` | Admin-only user listing |
| `handle_new_user()` | Auto-create profile on signup |
| `update_updated_at_column()` | Timestamp trigger |

### Existing Storage Buckets
- None

---

## SQL Files to Be Executed

| Order | File | Purpose |
|-------|------|---------|
| 1 | `docs/supabase/sql/20251215000001_content_schema.sql` | 12 tables, indexes, triggers |
| 2 | `docs/supabase/sql/20251215000002_content_rls.sql` | RLS enable + all policies |
| 3 | `docs/supabase/sql/20251215000003_storage_policies.sql` | Storage buckets + policies |
| 4 | `docs/supabase/sql/seed_content_minimal.sql` | Minimal seed data |

---

## Tables to Be Created (12)

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

---

## Rollback Instructions

If migration fails:
1. Drop newly created tables in reverse FK order
2. Drop storage buckets
3. Verify user_profiles and user_roles intact
4. Verify auth still functions

---

*Created: 2025-12-15*
