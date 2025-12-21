# Restore Point: A15.1 Settings Save Integrity Audit

**Created:** 2025-12-21
**Phase:** A15.1 — Settings Save Integrity Audit
**Status:** INSTRUMENTATION COMPLETE

## Objective
Debug and fix Settings save pipeline that fails to persist data even after clicking "Save All Settings".

## Current State (Database)
- `site_settings` table has 1 row with id: `1663f080-4c55-4f87-a3d3-7e36ff2eded7`
- All contact-related fields are NULL (not persisted yet)
- One admin user exists: `info@devmart.sr` with `admin` role

## RLS Policies on site_settings
- SELECT: Authenticated + Anon can read (qual: true)
- INSERT: Admin only (with_check: has_role(admin))
- UPDATE: Admin OR Editor (qual: has_role(admin) OR has_role(editor))
- DELETE: Admin only (qual: has_role(admin))

## Instrumentation Added

### 1. Console Logging (`[SETTINGS_SAVE]` prefix)
- `SAVE_CLICKED` with timestamp
- Current user email + roles
- canEdit / isAdmin / isEditor status
- settings.id (row being updated)
- Payload keys and value lengths (for security)
- UPDATE/INSERT result with rows affected
- RLS block detection (0 rows = error thrown)
- Verification re-fetch result

### 2. Auth Debug Panel (Top of Settings page)
Visible alert box showing:
- User email
- Assigned roles
- isAdmin / isEditor / canEdit status
- Settings row ID

### 3. Save Status Row (Below Save button)
After any save attempt, shows:
- Last save timestamp
- Result: SUCCESS / ERROR
- Verified: YES / PENDING
- Error message (if any)
- Current user + roles + canEdit

## Files Modified
| File | Change |
|------|--------|
| `apps/admin/src/app/(admin)/system/settings/page.tsx` | Added save instrumentation, auth debug panel, save status row, saveStatus state |
| `docs/backend.md` | Added A15.1 phase documentation |
| `docs/architecture.md` | Added A15.1 to completed phases |

## Expected Diagnostic Output
When user clicks "Save All Settings", console should show:
```
[SETTINGS_SAVE] SAVE_CLICKED at 2025-12-21T...
[SETTINGS_SAVE] Current user: info@devmart.sr Roles: ["admin"]
[SETTINGS_SAVE] canEdit: true isAdmin: true isEditor: false
[SETTINGS_SAVE] settings.id: 1663f080-4c55-4f87-a3d3-7e36ff2eded7
[SETTINGS_SAVE] Payload keys: [site_name, tagline, ...]
[SETTINGS_SAVE] Payload summary: [site_name: string(7), ...]
[SETTINGS_SAVE] Attempting UPDATE for id: 1663f080-...
[SETTINGS_SAVE] UPDATE result: { error: null, rowsAffected: 1, ... }
[SETTINGS_SAVE] Verification result: { verified: true, ... }
[SETTINGS_SAVE] SUCCESS - Save completed and verified
```

If user is NOT logged in or has no admin role:
```
[SETTINGS_SAVE] SAVE_CLICKED at ...
[SETTINGS_SAVE] Current user: undefined Roles: undefined
[SETTINGS_SAVE] canEdit: false isAdmin: false isEditor: false
[SETTINGS_SAVE] BLOCKED: Cannot save: User does not have edit permissions
```

If RLS blocks the update:
```
[SETTINGS_SAVE] UPDATE result: { error: null, rowsAffected: 0, ... }
[SETTINGS_SAVE] RLS_BLOCK: Update returned 0 rows - RLS policy may have blocked the update
```

## Hard Guards
- ❌ No refactors
- ❌ No SCSS changes
- ❌ No schema changes
- ❌ No Contact page styling changes

## Rollback Instructions
Revert `apps/admin/src/app/(admin)/system/settings/page.tsx` to version before this restore point.
