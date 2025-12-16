# Restore Point: UI Parity Fix — Add Buttons (Pages, Blog, Services, Projects)

**Created:** 2025-12-16  
**Scope:** UI parity fix — Add missing Add buttons on 4 CRUD modules

---

## Current State (Before Change)

All 4 modules have Add buttons passed as props to `ComponentContainerCard` which do NOT render:

| Module | File | Problem |
|--------|------|---------|
| Pages | `apps/admin/src/app/(admin)/content/pages/page.tsx` | `headerAction` prop (line 147-152) not rendering |
| Blog | `apps/admin/src/app/(admin)/content/blog/page.tsx` | `titleEnd` prop (line 147-152) not rendering |
| Services | `apps/admin/src/app/(admin)/content/services/page.tsx` | `headerAction` prop (line 145-150) not rendering |
| Projects | `apps/admin/src/app/(admin)/content/projects/page.tsx` | `headerAction` prop (line 145-150) not rendering |

## Target State (After Change)

All 4 modules will have Add buttons in standalone div ABOVE `ComponentContainerCard`, matching Team/FAQs/Awards/Testimonials pattern.

## Files to Modify

1. `apps/admin/src/app/(admin)/content/pages/page.tsx`
2. `apps/admin/src/app/(admin)/content/blog/page.tsx`
3. `apps/admin/src/app/(admin)/content/services/page.tsx`
4. `apps/admin/src/app/(admin)/content/projects/page.tsx`

## Rollback Instructions

If changes cause issues, revert the 4 files above to their previous state. The key change to undo:
- Remove the standalone div with button above ComponentContainerCard
- Restore the `headerAction` or `titleEnd` prop on ComponentContainerCard

Git command (if using git):
```bash
git checkout HEAD -- apps/admin/src/app/\(admin\)/content/pages/page.tsx
git checkout HEAD -- apps/admin/src/app/\(admin\)/content/blog/page.tsx
git checkout HEAD -- apps/admin/src/app/\(admin\)/content/services/page.tsx
git checkout HEAD -- apps/admin/src/app/\(admin\)/content/projects/page.tsx
```

## RBAC Notes

- Add button visibility: Viewer denied at route level, so all users who reach these pages (Admin + Editor) can see Add button
- Delete remains Admin-only (unchanged)
- No changes to AuthContext or RBAC logic

## Verification Checklist

- [ ] Pages: Add button visible, opens create modal, insert works
- [ ] Blog: Add button visible, opens create modal, insert works
- [ ] Services: Add button visible, opens create modal, insert works
- [ ] Projects: Add button visible, opens create modal, insert works
- [ ] vite build passes
- [ ] No console errors
