# Backend Architecture

## Overview

This document describes the backend architecture for the Zivan-Darkone monorepo.

---

## Current Phase

**Phase A12.10 — Home FunFacts CRUD (Complete)**

### CRUD Pattern Authority Statement

> **MANDATORY STANDARD**: All Admin CMS CRUD module implementations (A1–A∞) MUST follow the documented pattern in [`/docs/patterns/CRUD_Module_Pattern.md`](./patterns/CRUD_Module_Pattern.md). Deviations require explicit approval. This pattern covers: folder structure, Zod normalization, RBAC guards, toggle patterns, audit fields, and verification checklists.

| Phase | Status |
|-------|--------|
| Phase 1 — Admin Demo Library | ✅ Complete |
| Phase 2 — Admin Cleanup | ✅ Complete |
| Phase 3A — Supabase Auth | ✅ Complete |
| Phase 3B — RBAC Hardening | ✅ Complete |
| Phase 4 — Schema Execution | ✅ Complete |
| Phase F1 — Frontend Cleanup | ✅ Complete |
| Phase F2 — Frontend ↔ CMS Wiring | ✅ Complete |
| Phase F2.1 — CMS Wiring Hotfix | ✅ Complete |
| Phase F3 — Branding & Theme Sync | ✅ Complete |
| Phase F4 — Content Seeding & QA | ✅ Complete |
| Phase F5 — Frontend Detail Pages Wiring | ✅ Complete |
| **Phase F6 — Public Contact Form Wiring** | ✅ Complete |
| **Phase F7 — Public Newsletter Form Wiring** | ✅ Complete |
| **Hotfix — Public App date-fns Dependency** | ✅ Complete |
| Phase A1 — Services CRUD | ✅ Complete |
| Phase A2 — Projects CRUD | ✅ Complete |
| Phase A2.1 — UI Cleanup | ✅ Complete |
| Phase A3 — Blog Posts CRUD | ✅ Complete |
| Phase A4 — Pages CRUD | ✅ Complete |
| Phase A5 — Team Members CRUD | ✅ Complete |
| Phase A6 — Testimonials CRUD | ✅ Complete |
| Phase A7 — Awards CRUD | ✅ Complete |
| Phase A8 — FAQs CRUD | ✅ Complete |
| Phase A8.1 — UI Parity Fix | ✅ Complete |
| Phase A10 — Contact Submissions (Read-Only) | ✅ Complete |
| **Phase A11 — Newsletter Subscribers (CRUD + Unsubscribe)** | ✅ Complete – Hotfix validated (build-blocker resolved) |
| **Phase E — CRUD Completion Audit (A1–A11)** | ✅ Complete |
| **Phase F8 — Frontend ↔ Admin Alignment Inventory** | ✅ Complete (Docs Only) |
| **Phase A12.1 — Hero Sections Admin CRUD** | ✅ Complete |
| **Phase A12.2 — Public Hero Wiring Plan** | ✅ Documented / Code-reviewed wiring |
| **Phase A12.3 — Section Editing Strategy** | ✅ Documented (Planning Only) |
| **Phase A12.4 — Admin Structure Decision** | ✅ Documented (Decision Only) |
| **Phase A12.5 — Frontend/Sections Navigation** | ✅ Complete (Hero moved from Content → Frontend/Sections) |
| **Phase A12.6 — Hero CTA Admin Alignment** | ✅ Complete (CTA fields hidden in admin form — Zivan Hero has no CTA) |
| **Phase A12.7 — Public Hero ↔ DB Wiring** | ✅ Complete (Read-only wiring verified, tie-breaker sort added) |
| **Phase A12.8 — Home About Sections CRUD** | ✅ Complete (New table `home_about_sections`, admin CRUD at `/frontend/sections/home/about`) |
| **Phase A12.9 — Public Home About ↔ DB Wiring** | ✅ Complete (Home About fetches from `home_about_sections`, bullets support array + string) |
| **Phase A12.10 — Home FunFacts CRUD** | ✅ Complete (New table `home_funfacts`, max 4 items enforced, admin CRUD at `/frontend/sections/home/funfacts`) |
| **Phase A12.11 — Public Home FunFacts ↔ DB Wiring** | ✅ Complete (Home FunFacts fetches from `home_funfacts`, fallback when <4 active) |
| **Phase A12.12a — Home WhyChoose Admin Structure** | ✅ Complete (New table `home_whychoose` with JSONB features, admin CRUD at `/frontend/sections/home/whychoose`) |
| **Phase A12.12b — Public Home WhyChoose ↔ DB Wiring** | ✅ Complete (Home WhyChoose fetches from `home_whychoose`, all-or-nothing fallback when no active record or invalid features; Zivan component unchanged — wiring only) |
| **Phase A12.12b — Quality Gates Verification** | ✅ PASS (Fallback verified with 0 active DB rows; no console errors; DB seeding intentionally deferred) |
| **Phase A12.13 — WhyChoose Admin Data Seeding** | ✅ Complete (1 active record with 3 features seeded; public renders DB data; no schema/RLS changes) |
| **Phase A12.14 — FunFacts Admin Data Seeding** | ✅ Complete (4 active records seeded: 22K/15K/121/15; public renders DB data; no schema/RLS changes) |
| **Phase A13 — Site Settings Admin UI Expansion** | ✅ Complete (All 23 fields exposed in tabbed UI; General, Branding, SEO, Social Links, Footer, CTA, Newsletter tabs; no schema changes) |
| **Phase A13 — Public Primary Color Fix** | ✅ Complete (Button styling fixed: transparent+border default, fill on hover; hardcoded #fd6219 replaced in 2 SCSS files; _branding.scss extended for CMS-driven theming) |

### Phase F5 — Frontend Detail Pages Wiring

**Implemented:** 2025-12-18  
**Status:** ✅ Complete

**Overview:**
Wired 5 public frontend detail pages to fetch dynamic data from Supabase instead of hardcoded content.

**Pages Wired:**
| Page | File | Hook | Table |
|------|------|------|-------|
| ServiceDetailsPage | `apps/public/src/components/Pages/ServiceDetailsPage.jsx` | `useService(slug)` | `services` |
| PortfolioDetailsPage | `apps/public/src/components/Pages/PortfolioDetailsPage.jsx` | `useProject(slug)` | `projects` |
| BlogDetailsPage | `apps/public/src/components/Pages/BlogDetailsPage.jsx` | `useBlogPost(slug)` | `blog_posts` |
| TeamDetailsPage | `apps/public/src/components/Pages/TeamDetailsPage.jsx` | `useTeamMember(slug)` | `team_members` |
| AboutPage (team section) | `apps/public/src/components/Pages/AboutPage.jsx` | `useTeamMembers()` | `team_members` |

**Features:**
- Loading states for all detail pages
- Not-found states when content doesn't exist
- Dynamic page titles based on content
- Gallery rendering for projects
- Date formatting for blog posts
- Social links for team members
- Team slider populated from CMS data

**No Schema Changes:** All wiring uses existing hooks and tables.

### Phase F6 — Public Contact Form Wiring

**Implemented:** 2025-12-18  
**Status:** ✅ Complete

**Overview:**
Wired the public contact page form to INSERT into `contact_submissions` table.

**File Modified:**
- `apps/public/src/components/Pages/ContactPage.jsx`

**Features:**
- Form state management with React useState
- Client-side validation (required fields, email format)
- Loading state to prevent double submit
- Success notification with form reset
- Error notification with input preservation
- Inline success/error message display (no external toast library)

**Database Operation:**
```javascript
supabase.from('contact_submissions').insert({
  name: formData.name.trim(),
  email: formData.email.trim(),
  subject: formData.subject.trim() || null,
  message: formData.message.trim()
  // status defaults to 'new' in database
})
```

**RLS Policy:** "Public can submit contact form" — allows anonymous INSERT with `with_check: true`

**No Schema Changes:** Uses existing `contact_submissions` table and RLS policies.

### Phase F7 — Public Newsletter Form Wiring

**Implemented:** 2025-12-18  
**Status:** ✅ Complete

**Overview:**
Wired the public footer newsletter subscribe form to INSERT into `newsletter_subscribers` table.

**File Modified:**
- `apps/public/src/components/Footer/index.jsx`

**Features:**
- Form state management with React useState (email, isSubmitting, submitStatus, statusMessage)
- Client-side email validation (basic regex)
- Loading state with button/input disabled during submission
- Success notification with form reset
- Duplicate email handling via Postgres unique violation (error code 23505)
- Inline success/error/exists message display (no external toast library)

**Database Operation:**
```javascript
supabase.from('newsletter_subscribers').insert({
  email: trimmedEmail,
  source: 'public'
  // is_active defaults to true in database
  // subscribed_at defaults to now() in database
})
```

**Error Handling:**
- `error.code === '23505'` → "This email is already subscribed!" (amber warning)
- Success → "Thank you for subscribing!" (green success)
- Other errors → "Unable to subscribe. Please try again later." (red error)

**RLS Policy:** "Public can subscribe to newsletter" — allows anonymous INSERT

**No Schema Changes:** Uses existing `newsletter_subscribers` table, unique constraint on email, and RLS policies.

### Phase A11 — Newsletter Subscribers (CRUD + Unsubscribe)

**Implemented:** 2025-12-16  
**Status:** ✅ Complete – Hotfix validated (build-blocker resolved)

**Features:**
- CRUD for newsletter subscribers (email + source)
- Unsubscribe/Resubscribe toggle (is_active boolean + unsubscribed_at timestamp)
- Filters: Status (All/Subscribed/Unsubscribed), Source (admin/public/import)
- Search by email

**Scope Freeze (Explicit):**
- ❌ CSV import — explicitly postponed (disabled button placeholder only)
- ❌ Email campaigns — NOT in scope
- ❌ Name column — NOT added (email-only in this phase)
- ❌ A12 features — NOT started

**RBAC:**
| Role   | View | Create | Edit | Toggle Subscribe | Delete |
|--------|------|--------|------|------------------|--------|
| Admin  | ✅   | ✅     | ✅   | ✅               | ❌ (not exposed) |
| Editor | ✅   | ✅     | ✅   | ✅               | ❌ (not exposed) |
| Viewer | ❌   | ❌     | ❌   | ❌               | ❌ |

**Files:**
- `apps/admin/src/app/(admin)/marketing/newsletter/page.tsx`
- `apps/admin/src/app/(admin)/marketing/newsletter/components/SubscriberFormModal.tsx`

**Hotfix Applied:** Replaced incorrect `showNotification` import from non-existent `@/helpers/Notification` with canonical `useNotificationContext` from `@/context/useNotificationContext`.

### Phase A10 — Contact Submissions (Read-Only + Deactivate Only)

This module is **READ-ONLY** with status-based moderation:

**Features:**
- List view with filters (All/New/Read/Archived) and search
- View modal showing full submission details
- Auto "Mark as Read" when opening a 'new' submission
- Archive/Restore functionality (status-based, no hard delete)

**Status Flow:**
- `new` → User submitted, not yet viewed
- `read` → Admin/Editor has viewed the submission
- `archived` → Admin has archived (soft deactivation)

**RBAC:**
| Role   | View List | View Modal | Archive/Restore |
|--------|-----------|------------|-----------------|
| Admin  | ✅        | ✅         | ✅              |
| Editor | ✅        | ✅         | ❌              |
| Viewer | ❌ (blocked) | ❌      | ❌              |

**No Edit, No Delete** — This is a read-only audit module.

### Frontend Documents (Created)

| Document | Status |
|----------|--------|
| Frontend Cleanup Plan | ✅ `/docs/frontend/frontend-cleanup-route-reduction-plan.md` |
| Frontend Variant Audit | ✅ `/docs/frontend/frontend-variant-audit.md` |
| Phased Plan (Reference) | ✅ `/docs/frontend/frontend-cleanup-phased-plan-reference.md` |

### Supabase Schema Documents

| Document | Status |
|----------|--------|
| Content Contract v2.0 | ✅ `/docs/contracts/Admin_Frontend_Content_Contract.md` |
| Content Data Model | ✅ `/docs/supabase/Content_Data_Model.md` (Docs Only — Not Executed) |

See [`/docs/planned/README.md`](./planned/README.md) for remaining planned docs.

---

## Current State

- **Backend:** Supabase (connected)
- **Database:** PostgreSQL via Supabase (12 CMS tables + RBAC tables)
- **Authentication:** Supabase Auth (email/password)
- **Storage:** Configured (media + documents buckets)
- **RBAC:** user_profiles + user_roles tables
- **Frontend CMS Wiring:** Complete (READ-ONLY SELECT queries)

## Supabase Configuration

### Environment Variables
The following environment variables are required (set in root `.env`):

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID (optional) |

### Env Loading (Monorepo)
Since the root `vite.config.ts` sets `root: "apps/admin"`, Vite would normally look for `.env` in `apps/admin/`. To load from repo root instead:
- Root `vite.config.ts` includes `envDir: path.resolve(__dirname)` to point Vite back to repo root.
- All env vars are defined in root `.env` file.
- Admin app reads `import.meta.env.VITE_SUPABASE_*` variables.

### Supabase Client
- **Root client:** `src/integrations/supabase/client.ts` (auto-generated by Lovable)
- **Admin client:** `apps/admin/src/lib/supabase.ts` (primary for admin app)
- The admin client includes defensive guards that throw clear errors if env vars are missing.

## Database Schema

### Tables

#### `user_profiles`
Stores additional user information beyond Supabase auth.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | References auth.users(id) |
| `email` | TEXT | User email |
| `full_name` | TEXT | Display name (nullable) |
| `avatar_url` | TEXT | Profile picture URL (nullable) |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

#### `user_roles`
Stores user role assignments for RBAC.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Primary key |
| `user_id` | UUID | References auth.users(id) |
| `role` | app_role | Role enum value |
| `created_at` | TIMESTAMPTZ | Assignment timestamp |

#### `app_role` (Enum)
- `admin` - Full system access, can manage roles
- `editor` - Can edit content, CRM, marketing
- `viewer` - Read-only access to dashboard

### Database Functions

| Function | Description |
|----------|-------------|
| `has_role(user_id, role)` | Security definer function to check if user has a role |
| `get_user_roles(user_id)` | Returns all roles for a user |
| `handle_new_user()` | Trigger function to create profile on signup |
| `update_updated_at_column()` | Trigger function for updated_at timestamps |
| `assign_role(target_user_id, role)` | Admin-only RPC to assign a role to a user |
| `revoke_role(target_user_id, role)` | Admin-only RPC to revoke a role from a user |
| `list_users_with_roles()` | Admin-only RPC to list all users with their roles |

### Triggers

| Trigger | Table | Description |
|---------|-------|-------------|
| `on_auth_user_created` | auth.users | Creates user_profile on signup |
| `update_user_profiles_updated_at` | user_profiles | Updates updated_at on change |

### Row Level Security (RLS)

#### user_profiles
- Users can SELECT their own profile
- Users can UPDATE their own profile
- Users can INSERT their own profile
- **Admins can SELECT all profiles** (for user management)

#### user_roles
- Users can SELECT their own roles
- Only admins can INSERT roles
- Only admins can UPDATE roles
- Only admins can DELETE roles

## Route-Based Access Control (RBAC)

### Route Role Requirements

| Route Prefix | Required Roles | Description |
|--------------|----------------|-------------|
| `/system/*` | `admin` | Admin-only system management |
| `/content/*` | `admin`, `editor` | Content management |
| `/crm/*` | `admin`, `editor` | CRM management |
| `/marketing/*` | `admin`, `editor` | Marketing management |
| `/dashboards` | Any authenticated | Dashboard access |

### Access Control Flow

1. **Authentication Check**: User must be authenticated
2. **Role Check**: If route requires roles, user must have at least one
3. **Deny-by-Default**: Missing roles = redirect to 404 (not login)

### Sidebar Visibility

The sidebar dynamically filters menu items based on user roles:
- **Admin**: Sees all menu items
- **Editor**: Sees Dashboard, Content, CRM, Marketing (no System)
- **Viewer**: Sees Dashboard only
- **DEV-only**: Demo Library visible only in development mode

## Authentication Flow

### Sign In
1. User submits email/password
2. Supabase validates credentials
3. Session stored in localStorage
4. Auth state listener updates context
5. User redirected to dashboard

### Sign Up
1. User submits name, email, password
2. Supabase creates auth.users record
3. Trigger creates user_profiles record
4. Confirmation email sent (if enabled)
5. User redirected to sign-in

### Sign Out
1. User clicks logout
2. Supabase clears session
3. Auth state listener clears context
4. User redirected to sign-in

### Session Persistence
- Sessions persist across page refreshes via localStorage
- Auto token refresh enabled
- Auth state listener handles session changes

## Route Protection

### Protected Routes (require auth)
- `/dashboards` and all CMS module routes
- Unauthenticated → redirect to `/auth/sign-in?redirectTo={path}`

### Public Routes (no auth required)
- `/auth/sign-in`
- `/auth/sign-up`
- `/auth/reset-password`
- `/auth/lock-screen`
- 404 catch-all

### Auth Page Redirect
- Authenticated users on `/auth/sign-in` or `/auth/sign-up` → redirect to `/dashboards`

## Admin Role Seeding

To grant admin access to a user:

1. User signs up (creates profile automatically)
2. Run SQL in Supabase SQL Editor:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('<user-uuid-from-auth-users>', 'admin');
```

Note: Get the user UUID from Supabase Dashboard > Authentication > Users

---

## Phase History

### Phase 1: Demo Library (Complete)
- Created Demo Library registry and documentation
- Preserved Darkone UI patterns for reference
- Set up DEV-only showcase routes

### Phase 2A: Sidebar + Placeholder Routes (Complete)
- 12 CMS placeholder pages created
- Production/DEV menu separation

### Phase 2B: Dashboard Placeholder (Complete)
- CMS-ready dashboard layout
- KPI placeholders, welcome card

### Phase 3A: Supabase Auth + RBAC (Complete)
- Supabase Auth integration (email/password)
- user_profiles table with auto-creation trigger
- user_roles table with RLS policies
- Protected route guards
- Role badge display in profile dropdown

### Phase 3B: RBAC Hardening (Complete)
- Route-level RBAC guards with deny-by-default
- Sidebar role-based filtering
- Admin-only RPCs: `assign_role`, `revoke_role`, `list_users_with_roles`
- Admin policy for viewing all user profiles
- Roles management placeholder page with user list

---

## CMS Tables (EXECUTED ✅)

Schema executed on 2025-12-15. All 12 tables created with RLS enabled.

| Table | Purpose | Status |
|-------|---------|--------|
| `site_settings` | Global branding, SEO, social links | ✅ Created |
| `pages` | Static/CMS pages | ✅ Created |
| `hero_sections` | Homepage heroes | ✅ Created |
| `services` | Service offerings | ✅ Created |
| `projects` | Portfolio/projects | ✅ Created |
| `blog_posts` | Blog articles | ✅ Created |
| `testimonials` | Client testimonials | ✅ Created |
| `team_members` | Team profiles | ✅ Created |
| `awards` | Awards/recognition | ✅ Created |
| `faqs` | FAQ entries | ✅ Created |
| `contact_submissions` | Contact form data | ✅ Created |
| `newsletter_subscribers` | Newsletter signups | ✅ Created |

**Storage Buckets (CREATED ✅):**
- `media` (public) — Images
- `documents` (private) — PDFs, docs

**Seed Data:**
- 1 site_settings row
- 1 hero_sections row
- 1 published page (about-snippet)

---

## Schema Execution Summary

**Executed:** 2025-12-15

| Migration | Purpose | Status |
|-----------|---------|--------|
| Content Schema | 12 tables, indexes, triggers | ✅ Executed |
| Content RLS | RLS enable + 60 policies | ✅ Executed |
| Storage Policies | 2 buckets + 10 policies | ✅ Executed |
| Seed Data | Minimal content | ✅ Executed |

**Security Status:**
- All 12 tables have RLS enabled
- All policies use existing `has_role()` function
- No anon SELECT on contact_submissions or newsletter_subscribers
- Documents bucket is private (auth required)

---

## Phase F3: Branding & Theme Sync (Complete)

**Implemented:** 2025-12-15

### Branding Storage
- `site_settings.primary_color` — stores frontend primary color (hex)
- Default value: `#7e67fe`
- Admin can update via `/system/settings` UI

### Admin Writes
- Admin Branding Settings UI at `/system/settings`
- Uses Supabase UPDATE query on `site_settings`
- RBAC: Admin can edit, Editor can view, Viewer denied

### Public Reads & Applies
- `SiteSettingsContext` provides `primary_color` to frontend
- `BrandingProvider` component applies `--cs-primary-color` CSS variable at runtime
- `_branding.scss` overrides use the CSS variable for buttons, links, accents
- Fallback to `#fd6219` (original SCSS `$accent`) if no value set

### Important
- Admin theme unchanged — Darkone styling preserved
- Only frontend primary color is configurable via CMS

---

## Phase A1: Admin CRUD — Services Module (Complete)

**Implemented:** 2025-12-15

### Overview
First Admin CRUD module implementing full create/read/update/delete operations for the Services content type.

### Route
- **URL:** `/content/services`
- **Component:** `apps/admin/src/app/(admin)/content/services/page.tsx`
- **RBAC:** Admin + Editor (Viewer denied)

### Features
| Feature | Description |
|---------|-------------|
| List View | Table with Title, Status, Featured, Sort Order, Updated At, Actions |
| Create | Modal form with Zod validation |
| Edit | Same modal, pre-populated with existing data |
| Publish/Unpublish | Toggle status + set `published_at` when publishing |
| Delete | Admin-only with confirmation modal |
| Image Upload | Supabase Storage (`media` bucket) |
| Slug Check | UI pre-check for uniqueness + DB constraint fallback |

### RBAC Matrix
| Role | View | Create | Edit | Publish | Delete |
|------|------|--------|------|---------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editor | ✅ | ✅ | ✅ | ✅ | ❌ |
| Viewer | ❌ | — | — | — | — |

### Files
| File | Purpose |
|------|---------|
| `page.tsx` | List page with table and actions |
| `components/ServiceForm.tsx` | Create/Edit modal with Zod validation |
| `components/ServiceDeleteModal.tsx` | Admin-only delete confirmation |
| `components/ServiceImageUpload.tsx` | Supabase Storage upload component |

### Database Operations
| Operation | Query | User Tracking |
|-----------|-------|---------------|
| Create | `supabase.from('services').insert(data)` | `created_by: user.id` |
| Update | `supabase.from('services').update(data).eq('id', id)` | `updated_by: user.id` |
| Delete | `supabase.from('services').delete().eq('id', id)` | Admin only |
| Publish | Update `status: 'published'` + `published_at: now()` | `updated_by: user.id` |

### Image Upload Flow
1. User selects or drops image file
2. Validate type (JPG, PNG, WebP, GIF) and size (max 5MB)
3. Upload to `media` bucket: `services/{timestamp}-{filename}`
4. Get public URL and store in `image_url` field
5. "Remove" clears DB field only (storage cleanup deferred)

---

## Phase A2: Admin CRUD — Projects Module (Complete)

**Implemented:** 2025-12-15

### Overview
Second Admin CRUD module implementing full CRUD for Projects content type with image galleries and technologies tags.

### Route
- **URL:** `/content/projects`
- **RBAC:** Admin + Editor (Viewer denied)

### Features
| Feature | Description |
|---------|-------------|
| List View | Table with Title, Category, Status, Featured, Sort Order, Actions |
| Create/Edit | Tabbed modal (Basic Info, Media, Details) |
| Image Upload | Thumbnail, Featured Image, Gallery (multi-image) |
| Technologies | Tag/chip input for technologies array |
| Publish/Unpublish | Toggle status + published_at |
| Delete | Admin-only with confirmation |

---

## Phase A2.1: UI Cleanup — Modal Parity (Complete)

**Implemented:** 2025-12-16

### Overview
Visual alignment of Services and Projects CRUD modules to match Darkone Demo Library patterns.

### Changes Applied
- ServiceForm modal size: `lg` → `xl`
- ServiceForm tabs: Flat form → 3-tab layout (Basic Info, Media, Details)
- Navigation fix: Suspense fallback in AdminLayout

### Verification
- ✅ Both modules visually aligned
- ✅ Darkone 1:1 parity achieved
- ✅ Build passes
- ✅ No blank pages on navigation

---

## Phase A3: Admin CRUD — Blog Posts Module (Complete)

**Implemented:** 2025-12-16

### Overview
Third Admin CRUD module implementing full CRUD for Blog Posts content type with featured images and tags.

### Route
- **URL:** `/content/blog`
- **RBAC:** Admin + Editor (Viewer denied)

### Features
| Feature | Description |
|---------|-------------|
| List View | Table with Title, Category, Status, Featured, Updated, Actions |
| Create/Edit | Tabbed modal (Basic Info, Media, Details) |
| Image Upload | Featured image upload to `media/blog/` |
| Tags | Tag/chip input for tags array |
| Excerpt | Short summary for previews |
| Content | Full Markdown content |
| Publish/Unpublish | Toggle status + published_at |
| Delete | Admin-only with confirmation |

### Form Structure (Modal: xl, Tabs)
**Basic Info Tab:**
- Title (required)
- Slug (auto-generated, unique check)
- Excerpt
- Content (Markdown textarea)
- Status, Featured, Category, Tags

**Media Tab:**
- Featured Image upload

**Details Tab:**
- SEO: Meta Title, Meta Description

### CRUD Operations
| Operation | Table | Notes |
|-----------|-------|-------|
| Create | `blog_posts` | `created_by: user.id`, `author_id: null` |
| Read | `blog_posts` | All posts (drafts + published) |
| Update | `blog_posts` | `updated_by: user.id` |
| Delete | `blog_posts` | Admin-only |
| Publish | Update `status: 'published'` + `published_at: now()` | |

### Image Upload Flow
1. User selects or drops image file
2. Validate type (JPG, PNG, WebP, GIF) and size (max 5MB)
3. Upload to `media` bucket: `blog/{timestamp}-{filename}`
4. Get public URL and store in `featured_image_url` field
5. "Remove" clears DB field only (storage cleanup deferred)

---

## Phase A4: Admin CRUD — Pages Module (Complete)

**Implemented:** 2025-12-16

### Overview
Fourth Admin CRUD module implementing full CRUD for static Pages content type (About, Terms, Privacy, etc.).

### Route
- **URL:** `/content/pages`
- **RBAC:** Admin + Editor (Viewer denied)

### Features
| Feature | Description |
|---------|-------------|
| List View | Table with Title, Slug, Status, Sort Order, Updated, Actions |
| Create/Edit | Tabbed modal (Basic Info, Media, Details) |
| Image Upload | Featured image upload to `media/pages/` |
| Content | Full Markdown content |
| Sort Order | Integer ordering for navigation |
| Publish/Unpublish | Toggle status + published_at |
| Delete | Admin-only with confirmation |

### Form Structure (Modal: xl, Tabs)
**Basic Info Tab:**
- Title (required)
- Slug (auto-generated, unique check)
- Content (Markdown textarea)
- Status, Sort Order

**Media Tab:**
- Featured Image upload (optional)

**Details Tab:**
- SEO: Meta Title, Meta Description

### CRUD Operations
| Operation | Table | Notes |
|-----------|-------|-------|
| Create | `pages` | `created_by: user.id` |
| Read | `pages` | All pages (drafts + published) |
| Update | `pages` | `updated_by: user.id` |
| Delete | `pages` | Admin-only |
| Publish | Update `status: 'published'` + `published_at: now()` | |

### Image Upload Flow
1. User selects or drops image file
2. Validate type (JPG, PNG, WebP, GIF) and size (max 5MB)
3. Upload to `media` bucket: `pages/{timestamp}-{filename}`
4. Get public URL and store in `featured_image_url` field
5. "Remove" clears DB field only (storage cleanup deferred)

### RBAC Matrix
| Role | View | Create | Edit | Publish | Delete |
|------|------|--------|------|---------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editor | ✅ | ✅ | ✅ | ✅ | ❌ |
| Viewer | ❌ | — | — | — | — |

---

## Phase A7: Admin CRUD — Awards Module (Complete)

**Implemented:** 2025-12-16

### Overview
Seventh Admin CRUD module implementing full CRUD for Awards content type with boolean toggles (is_active, is_featured).

### Pre-Flight Schema Verification
Verified Awards table before implementation:
- `is_featured` defaults to **TRUE** (unusual)
- `is_active` defaults to TRUE
- `sort_order` defaults to 0
- `year` nullable integer (1900-2100)
- `link_url` nullable (validated URL when present)

**Important:** Form default for `is_featured` is FALSE to prevent all new awards appearing as featured.

### Route
- **URL:** `/content/awards`
- **RBAC:** Admin + Editor (Viewer denied)

### Features
| Feature | Description |
|---------|-------------|
| List View | Table with Award (title + image), Issuer, Year, Status, Featured, Order, Actions |
| Create/Edit | Tabbed modal (Basic Info, Media, Details) |
| Image Upload | Award badge/image upload to `media/awards/` |
| Link URL | Optional external link with URL validation |
| Toggle Active | is_active boolean (NOT status/published_at) |
| Toggle Featured | is_featured boolean |
| Delete | Admin-only with confirmation |

### Form Structure (Modal: xl, Tabs)
**Basic Info Tab:**
- Title (required)
- Issuer (optional)
- Year (optional, 1900-2100)
- Description (optional)

**Media Tab:**
- Award Image upload

**Details Tab:**
- Link URL (optional, validated)
- Sort Order
- is_active toggle
- is_featured toggle

### Data Integrity (z.preprocess)
| Field | Empty Input | Result |
|-------|-------------|--------|
| `year` | `""` | `null` (NOT NaN) |
| `sort_order` | `""` | `0` |
| `link_url` | `""` | `null` (validated URL only when present) |
| `issuer` | `""` | `null` |
| `description` | `""` | `null` |

### RBAC Matrix
| Role | View | Create | Edit | Toggle | Delete |
|------|------|--------|------|--------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editor | ✅ | ✅ | ✅ | ✅ | ❌ |
| Viewer | ❌ | — | — | — | — |

---

## Phase A8: Admin CRUD — FAQs Module (Complete)

**Implemented:** 2025-12-16

### Overview
Eighth Admin CRUD module implementing full CRUD for FAQs content type. Notable difference: NO Media tab (no image_url in schema), 2-tab modal only.

### Route
- **URL:** `/content/faqs`
- **RBAC:** Admin + Editor (Viewer denied)

### Features
| Feature | Description |
|---------|-------------|
| List View | Table with Question, Category, Status, Featured, Order, Updated, Actions |
| Create/Edit | Tabbed modal (Basic Info, Details) — NO Media tab |
| Toggle Active | is_active boolean (NOT status/published_at) |
| Toggle Featured | is_featured boolean |
| Delete | Admin-only with confirmation |

### Form Structure (Modal: xl, 2 Tabs)
**Basic Info Tab:**
- Question (required)
- Answer (required)
- Category (optional, max 100 chars)

**Details Tab:**
- Sort Order
- is_active toggle
- is_featured toggle

### Data Integrity (z.preprocess)
| Field | Empty Input | Result |
|-------|-------------|--------|
| `category` | `""` | `null` |
| `sort_order` | `""` or NaN | `0` |

### RBAC Matrix
| Role | View | Create | Edit | Toggle | Delete |
|------|------|--------|------|--------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editor | ✅ | ✅ | ✅ | ✅ | ❌ |
| Viewer | ❌ | — | — | — | — |

---

## Phase A11: Marketing — Newsletter Subscribers Module (Complete)

**Implemented:** 2025-12-16

### Overview
Newsletter Subscribers management module with full CRUD (Create, Read, Update) and Unsubscribe/Resubscribe functionality. No hard delete exposed in UI.

### Route
- **URL:** `/marketing/newsletter`
- **RBAC:** Admin + Editor (Viewer denied)

### Features
| Feature | Description |
|---------|-------------|
| List View | Table with Email, Status, Source, Subscribed At, Actions |
| Filters | Status (All/Subscribed/Unsubscribed), Source (All/admin/public/footer/import), Search by email |
| Create | Modal form with email input, source auto-set to "admin" |
| Edit | Update email only (source locked) |
| Unsubscribe | Sets `is_active=false` + `unsubscribed_at=now()` |
| Resubscribe | Sets `is_active=true` + `unsubscribed_at=null` |
| CSV Import | Button disabled with "Coming soon" label |

### Status Model
Uses `is_active` boolean (NOT status text):
- `is_active=true` → "Subscribed" (green badge)
- `is_active=false` → "Unsubscribed" (secondary badge)

### RLS Policies Updated
| Policy | Roles | Operation |
|--------|-------|-----------|
| Admin and Editor can read newsletter subscribers | admin, editor | SELECT |
| Admin and Editor can insert newsletter subscribers | admin, editor | INSERT |
| Admin and Editor can update newsletter subscribers | admin, editor | UPDATE |
| Admin can delete newsletter subscribers | admin | DELETE (not exposed in UI) |

### RBAC Matrix
| Role | View | Create | Edit | Unsubscribe/Resubscribe | Delete |
|------|------|--------|------|-------------------------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ | ❌ (hidden) |
| Editor | ✅ | ✅ | ✅ | ✅ | ❌ (hidden) |
| Viewer | ❌ | — | — | — | — |

### Files
| File | Purpose |
|------|---------|
| `apps/admin/src/app/(admin)/marketing/newsletter/page.tsx` | List page with filters and actions |
| `apps/admin/src/app/(admin)/marketing/newsletter/components/SubscriberFormModal.tsx` | Create/Edit modal |

### Duplicate Email Handling
- Unique constraint on `email` column enforced at DB level
- UI shows user-friendly toast: "This email is already subscribed"
- Error code `23505` caught and handled gracefully

---

*Last updated: 2025-12-16 — Phase A11 Newsletter Subscribers CRUD Complete*
