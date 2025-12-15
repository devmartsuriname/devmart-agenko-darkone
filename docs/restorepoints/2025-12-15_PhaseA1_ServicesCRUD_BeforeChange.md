# Restore Point: Phase A1 — Services CRUD

**Created:** 2025-12-15  
**Phase:** A1 — Admin CRUD Implementation (Services Module)

---

## Purpose

This restore point captures the system state before implementing the Services CRUD module in the admin app.

---

## Files to be Changed/Created

### Modified Files
| File | Change |
|------|--------|
| `apps/admin/src/assets/data/menu-items.ts` | Add "Services" menu item under Content |
| `apps/admin/src/routes/index.tsx` | Add `/content/services` route |
| `docs/tasks/Tasks.md` | Mark Phase A1 Services CRUD as complete |
| `docs/backend.md` | Add Services Admin CRUD section |
| `docs/architecture.md` | Add Admin CRUD pattern section |

### New Files
| File | Purpose |
|------|---------|
| `apps/admin/src/app/(admin)/content/services/page.tsx` | Services list page |
| `apps/admin/src/app/(admin)/content/services/components/ServiceForm.tsx` | Create/Edit modal form |
| `apps/admin/src/app/(admin)/content/services/components/ServiceDeleteModal.tsx` | Delete confirmation modal |
| `apps/admin/src/app/(admin)/content/services/components/ServiceImageUpload.tsx` | Supabase Storage image upload |

---

## RBAC Rules

| Role | View List | Create | Edit | Publish/Unpublish | Delete |
|------|-----------|--------|------|-------------------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editor | ✅ | ✅ | ✅ | ✅ | ❌ |
| Viewer | ❌ | — | — | — | — |

- Route `/content/services` requires `admin` or `editor` role (enforced via existing `ROUTE_ROLE_REQUIREMENTS`)
- Delete action hidden for non-admin users
- Editors CAN publish/unpublish (per locked decision)

---

## Storage Assumptions

- **Bucket:** `media` (public)
- **Path Pattern:** `services/{timestamp}-{filename}`
- **Operations:**
  - Upload: Admin/Editor can upload images
  - Replace: Upload new file, update `image_url` field
  - Remove: Clear `image_url` field only (do NOT delete from storage in this phase)

---

## Database

- **Table:** `services` (already exists with RLS)
- **No schema migrations required**
- **No new RLS policies needed** (existing policies support Editor insert/update, Admin delete)

---

## Slug Uniqueness

- UI pre-check: `SELECT id FROM services WHERE slug = :slug AND id != :currentId LIMIT 1`
- If exists: block save + show inline error "Slug already in use"
- Catch DB unique constraint errors as fallback

---

## Rollback Instructions

If rollback is needed:
1. Delete `apps/admin/src/app/(admin)/content/services/` directory
2. Remove "Services" menu item from `apps/admin/src/assets/data/menu-items.ts`
3. Remove Services route from `apps/admin/src/routes/index.tsx`
4. Revert documentation updates

---

*Last updated: 2025-12-15*
