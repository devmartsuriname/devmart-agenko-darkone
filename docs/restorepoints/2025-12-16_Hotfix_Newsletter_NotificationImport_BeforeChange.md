# Restore Point: Hotfix Newsletter Notification Import

**Created:** 2025-12-16
**Phase:** A11 Hotfix (Build Fix)

## Error Message

```
error during build:
[vite:load-fallback] Could not load /builds/1/project/apps/admin/src/helpers/Notification 
(imported by apps/admin/src/app/(admin)/marketing/newsletter/page.tsx): 
ENOENT: no such file or directory, open '/builds/1/project/apps/admin/src/helpers/Notification'
```

## Root Cause

Newsletter module files import `showNotification` from `@/helpers/Notification`, but this file does not exist. The canonical notification system in this admin app uses `useNotificationContext` from `@/context/useNotificationContext`.

## Files to Touch

1. `apps/admin/src/app/(admin)/marketing/newsletter/page.tsx`
   - Remove: `import { showNotification } from '@/helpers/Notification'`
   - Add: `import { useNotificationContext } from '@/context/useNotificationContext'`
   - Add: `const { showNotification } = useNotificationContext()` inside component

2. `apps/admin/src/app/(admin)/marketing/newsletter/components/SubscriberFormModal.tsx`
   - Remove: `import { showNotification } from '@/helpers/Notification'`
   - Add: `import { useNotificationContext } from '@/context/useNotificationContext'`
   - Add: `const { showNotification } = useNotificationContext()` inside component

## Rollback Steps

If this hotfix causes issues:

1. Revert `apps/admin/src/app/(admin)/marketing/newsletter/page.tsx` to previous version
2. Revert `apps/admin/src/app/(admin)/marketing/newsletter/components/SubscriberFormModal.tsx` to previous version
3. Run `vite build` to confirm rollback success

## Verification Checklist

- [ ] `vite build --mode development` passes
- [ ] `vite build` (production) passes
- [ ] `/marketing/newsletter` route loads without errors
- [ ] Toast notifications appear correctly on actions
