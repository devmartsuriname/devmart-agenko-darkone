# System Architecture

---

## Active Documentation Set

| Document | Location | Role |
|----------|----------|------|
| **Primary Kickoff** | [`/docs/kickoff/devmart-internal-platform-kickoff.md`](./kickoff/devmart-internal-platform-kickoff.md) | Project scope, phase gates, non-negotiables |
| **Primary PRD** | [`/docs/prd/prd-devmart-internal-platform.md`](./prd/prd-devmart-internal-platform.md) | Platform-wide requirements (Admin + Frontend) |
| **Secondary PRD** | [`/docs/prd/prd-devmart-company-website.md`](./prd/prd-devmart-company-website.md) | Frontend-specific requirements (Zivan) |
| **Content Contract** | [`/docs/contracts/Admin_Frontend_Content_Contract.md`](./contracts/Admin_Frontend_Content_Contract.md) | Data contract between Admin, Frontend, Supabase (v2.0 FINAL) |
| **Content Data Model** | [`/docs/supabase/Content_Data_Model.md`](./supabase/Content_Data_Model.md) | Supabase schema, RLS, Storage design (Docs Only) |
| **Frontend Cleanup Plan** | [`/docs/frontend/frontend-cleanup-route-reduction-plan.md`](./frontend/frontend-cleanup-route-reduction-plan.md) | Primary execution plan for Zivan cleanup |
| **Frontend Variant Audit** | [`/docs/frontend/frontend-variant-audit.md`](./frontend/frontend-variant-audit.md) | Creative Agency selection audit |
| **Phased Plan (Reference)** | [`/docs/frontend/frontend-cleanup-phased-plan-reference.md`](./frontend/frontend-cleanup-phased-plan-reference.md) | Supporting phased approach (reference only) |
| **Planned Docs** | [`/docs/planned/README.md`](./planned/README.md) | List of missing-but-planned documents |

### Authoritative Documents

- **Scope & Constraints:** Primary Kickoff Checklist
- **Technical Requirements:** Primary PRD (Devmart Internal Platform)
- **Frontend Details:** Secondary PRD (Devmart Company Website)
- **Frontend Cleanup Execution:** Frontend Cleanup Plan (Document #1)
- **Frontend Variant Selection:** Frontend Variant Audit (Document #2) — **Creative Agency ONLY**
- **Backend Schema:** [`/docs/backend.md`](./backend.md)

### Completed Phases (Latest)

| Phase | Description | Status |
|-------|-------------|--------|
| A1–A8 | CRUD Modules (Services, Projects, Blog, Pages, Team, Testimonials, Awards, FAQs) | ✅ Complete |
| A8.1 | UI Parity Fix (Add buttons) | ✅ Complete |
| A10 | Contact Submissions (Read-Only + Deactivate) | ✅ Complete |
| **A11** | Newsletter Subscribers (CRUD + Unsubscribe) | ✅ Complete – Hotfix validated |
| **Phase E** | CRUD Completion Audit (A1–A11) | ✅ Complete |
| Phase F5 | Frontend Detail Pages Wiring (5 pages) | ✅ Complete |
| **Phase F6** | Public Contact Form Wiring | ✅ Complete |
| **Phase F7** | Public Newsletter Form Wiring | ✅ Complete |
| **Hotfix** | Public App date-fns Dependency | ✅ Complete |
| **Phase F8** | Frontend ↔ Admin Alignment Inventory | ✅ Complete (Docs Only) |
| **Phase A12.1** | Hero Sections Admin CRUD | ✅ Complete |
| **Phase A12.2** | Public Hero Wiring Plan | ✅ Documented / Code-reviewed wiring |
| **Phase A12.3** | Section Editing Strategy | ✅ Documented (Planning Only) |
| **Phase A12.4** | Admin Structure Decision | ✅ Documented (Decision Only) |
| **Phase A12.5** | Frontend/Sections Navigation | ✅ Complete (Hero moved from Content → Frontend/Sections) |
| **Phase A12.6** | Hero CTA Admin Alignment | ✅ Complete (CTA fields hidden in admin — Zivan Hero has no CTA) |
| **Phase A12.7** | Public Hero ↔ DB Wiring | ✅ Complete (Read-only wiring verified, tie-breaker sort added) |
| **Phase A12.8** | Home About Sections CRUD | ✅ Complete (New table `home_about_sections`, admin CRUD at `/frontend/sections/home/about`) |
| **Phase A12.9** | Public Home About ↔ DB Wiring | ✅ Complete (Home About fetches from `home_about_sections`, bullets support array + string) |
| **Phase A12.10** | Home FunFacts CRUD | ✅ Complete (New table `home_funfacts`, max 4 items, admin CRUD at `/frontend/sections/home/funfacts`) |
| **Phase A12.11** | Public Home FunFacts ↔ DB Wiring | ✅ Complete (Home FunFacts fetches from `home_funfacts`, fallback when <4 active) |
| **Phase A12.12a** | Home WhyChoose Admin Structure | ✅ Complete (New table `home_whychoose` + JSONB features, admin CRUD) |

---

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

## Phase History & Roadmap

See [`/docs/tasks/Tasks.md`](./tasks/Tasks.md) for detailed task tracking.

### Completed Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | ✅ Complete | Demo Library + safety hardening |
| 2A | ✅ Complete | Sidebar + placeholder routes |
| 2B | ✅ Complete | Dashboard placeholder |
| 3A | ✅ Complete | Supabase Auth + RBAC foundation |
| 3B | ✅ Complete | RBAC Hardening |
| 4 | ✅ Complete | Documentation + Schema Execution |
| F1 | ✅ Complete | Frontend Cleanup (Creative Agency only) |
| F2 | ✅ Complete | Frontend ↔ CMS Wiring |
| F2.1 | ✅ Complete | CMS Wiring Hotfix Gate |
| F3 | ✅ Complete | Branding & Theme Sync |
| F4 | ✅ Complete | Content Seeding |
| A1 | ✅ Complete | Admin CRUD — Services Module |
| A2 | ✅ Complete | Admin CRUD — Projects Module |
| A2.1 | ✅ Complete | UI Cleanup (Modal Parity) |
| A3 | ✅ Complete | Admin CRUD — Blog Posts Module |
| A4 | ✅ Complete | Admin CRUD — Pages Module |
| A5 | ✅ Complete | Admin CRUD — Team Members Module |
| A6 | ✅ Complete | Admin CRUD — Testimonials Module |
| A7 | ✅ Complete | Admin CRUD — Awards Module |
| A8 | ✅ Complete | Admin CRUD — FAQs Module |
| A8.1 | ✅ Complete | UI Parity Fix — Add buttons (Pages, Blog, Services, Projects) |
| A10 | ✅ Complete | Contact Submissions (Read-Only + Deactivate) |
| A11 | ✅ Complete | Newsletter Subscribers (CRUD + Unsubscribe) |
| F6 | ✅ Complete | Public Contact Form Wiring |
| F7 | ✅ Complete | Public Newsletter Form Wiring |

### Upcoming Phases

| Phase | Status | Description |
|-------|--------|-------------|
| — | — | All core content CRUD modules complete |

### Phase A1 Summary (2025-12-15)
- ✅ Services CRUD module complete
- ✅ Route `/content/services` with RBAC
- ✅ List, Create, Edit, Publish/Unpublish, Delete
- ✅ Image upload to Supabase Storage
- ✅ Slug uniqueness validation
- ✅ Admin-only delete, Editor can publish

### Phase F3 Summary (2025-12-15)
- ✅ Admin Branding Settings UI at `/system/settings`
- ✅ `primary_color` stored in `site_settings` table
- ✅ Frontend applies primary color via CSS custom properties
- ✅ RBAC: Admin edits, Editor views, Viewer denied
- ✅ Admin theme unchanged (Darkone styling preserved)

### Phase F1 Summary (2025-12-15)
- ✅ Removed 5 homepage variants (Marketing, Studio, Digital, Tech, CaseStudy)
- ✅ Removed Shop/eCommerce (6 pages + 6 components)
- ✅ Removed 4 Hero variants, 3 About variants, unused sliders
- ✅ Cleaned App.jsx routing to Creative Agency only
- ✅ Admin/CMS untouched

---

## Admin CRUD Pattern (Phase A1+)

### CRUD Module Pattern Documentation

> **MANDATORY STANDARD**: All Admin CRUD module implementations MUST follow the documented pattern.

For comprehensive implementation guidelines, copy/paste templates, Zod normalization rules, and verification checklists, see:

→ [`/docs/patterns/CRUD_Module_Pattern.md`](./patterns/CRUD_Module_Pattern.md)

### Standard CRUD Module Structure
```
apps/admin/src/app/(admin)/content/{module}/
├── page.tsx                    # List page with table
└── components/
    ├── {Module}Form.tsx        # Create/Edit modal
    ├── {Module}DeleteModal.tsx # Delete confirmation
    └── {Module}ImageUpload.tsx # Optional: image upload
```

### RBAC Requirements
| Operation | Roles Required |
|-----------|----------------|
| View List | Admin, Editor |
| Create | Admin, Editor |
| Edit | Admin, Editor |
| Publish/Unpublish | Admin, Editor |
| Delete | Admin only |

### Standard Features
1. **List Page:** Sortable table with status badges, actions column
2. **Create/Edit Form:** Modal with Zod validation, auto-slug generation
3. **Image Upload:** Supabase Storage integration (media bucket)
4. **Slug Uniqueness:** UI pre-check + DB constraint fallback
5. **User Tracking:** `created_by` / `updated_by` fields
6. **Toast Notifications:** Success/error feedback for all actions

### Database Operations Pattern
```typescript
// Create
const { error } = await supabase.from('table').insert({
  ...data,
  created_by: user.id,
})

// Update
const { error } = await supabase.from('table').update({
  ...data,
  updated_by: user.id,
}).eq('id', id)

// Delete (Admin only)
const { error } = await supabase.from('table').delete().eq('id', id)

// Publish
const { error } = await supabase.from('table').update({
  status: 'published',
  published_at: new Date().toISOString(),
  updated_by: user.id,
}).eq('id', id)
```

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
12. **Boolean toggles pattern:** Awards/Testimonials/FAQs use is_active/is_featured instead of status/published_at
13. **CRUD pattern continuity:** Phases A5-A8 (Team, Testimonials, Awards, FAQs) follow consistent pattern with boolean toggles and z.preprocess for field normalization

---

*Last updated: 2025-12-16 - Phase A8 FAQs CRUD Complete*
