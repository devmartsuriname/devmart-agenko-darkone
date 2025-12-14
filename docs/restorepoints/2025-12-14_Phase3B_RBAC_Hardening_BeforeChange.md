# Restore Point: Phase 3B — RBAC Hardening
**Created:** 2025-12-14
**Phase:** 3B (Before Change)

---

## Current Auth Flow Summary

### Sign-In Flow
1. User submits email/password on `/auth/sign-in`
2. `useAuthContext.signIn()` calls `supabase.auth.signInWithPassword()`
3. `onAuthStateChange` listener fires, updates session
4. `fetchUserData()` loads profile + roles (deferred via setTimeout to avoid deadlock)
5. User redirected to `/dashboards`

### Session Management
- Sessions stored in localStorage via Supabase client
- `onAuthStateChange` listener updates session on any auth event
- `getSession()` called on app init to restore existing session
- `isLoading` state prevents UI flicker during session check

### Redirects
- Unauthenticated → `/auth/sign-in?redirectTo={path}`
- Authenticated on `/auth/sign-in` or `/auth/sign-up` → `/dashboards`
- Unknown routes → 404 page (catch-all)

---

## Current DB Objects

### Tables
- `user_profiles` (id, email, full_name, avatar_url, created_at, updated_at)
- `user_roles` (id, user_id, role, created_at)

### Enum
- `app_role`: 'admin' | 'editor' | 'viewer'

### Constraints
- `user_roles`: unique constraint on (user_id, role)

### Functions (Security Definer)
- `has_role(_user_id uuid, _role app_role) → boolean`
- `get_user_roles(_user_id uuid) → SETOF app_role`
- `handle_new_user() → trigger` (creates profile on signup)
- `update_updated_at_column() → trigger`

### Triggers
- `on_auth_user_created` on `auth.users` → calls `handle_new_user()`
- `update_user_profiles_updated_at` on `user_profiles` → calls `update_updated_at_column()`

### RLS Policies

#### user_profiles
- Users can SELECT their own profile (`auth.uid() = id`)
- Users can UPDATE their own profile (`auth.uid() = id`)
- Users can INSERT their own profile (`auth.uid() = id`)

#### user_roles
- Users can SELECT their own roles (`auth.uid() = user_id`)
- Admins can INSERT roles (`has_role(auth.uid(), 'admin')`)
- Admins can UPDATE roles (`has_role(auth.uid(), 'admin')`)
- Admins can DELETE roles (`has_role(auth.uid(), 'admin')`)

---

## Current Route Guard Logic

### File: `apps/admin/src/routes/router.tsx`

1. **Loading State**: Shows `FallbackLoading` while `isLoading` is true
2. **Auth Routes** (`authRoutes`): 
   - No auth required
   - If authenticated + on `/auth/sign-in` or `/auth/sign-up` → redirect to `/dashboards`
3. **App Routes** (`appRoutes`):
   - Auth required
   - If not authenticated → redirect to `/auth/sign-in?redirectTo={path}`
4. **Catch-All 404**:
   - No auth required
   - Renders `Error404` component
   - Must be last route

### Route Groups (NO RBAC yet)
- All app routes only check `isAuthenticated`, not roles
- `/system/*` routes accessible to any authenticated user (NOT hardened)

---

## Current Sidebar Menu Merge Logic

### File: `apps/admin/src/helpers/Manu.ts`

```typescript
export const getMenuItems = (): MenuItemType[] => {
  if (import.meta.env.DEV) {
    return [...MENU_ITEMS, ...DEV_MENU_ITEMS]
  }
  return MENU_ITEMS
}
```

### Production Menu (`MENU_ITEMS`)
- Dashboard
- Content (Pages, Blog, Projects, Media)
- CRM (Clients, Partners)
- Marketing (Newsletter, SEO)
- System (Users, Roles, Settings, Audit Logs)
- Authentication
- Error Pages

### DEV-Only Menu (`DEV_MENU_ITEMS`)
- Demo Library (Overview, Charts, Forms, Tables, Icons, Modals & Toasts, Layouts)
- UI Kit Legacy (Base UI, Apex, Forms, Tables, Icons, Maps, Layouts)

**Current Issue**: No role-based filtering. All authenticated users see all menu items.

---

## Demo Library DEV-Only Enforcement

### Confirmed Working:
1. **Route Definition** (`apps/admin/src/routes/index.tsx`):
   - `demoLibraryRoutes` array is empty when `!import.meta.env.DEV`
   - Components are lazy-loaded only in DEV
   - Tree-shaking removes demo components from production bundle

2. **Menu Items** (`apps/admin/src/helpers/Manu.ts`):
   - `DEV_MENU_ITEMS` only merged in DEV mode
   - Production sidebar shows only `MENU_ITEMS`

3. **Catch-All 404**:
   - Unknown routes (including `/demo-library/*` in PROD) render 404 page
   - Does NOT redirect to login

---

## Files Involved

| File | Purpose |
|------|---------|
| `apps/admin/src/context/useAuthContext.tsx` | Auth state management |
| `apps/admin/src/routes/router.tsx` | Route protection logic |
| `apps/admin/src/routes/index.tsx` | Route definitions |
| `apps/admin/src/helpers/Manu.ts` | Menu item selector |
| `apps/admin/src/assets/data/menu-items.ts` | Menu item definitions |
| `apps/admin/src/lib/supabase.ts` | Supabase client + role helpers |
| `apps/admin/src/types/auth.ts` | Auth type definitions |

---

## Confirmation

- [x] Sign-in works with Supabase
- [x] Session persists on refresh
- [x] Protected routes redirect properly
- [x] Demo Library DEV-only enforced
- [x] Catch-all 404 behavior correct
- [x] No console errors

---

*This restore point can be used to rollback Phase 3B changes if needed.*
