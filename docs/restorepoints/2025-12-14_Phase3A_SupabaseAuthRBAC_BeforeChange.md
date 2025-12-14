# Restore Point: Phase 3A - Supabase Auth + RBAC Foundation

**Created:** 2025-12-14
**Phase:** 3A - Supabase Authentication + RBAC Foundation
**Status:** Before Change

---

## Current Auth Flow Behavior

### Authentication Context (`apps/admin/src/context/useAuthContext.tsx`)
- Uses cookie-based session storage with key `_DARKONE_AUTH_KEY_`
- Session stored as JSON in cookies via `cookies-next`
- `saveSession()`: Stores user in cookie + state
- `removeSession()`: Deletes cookie, clears state, redirects to sign-in
- `isAuthenticated`: Checks if cookie exists via `hasCookie()`

### Sign-In Flow (`apps/admin/src/app/(other)/auth/sign-in/useSignIn.ts`)
- Uses `httpClient` (axios mock) to POST to `/login`
- Default credentials: `user@demo.com` / `123456`
- On success: saves session via context, shows notification, redirects
- Fake/demo authentication - not connected to real backend

### Sign-Up Flow (`apps/admin/src/app/(other)/auth/sign-up/components/SignUp.tsx`)
- Form with name, email, password fields
- Currently has no actual submission logic (empty handler)

---

## Current Route Guarding Behavior

### Router (`apps/admin/src/routes/router.tsx`)
- `authRoutes`: Rendered in `AuthLayout` (no auth required)
- `appRoutes`: Rendered in `AdminLayout` only if `isAuthenticated`
- If not authenticated on app routes → redirect to `/auth/sign-in?redirectTo={path}`
- `catchAllRoute`: 404 page, always rendered in `AuthLayout`

### Menu Separation (`apps/admin/src/helpers/Manu.ts`)
- `MENU_ITEMS`: Production CMS modules
- `DEV_MENU_ITEMS`: Demo Library + legacy UI Kit (DEV-only)
- Merge logic: `import.meta.env.DEV ? [...MENU_ITEMS, ...DEV_MENU_ITEMS] : MENU_ITEMS`

---

## User Type Definition (`apps/admin/src/types/auth.ts`)
```typescript
export type UserType = {
  id: string
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: string
  token: string
}
```

---

## Pre-Change Verification
- [x] Dashboard loads at `/dashboards` (requires fake auth)
- [x] Sign-in page loads at `/auth/sign-in`
- [x] Sign-up page loads at `/auth/sign-up`
- [x] Profile dropdown has logout option
- [x] 404 catch-all works for unknown routes
- [x] Demo Library is DEV-only (production sidebar clean)

---

## Files to be Modified
- `apps/admin/src/context/useAuthContext.tsx`
- `apps/admin/src/app/(other)/auth/sign-in/useSignIn.ts`
- `apps/admin/src/app/(other)/auth/sign-up/components/SignUp.tsx`
- `apps/admin/src/components/layout/TopNavigationBar/components/ProfileDropdown.tsx`
- `apps/admin/src/types/auth.ts`
- `apps/admin/src/routes/router.tsx`

## New Files to be Created
- `apps/admin/src/lib/supabase.ts` (admin Supabase client)
