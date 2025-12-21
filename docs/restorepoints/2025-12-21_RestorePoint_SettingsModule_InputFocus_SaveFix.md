# Restore Point: Settings Module Input Focus & Save Fix

**Created:** 2025-12-21
**Type:** Regression Fix

## Problem Summary

The System → Settings module had critical regressions:

1. **Input Focus Loss**: Typing stopped after a single character, requiring re-click to continue
2. **Save Not Persisting**: "Save All Settings" button did not persist changes
3. **URL Validation Error**: CTA Button Link rejected valid relative paths like `/contact`

## Root Causes Identified

### 1. Input Focus Loss (CRITICAL)
- **File:** `apps/admin/src/app/(admin)/system/settings/page.tsx`
- **Location:** Lines 394-466
- **Cause:** `TextField` and `UrlField` components were defined **inside** the `SystemSettingsPage` function component
- **Effect:** Every state change (keystroke) caused React to:
  1. Re-render `SystemSettingsPage`
  2. Create NEW `TextField` and `UrlField` function definitions
  3. React sees these as different components (different function references)
  4. React unmounts old input, mounts new input → **focus lost**

### 2. Save Blocking
- **File:** `apps/admin/src/app/(admin)/system/settings/page.tsx`
- **Location:** Line 440 (`type="url"`)
- **Cause:** `UrlField` used HTML5 `type="url"` attribute, which requires full URLs
- **Effect:** Browser validation blocked form submission when relative paths like `/contact` were entered
- **Result:** `handleSave` never executed, changes never persisted

## Files Touched

| File | Change |
|------|--------|
| `apps/admin/src/app/(admin)/system/settings/page.tsx` | Move TextField/UrlField outside component; Change CTA link to type="text" |
| `docs/backend.md` | Document the fix |
| `docs/architecture.md` | Update phase status |

## Before/After Behavior

| Behavior | Before | After |
|----------|--------|-------|
| Typing in fields | Stops after 1 char | Continuous typing works |
| CTA Button Link `/contact` | Browser validation error | Accepted without error |
| Save All Settings | Form blocked, no persist | Saves to DB, persists on refresh |
| Focus stability | Lost on every keystroke | Stable until user clicks away |

## Fix Applied

1. **Moved `TextField` and `UrlField` OUTSIDE `SystemSettingsPage`** (top-level module scope)
2. **Changed props from closure-based to explicit**: `value`, `onChange`, `disabled` passed explicitly
3. **Changed CTA Button Link** from `UrlField` (type="url") to `TextField` (type="text")

## Rollback Instructions

If this fix causes issues, revert by:

1. **Restore the inline component definitions** (move TextField/UrlField back inside SystemSettingsPage)
2. **Restore closure-based props** (use `field` prop instead of explicit `value`/`onChange`)
3. **Restore UrlField for CTA Button Link** (line 969)

**Warning:** Rollback will reintroduce the focus loss and save blocking bugs.

## Verification Checklist

- [ ] Typing continuously works in General tab (Site Name, Tagline)
- [ ] Typing continuously works in Footer tab (email, phone, address)
- [ ] Typing continuously works in CTA tab (heading, button text)
- [ ] CTA Button Link accepts `/contact` without browser validation error
- [ ] Save All Settings persists after page refresh
- [ ] DB shows updated values after save
- [ ] No console errors
- [ ] No Darkone SCSS changes
- [ ] No Zivan layout changes
