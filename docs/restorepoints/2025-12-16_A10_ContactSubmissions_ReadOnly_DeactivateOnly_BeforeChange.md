# Restore Point: Phase A10 — Contact Submissions (Read-Only + Deactivate Only)

**Date:** 2025-12-16  
**Phase:** A10  
**Type:** Feature Implementation (Read-Only CMS Module)

---

## Scope

Implement the Admin module for `contact_submissions` as **READ-ONLY** with:
- List view with filters (status, search)
- View modal (read-only details)
- Deactivate/Reactivate actions (Admin-only)
- Auto "Mark as Read" when viewing a 'new' submission

**NOT included:**
- No Edit functionality
- No Delete functionality
- No DB schema changes (using existing `status` column: new/read/archived)
- No Public App contact form wiring

---

## Files to be Touched

### Created
1. `apps/admin/src/app/(admin)/crm/contact-submissions/page.tsx` — List page
2. `apps/admin/src/app/(admin)/crm/contact-submissions/components/ContactSubmissionViewModal.tsx` — View modal

### Modified
1. `apps/admin/src/assets/data/menu-items.ts` — Add menu item under CRM
2. `apps/admin/src/routes/index.tsx` — Add lazy import + route entry
3. `docs/backend.md` — Add A10 phase section
4. `docs/architecture.md` — Update completed phases

---

## Intended UX

1. **List Page:**
   - Columns: Name, Email, Subject, Status badge, Submitted date, Actions
   - Sorting: newest first (created_at desc)
   - Filters: Status dropdown (All/New/Read/Archived), Search input
   - Actions: View button (all), Deactivate/Reactivate (Admin-only)

2. **View Modal:**
   - Read-only display of all submission fields
   - Status badge + submitted timestamp
   - Copy-to-clipboard for Email and Message
   - Deactivate/Reactivate buttons (Admin-only)
   - Auto "Mark as Read" on open if status === 'new'

3. **Deactivate/Reactivate:**
   - Deactivate: status → 'archived'
   - Reactivate: status → 'read'
   - Both require Admin role
   - Toast notification on success/failure
   - List refresh after action

---

## RBAC

| Role   | View List | View Modal | Deactivate/Reactivate |
|--------|-----------|------------|----------------------|
| Admin  | ✅        | ✅         | ✅                   |
| Editor | ✅        | ✅         | ❌                   |
| Viewer | ❌ (route blocked) | ❌ | ❌              |

---

## Rollback Notes

```bash
# If rollback needed, revert to commit before A10 changes:
git log --oneline -10  # Find commit hash before A10
git revert <commit_hash>

# Or manually:
# 1. Remove created files:
rm -rf apps/admin/src/app/(admin)/crm/contact-submissions/

# 2. Revert menu-items.ts changes (remove crm-contact-submissions entry)
# 3. Revert routes/index.tsx changes (remove CrmContactSubmissions import and route)
# 4. Revert docs/backend.md and docs/architecture.md A10 sections
```

---

## Verification Checklist

| # | Check | Status |
|---|-------|--------|
| 1 | Restore point created before code changes | ⬜ |
| 2 | Route `/crm/contact-submissions` loads directly via URL | ⬜ |
| 3 | Sidebar link under CRM navigates correctly | ⬜ |
| 4 | List renders with correct columns, sorted newest first | ⬜ |
| 5 | Status filter works (default shows all except archived) | ⬜ |
| 6 | Search input filters by name/email/subject | ⬜ |
| 7 | View modal opens and displays all required fields | ⬜ |
| 8 | Opening a 'new' submission marks it 'read' automatically | ⬜ |
| 9 | Deactivate (Admin-only) sets status to 'archived' + refreshes | ⬜ |
| 10 | Reactivate (Admin-only) sets status to 'read' + refreshes | ⬜ |
| 11 | No edit capability exists anywhere | ⬜ |
| 12 | No delete capability exists anywhere | ⬜ |
| 13 | Viewer role is blocked (redirect/404) | ⬜ |
| 14 | `vite build` passes, no console errors | ⬜ |
| 15 | Docs updated (backend.md + architecture.md) | ⬜ |

---

## Dependencies

- Supabase `contact_submissions` table (existing)
- Existing RLS policies (Admin+Editor can SELECT+UPDATE)
- No new packages required
