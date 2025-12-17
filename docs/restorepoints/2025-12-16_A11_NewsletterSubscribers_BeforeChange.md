# Restore Point: Phase A11 — Newsletter Subscribers

**Created:** 2025-12-16
**Phase:** A11 — Newsletter Subscribers (CRUD + Unsubscribe)
**Status:** BEFORE implementation

---

## Scope

Implement Newsletter Subscribers admin module with:
- Full CRUD (Create, Read, Update) operations
- Unsubscribe/Resubscribe toggle (no hard delete in UI)
- Status filter, source filter, email search
- Admin + Editor access (Viewer blocked)
- CSV Import button as "Coming soon" placeholder

---

## Files To Be Modified/Created

| Action | File |
|--------|------|
| **REPLACE** | `apps/admin/src/app/(admin)/marketing/newsletter/page.tsx` |
| **CREATE** | `apps/admin/src/app/(admin)/marketing/newsletter/components/SubscriberFormModal.tsx` |
| **MODIFY** | `docs/backend.md` |
| **MODIFY** | `docs/architecture.md` |

---

## Database Changes

### RLS Policy Updates (newsletter_subscribers table)

**Current Policies:**
- `Admin can read newsletter subscribers` → SELECT for admin only
- `Admin can update newsletter subscribers` → UPDATE for admin only
- `Admin can delete newsletter subscribers` → DELETE for admin only (keep unchanged)

**New Policies:**
- `Admin and Editor can read newsletter subscribers` → SELECT for admin + editor
- `Admin and Editor can insert newsletter subscribers` → INSERT for admin + editor
- `Admin and Editor can update newsletter subscribers` → UPDATE for admin + editor
- (DELETE policy unchanged — not exposed in UI)

---

## Rollback Instructions

### If RLS migration fails:
```sql
-- Revert to admin-only policies
DROP POLICY IF EXISTS "Admin and Editor can read newsletter subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admin and Editor can insert newsletter subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admin and Editor can update newsletter subscribers" ON newsletter_subscribers;

-- Recreate original admin-only policies
CREATE POLICY "Admin can read newsletter subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update newsletter subscribers"
  ON newsletter_subscribers FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));
```

### If UI changes fail:
1. Restore `page.tsx` from git: `git checkout HEAD -- apps/admin/src/app/(admin)/marketing/newsletter/page.tsx`
2. Delete components folder: `rm -rf apps/admin/src/app/(admin)/marketing/newsletter/components/`

---

## Verification Checklist

| # | Check | Pass |
|---|-------|------|
| 1 | Restore point created before code changes | ☐ |
| 2 | RLS policies updated for Admin + Editor access | ☐ |
| 3 | Route `/marketing/newsletter` loads correctly | ☐ |
| 4 | Sidebar link already exists (no new menu item added) | ☐ |
| 5 | List renders with correct columns (email, status, source, subscribed_at) | ☐ |
| 6 | Status filter works (All, Subscribed, Unsubscribed) | ☐ |
| 7 | Source filter works (All, admin, public, import) | ☐ |
| 8 | Search by email works | ☐ |
| 9 | Add Subscriber button visible (Admin + Editor) | ☐ |
| 10 | Form modal opens in create mode, insert works | ☐ |
| 11 | Duplicate email handled with user-friendly toast | ☐ |
| 12 | Edit works correctly | ☐ |
| 13 | Unsubscribe sets is_active=false + unsubscribed_at=now() | ☐ |
| 14 | Resubscribe sets is_active=true + unsubscribed_at=null | ☐ |
| 15 | CSV Import button shows "Coming soon" (disabled) | ☐ |
| 16 | No delete functionality exists in UI | ☐ |
| 17 | Build passes with no errors | ☐ |
| 18 | No console errors on the Newsletter page | ☐ |
| 19 | Docs updated (backend.md, architecture.md) | ☐ |

---

## Pre-Change State

- Newsletter page is placeholder only (shows "No Subscribers Yet" empty state)
- RLS policies allow Admin-only access for SELECT/UPDATE/DELETE
- No INSERT policy exists for admin manual entry
- Route and sidebar item already exist

---

## Dependencies

- Existing `newsletter_subscribers` table schema
- Existing `has_role()` function for RLS
- Supabase client at `@/integrations/supabase/client`
- Auth context at `@/context/useAuthContext`
