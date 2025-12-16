# Phase A7 — Awards CRUD — Restore Point

**Date:** 2025-12-16  
**Phase:** A7  
**Module:** Awards CRUD  
**Status:** Before Implementation

---

## Previous Completed Phases

- **A1:** Services CRUD ✅
- **A2:** Projects CRUD ✅
- **A3:** Blog Posts CRUD ✅
- **A4:** Pages CRUD ✅
- **A5:** Team Members CRUD ✅
- **A6:** Testimonials CRUD ✅

---

## Files to Create

| File | Purpose |
|------|---------|
| `apps/admin/src/app/(admin)/content/awards/page.tsx` | List page |
| `apps/admin/src/app/(admin)/content/awards/components/AwardForm.tsx` | Create/Edit modal |
| `apps/admin/src/app/(admin)/content/awards/components/AwardImageUpload.tsx` | Image upload |
| `apps/admin/src/app/(admin)/content/awards/components/AwardDeleteModal.tsx` | Delete confirmation |

## Files to Modify

| File | Change |
|------|--------|
| `apps/admin/src/routes/index.tsx` | Add 1 lazy import + 1 route |
| `apps/admin/src/assets/data/menu-items.ts` | Add 1 menu item under Content |
| `docs/tasks/Tasks.md` | Update A7 status |
| `docs/backend.md` | Add Awards CRUD section |
| `docs/architecture.md` | Update phase status |

---

## Schema Verification (Pre-flight)

**Table:** `awards`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| title | text | NO | - |
| issuer | text | YES | NULL |
| year | integer | YES | NULL |
| description | text | YES | NULL |
| image_url | text | YES | NULL |
| link_url | text | YES | NULL |
| is_featured | boolean | NO | **true** ⚠️ |
| is_active | boolean | NO | **true** |
| sort_order | integer | NO | **0** |
| created_at | timestamptz | NO | now() |
| updated_at | timestamptz | NO | now() |
| created_by | uuid | YES | NULL |
| updated_by | uuid | YES | NULL |

**⚠️ Note:** `is_featured` defaults to TRUE in schema. Form default will be FALSE to prevent all new awards appearing as featured.

---

## Rollback Instructions

If rollback is needed:

1. Delete created files:
   - `apps/admin/src/app/(admin)/content/awards/` (entire folder)

2. Revert modifications:
   - Remove `ContentAwards` lazy import and route from `apps/admin/src/routes/index.tsx`
   - Remove `content-awards` menu item from `apps/admin/src/assets/data/menu-items.ts`

3. Revert documentation updates in `docs/` files.

---

## Implementation Pattern

Following Testimonials (A6) pattern:
- `const { user, isAdmin } = useAuthContext()` only
- NO `userRoles` / `includes('admin')`
- NO Footer imports
- "Add Award" button ABOVE ComponentContainerCard
- Toggles: is_active + is_featured (boolean only, NO status/published_at)
- Delete: admin-only
- z.preprocess for: year (→ null), sort_order (→ 0), link_url (→ null)
