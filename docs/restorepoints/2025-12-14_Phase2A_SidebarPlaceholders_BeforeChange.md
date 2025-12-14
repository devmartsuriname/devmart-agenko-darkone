# Restore Point: Phase 2A Sidebar + Placeholders (Before Change)

**Date:** 2025-12-14
**Phase:** 2A — Sidebar Restructure + Placeholder Routes
**Status:** Captured BEFORE changes

---

## Purpose

This restore point captures the state of key files before implementing:
- 12 CMS placeholder pages
- Production/DEV menu separation
- Route additions for CMS modules

---

## Files Captured

### 1. menu-items.ts (Current Snapshot)

**Location:** `apps/admin/src/assets/data/menu-items.ts`
**Lines:** 405

**Structure Summary:**
- MENU_ITEMS array with:
  - Dashboard (single item)
  - Authentication (children: sign-in, sign-up, reset-password, lock-screen)
  - Error Pages (children: 404, 404-alt)
  - UI Kit (title) + Base UI (21 children)
  - Apex charts
  - Forms (5 children)
  - Tables (2 children)
  - Icons (2 children)
  - Maps (2 children)
  - OTHER (title)
  - Layouts (5 children)
  - Menu Items (nested demo)
  - Disable Item (demo)

### 2. routes/index.tsx (Current Snapshot)

**Location:** `apps/admin/src/routes/index.tsx`
**Key exports:**
- `appRoutes` — includes all admin routes + demoLibraryRoutes (DEV-only)
- `authRoutes` — sign-in, sign-up, reset-password, lock-screen, 404
- `catchAllRoute` — catch-all 404 (separate, no auth)

### 3. helpers/Manu.ts (Current Snapshot)

**Location:** `apps/admin/src/helpers/Manu.ts`
**Function:** `getMenuItems()` returns `MENU_ITEMS` directly

---

## Confirmation: Preview Works

At capture time:
- `/dashboards` loads ✅
- `/auth/sign-in` loads ✅
- `/demo-library` (DEV) loads ✅
- Unknown routes show 404 ✅

---

## Rollback Instructions

If Phase 2A causes issues:
1. Restore `menu-items.ts` from this snapshot (remove new CMS menu structure)
2. Restore `helpers/Manu.ts` (revert to simple export)
3. Delete new placeholder pages under `/content/`, `/crm/`, `/marketing/`, `/system/`
4. Remove new routes from `routes/index.tsx`

---

*Captured by: AI Assistant*
*Reason: Phase 2A execution safety*
