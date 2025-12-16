# Restore Point — Phase A3: Blog Posts CRUD

**Date:** 2025-12-16
**Phase:** A3 — Blog Posts Admin CRUD
**Status:** Before Implementation

---

## Pre-Flight Verification

- Admin navigation: PASS (no blank pages on route transitions)
- Schema verification: PASS (blog_posts table has all required columns)

---

## Files to be Created

| File | Purpose |
|------|---------|
| `apps/admin/src/app/(admin)/content/blog/page.tsx` | Replace placeholder with full CRUD page |
| `apps/admin/src/app/(admin)/content/blog/components/BlogPostForm.tsx` | Create/Edit modal with Zod validation |
| `apps/admin/src/app/(admin)/content/blog/components/BlogPostDeleteModal.tsx` | Admin-only delete confirmation |
| `apps/admin/src/app/(admin)/content/blog/components/BlogPostImageUpload.tsx` | Featured image upload |
| `apps/admin/src/app/(admin)/content/blog/components/TagsInput.tsx` | Tag/chip input for tags array |

## Files to be Modified

| File | Change |
|------|--------|
| `docs/tasks/Tasks.md` | Mark Phase A3 complete |
| `docs/backend.md` | Add Phase A3 documentation |

---

## RBAC Rules

| Role | List | Create | Edit | Publish/Unpublish | Delete |
|------|------|--------|------|-------------------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editor | ✅ | ✅ | ✅ | ✅ | ❌ |
| Viewer | ❌ Route denied | — | — | — | — |

---

## Storage Configuration

- **Bucket:** `media` (existing, public)
- **Upload path:** `blog/{timestamp}-{filename}`

---

## Schema Reference (blog_posts table)

```
title: text (required)
slug: text (required, unique)
excerpt: text (nullable)
content: text (nullable)
featured_image_url: text (nullable)
category: text (nullable)
tags: text[] (nullable)
meta_title: text (nullable)
meta_description: text (nullable)
is_featured: boolean (default: false)
status: text (default: 'draft')
published_at: timestamp (nullable)
author_id: uuid (nullable, FK to team_members)
views_count: integer (default: 0, read-only)
created_at: timestamp
updated_at: timestamp
created_by: uuid (nullable)
updated_by: uuid (nullable)
```

---

## Rollback Instructions

If rollback is needed:
1. Delete `apps/admin/src/app/(admin)/content/blog/components/` directory
2. Restore `apps/admin/src/app/(admin)/content/blog/page.tsx` to placeholder version
3. Revert documentation updates

---

## Confirmation

- ✅ No database migrations required
- ✅ No RLS policy changes
- ✅ No frontend (apps/public) changes
- ✅ Route `/content/blog` already exists
- ✅ Menu item already exists in sidebar

*Last updated: 2025-12-16*
