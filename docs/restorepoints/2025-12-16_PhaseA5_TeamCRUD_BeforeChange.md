# Restore Point — Phase A5: Team Members CRUD

**Date:** 2025-12-16
**Phase:** A5 — Team Members Admin CRUD
**Status:** Before Implementation

---

## Pre-Flight Verification

- Admin navigation: PASS (no blank pages on route transitions)
- Schema verification: PASS (team_members table has all required columns)
- Phase A1-A4 (Services, Projects, Blog, Pages) complete and verified

---

## Files to be Created

| File | Purpose |
|------|---------|
| `apps/admin/src/app/(admin)/content/team/page.tsx` | Full CRUD page for team members |
| `apps/admin/src/app/(admin)/content/team/components/TeamMemberForm.tsx` | Create/Edit modal with Zod validation |
| `apps/admin/src/app/(admin)/content/team/components/TeamMemberDeleteModal.tsx` | Admin-only delete confirmation |
| `apps/admin/src/app/(admin)/content/team/components/TeamMemberImageUpload.tsx` | Avatar image upload |

## Files to be Modified

| File | Change |
|------|--------|
| `apps/admin/src/routes/index.tsx` | Add ContentTeam lazy import + route |
| `apps/admin/src/assets/data/menu-items.ts` | Add Team menu item under Content |
| `docs/tasks/Tasks.md` | Mark Phase A5 complete |
| `docs/backend.md` | Add Phase A5 documentation |
| `docs/architecture.md` | Update phase status |

---

## RBAC Rules

| Role | List | Create | Edit | Toggle Active | Delete |
|------|------|--------|------|---------------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editor | ✅ | ✅ | ✅ | ✅ | ❌ |
| Viewer | ❌ Route denied | — | — | — | — |

---

## Storage Configuration

- **Bucket:** `media` (existing, public)
- **Upload path:** `team/{timestamp}-{filename}`

---

## Schema Reference (team_members table)

```
name: text (required)
slug: text (required, unique)
role: text (required) - job title
bio: text (nullable)
avatar_url: text (nullable)
email: text (nullable)
phone: text (nullable)
social_linkedin: text (nullable)
social_github: text (nullable)
social_twitter: text (nullable)
is_active: boolean (default: true)
is_featured: boolean (default: false)
sort_order: integer (default: 0)
created_at: timestamp
updated_at: timestamp
created_by: uuid (nullable)
updated_by: uuid (nullable)
```

**Key Differences from Other Modules:**
- Uses `is_active` (boolean) instead of `status`/`published_at`
- Has social media link fields
- Has `role` field (job title)

---

## Rollback Instructions

If rollback is needed:
1. Delete `apps/admin/src/app/(admin)/content/team/` directory
2. Remove ContentTeam route from `routes/index.tsx`
3. Remove Team menu item from `menu-items.ts`
4. Revert documentation updates

---

## Confirmation

- ✅ No database migrations required
- ✅ No RLS policy changes
- ✅ No frontend (apps/public) changes
- ✅ New route `/content/team` to be added
- ✅ New menu item to be added under Content

*Last updated: 2025-12-16*
