# System Architecture

## Monorepo Structure (Verified & Cleaned)

```
/
├── apps/
│   ├── admin/                    # CANONICAL - Darkone Admin
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── helpers/
│   │   │   ├── hooks/
│   │   │   ├── layouts/
│   │   │   ├── lib/              # Supabase client
│   │   │   ├── routes/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   ├── App.tsx
│   │   │   ├── globle.d.ts
│   │   │   ├── main.tsx
│   │   │   └── vite-env.d.ts
│   │   ├── public/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.node.json
│   │   ├── eslint.config.js
│   │   └── .prettierrc.json
│   │
│   └── public/                   # CANONICAL - Zivan Public
│       ├── src/
│       │   ├── components/       # 35 component folders
│       │   ├── helpers/          # FormateNumber.js, PageTitle.js
│       │   ├── sass/             # SCSS styles
│       │   ├── App.jsx
│       │   ├── index.jsx
│       │   └── main.jsx
│       ├── public/
│       │   ├── data/
│       │   ├── images/
│       │   └── ...
│       ├── zivan-documentation/
│       ├── index.html
│       ├── package.json
│       ├── vite.config.js
│       └── postcss.config.cjs    # Isolated PostCSS config
│
├── packages/
│   └── shared/                   # Placeholder for future shared code
│       ├── ui/
│       ├── package.json
│       └── README.md
│
├── docs/
│   ├── demo-library/             # DEV-ONLY Demo Library reference
│   ├── restorepoints/            # Restore point snapshots
│   ├── backend.md                # Backend architecture + auth
│   └── architecture.md           # This file
│
├── src/                          # Lovable system files
│   ├── integrations/supabase/    # Auto-generated Supabase client
│   └── tailwind.config.lov.json
│
└── [Root config files]           # Vite, TypeScript, Tailwind for Admin
```

---

## Authentication & Authorization

### Auth Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User visits protected route                              │
│     │                                                        │
│     ▼                                                        │
│  2. AuthProvider checks session (localStorage)               │
│     │                                                        │
│     ├── Session exists → Load user data, show page          │
│     │                                                        │
│     └── No session → Redirect to /auth/sign-in              │
│                                                              │
│  3. User signs in                                           │
│     │                                                        │
│     ▼                                                        │
│  4. Supabase validates credentials                          │
│     │                                                        │
│     ▼                                                        │
│  5. onAuthStateChange listener fires                        │
│     │                                                        │
│     ▼                                                        │
│  6. Fetch user profile + roles (deferred)                   │
│     │                                                        │
│     ▼                                                        │
│  7. Update AuthContext state                                │
│     │                                                        │
│     ▼                                                        │
│  8. Redirect to dashboard                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Route Protection Rules

| Route Pattern | Auth Required | Redirect If |
|---------------|---------------|-------------|
| `/dashboards/*` | ✅ Yes | Unauth → `/auth/sign-in` |
| `/content/*` | ✅ Yes | Unauth → `/auth/sign-in` |
| `/crm/*` | ✅ Yes | Unauth → `/auth/sign-in` |
| `/marketing/*` | ✅ Yes | Unauth → `/auth/sign-in` |
| `/system/*` | ✅ Yes | Unauth → `/auth/sign-in` |
| `/auth/sign-in` | ❌ No | Auth → `/dashboards` |
| `/auth/sign-up` | ❌ No | Auth → `/dashboards` |
| `/auth/*` (other) | ❌ No | None |
| `*` (catch-all) | ❌ No | Shows 404 |

### RBAC Model

```
┌───────────────────────────────────────────────────────────┐
│                       RBAC MODEL                           │
├───────────────────────────────────────────────────────────┤
│                                                            │
│  auth.users ──────┬──────> user_profiles                  │
│     (id)          │           (id, email, full_name)      │
│                   │                                        │
│                   └──────> user_roles                     │
│                              (user_id, role)               │
│                                                            │
│  Roles: admin | editor | viewer                           │
│                                                            │
│  Role Check: has_role(user_id, 'admin') → boolean         │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

### Key Files

| File | Purpose |
|------|---------|
| `apps/admin/src/lib/supabase.ts` | Supabase client + role helpers |
| `apps/admin/src/context/useAuthContext.tsx` | Auth state management + role helpers |
| `apps/admin/src/components/guards/RequireAuth.tsx` | RBAC route guards |
| `apps/admin/src/routes/router.tsx` | Route protection logic |
| `apps/admin/src/helpers/Manu.ts` | Role-based sidebar menu filtering |
| `apps/admin/src/types/auth.ts` | Auth type definitions |
| `vite.config.ts` | Root Vite config with `envDir` for monorepo env loading |

### Environment Loading
The monorepo uses a centralized env loading approach:
- Root `.env` contains all `VITE_SUPABASE_*` variables
- Root `vite.config.ts` sets `envDir: path.resolve(__dirname)` to load env from repo root
- Admin client in `apps/admin/src/lib/supabase.ts` throws clear errors if env vars are missing

### Route-Level RBAC

Routes are protected with role-based access control:

| Route Prefix | Required Roles |
|--------------|----------------|
| `/system/*` | `admin` |
| `/content/*` | `admin`, `editor` |
| `/crm/*` | `admin`, `editor` |
| `/marketing/*` | `admin`, `editor` |
| `/dashboards` | Any authenticated |

**Deny-by-Default Behavior:**
- Unauthenticated → redirect to `/auth/sign-in`
- Authenticated but missing role → redirect to `/error-pages/pages-404` (NOT login)
- No role resolution → treated as no roles = deny access to role-restricted routes

---

## Demo Library (DEV-ONLY)

The Demo Library preserves Darkone Admin UI patterns for reference without affecting production builds.

### Purpose
- Read-only reference system for reusable UI patterns
- Curated showcases for charts, forms, tables, icons, modals, layouts
- No production impact (routes don't exist in prod builds)

### Location
- **Routes:** `apps/admin/src/app/(admin)/demo-library/*`
- **Registry:** `docs/demo-library/darkone-demo-library.registry.json`
- **Theme Docs:** `docs/demo-library/Darkone_Admin_Theme.md`

### DEV-ONLY Enforcement
Routes are conditionally loaded in `apps/admin/src/routes/index.tsx`:

```typescript
// DEV ONLY — DO NOT SHIP
const demoLibraryRoutes: RoutesProps[] = import.meta.env.DEV ? [...] : []

// Catch-all 404 route (MUST BE LAST)
const catchAllRoute: RoutesProps[] = [
  { path: '*', name: '404 Catch-All', element: <Error404 /> },
]
```

- **DEV mode:** Routes exist and are accessible at `/demo-library/*`
- **Production:** Routes array is empty, components are tree-shaken
- **Unknown routes:** Catch-all `*` route renders 404 page (not login redirect)

---

## Apps

### Admin (Darkone)

| Aspect | Detail |
|--------|--------|
| **Location** | `/apps/admin` |
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Bootstrap + Custom SCSS |
| **Entry File** | `src/main.tsx` |
| **Purpose** | Content management, CRUD operations |
| **Auth** | Supabase (email/password) |
| **Status** | ✅ Ready |

### Public (Zivan)

| Aspect | Detail |
|--------|--------|
| **Location** | `/apps/public` |
| **Framework** | React 18 + JSX |
| **Build Tool** | Vite |
| **Styling** | Bootstrap + Custom SASS/SCSS |
| **Entry File** | `src/main.jsx` |
| **PostCSS** | Isolated (`postcss.config.cjs`) |
| **Purpose** | Public-facing website |
| **Status** | ✅ Ready |

---

## Package Manager

- **Primary:** Bun
- **Lock files:** `bun.lockb` (single source of truth)

---

## Development Commands

### Admin App (Darkone)
```bash
cd apps/admin && bun install && bun run dev
# Port: 5173
```

### Public App (Zivan)
```bash
cd apps/public && bun install && bun run dev
# Port: 3000
```

---

## Phase History

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | ✅ Complete | Demo Library + safety hardening |
| 2A | ✅ Complete | Sidebar + placeholder routes |
| 2B | ✅ Complete | Dashboard placeholder |
| 3A | ✅ Complete | Supabase Auth + RBAC foundation |

---

## Key Decisions

1. **No refactoring:** Both apps maintain original structure
2. **Separate styling:** SCSS (admin) vs SASS (public) - no mixing
3. **JSX preserved:** Zivan remains JSX, no TSX conversion
4. **Vite for both:** Consistent build tooling across apps
5. **Isolated configs:** PostCSS does not leak across apps
6. **Demo Library DEV-only:** UI reference system not bundled in production
7. **Production/DEV menu separation:** Sidebar shows CMS modules in production, Demo Library + UI Kit in DEV only
8. **Supabase Auth:** Email/password authentication via Supabase
9. **RBAC via separate table:** Roles stored in user_roles, not user_profiles
10. **Route-level RBAC:** Deny-by-default with role requirements per route prefix
11. **Sidebar role filtering:** Menu items hidden if user lacks access

---

*Last updated: 2025-12-14 - Phase 3B RBAC Hardening*
