# Devmart Internal Platform — Project Tasks & Roadmap

**Created:** 2025-12-15  
**Status:** Living Document  
**Purpose:** Track all project phases, tasks, and completion status

---

## Quick Status

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| Phase 1 | Demo Library | ✅ Complete | 100% |
| Phase 2A | Sidebar + Placeholders | ✅ Complete | 100% |
| Phase 2B | Dashboard Placeholder | ✅ Complete | 100% |
| Phase 3A | Supabase Auth | ✅ Complete | 100% |
| Phase 3B | RBAC Hardening | ✅ Complete | 100% |
| Phase 4 | Documentation & Schema | ✅ Complete | 100% |
| Phase F1 | Frontend Cleanup | ✅ Complete | 100% |
| Phase F2 | Frontend ↔ CMS Wiring | ✅ Complete | 100% |
| Phase F2.1 | CMS Wiring Hotfix | ✅ Complete | 100% |
| Phase F3 | Branding & Theme Sync | ✅ Complete | 100% |
| Phase F4 | Content Seeding | ✅ Complete | 100% |

---

## Completed Tasks ✅

### Phase 1: Demo Library
- [x] Create Demo Library registry manifest
- [x] Create Darkone Admin Theme documentation
- [x] Set up DEV-only showcase routes
- [x] Create registry validation script
- [x] Ensure Demo Library is tree-shaken in production

### Phase 2A: Sidebar + Placeholder Routes
- [x] Create 12 CMS placeholder pages
- [x] Implement production/DEV menu separation
- [x] Configure sidebar navigation structure
- [x] Hide Demo Library from production builds

### Phase 2B: Dashboard Placeholder
- [x] Create CMS-ready dashboard layout
- [x] Add KPI placeholder cards
- [x] Add welcome card component
- [x] Add analytics placeholder section

### Phase 3A: Supabase Auth + RBAC Foundation
- [x] Connect Supabase project (pqpgurfagrpwzqzrbmeo)
- [x] Create user_profiles table with auto-creation trigger
- [x] Create user_roles table with app_role enum
- [x] Implement has_role() security definer function
- [x] Create sign-in page with Supabase Auth
- [x] Create sign-up page with email/password
- [x] Implement AuthContext with session persistence
- [x] Create protected route guards
- [x] Implement role badge display in profile dropdown

### Phase 3B: RBAC Hardening
- [x] Implement route-level RBAC guards
- [x] Add deny-by-default access control
- [x] Implement sidebar role-based filtering
- [x] Create admin-only RPCs (assign_role, revoke_role, list_users_with_roles)
- [x] Add admin policy for viewing all user profiles
- [x] Create roles management placeholder page

### Phase 4: Documentation & Schema (COMPLETE ✅)
- [x] Create Content Contract v2.0 FINAL
- [x] Resolve all 7 open questions (Awards, FAQ, Newsletter, Contact, Media, Rich Text, Images)
- [x] Create Content Data Model documentation
- [x] Create Verification Gate restore point
- [x] Create SQL schema artifact (12 tables)
- [x] Create SQL RLS artifact (all policies)
- [x] Create SQL storage artifact (buckets + policies)
- [x] Create minimal seed data artifact
- [x] Cross-check Contract vs Data Model alignment
- [x] **Execute schema migration** (2025-12-15)
- [x] Verify tables created successfully (12/12)
- [x] Verify RLS policies applied correctly (60 policies)
- [x] Verify storage buckets created (media + documents)

---

## In Progress Tasks 🔄

### Phase 4: Schema Execution (Pending Approval)
- [ ] Run `20251215000001_content_schema.sql`
- [ ] Run `20251215000002_content_rls.sql`
- [ ] Run `20251215000003_storage_policies.sql`
- [ ] Run `seed_content_minimal.sql`
- [ ] Verify Supabase types regenerated

---

## Upcoming Phases

---

## Phase F1: Frontend Cleanup (COMPLETE ✅)

**Status:** ✅ Complete  
**Completed:** 2025-12-15

### Goal
Remove all non-Creative Agency variants from Zivan Public app. Simplify to a single, clean homepage template that consumes CMS data.

### What Was Removed
- **Page Variants:** MarketingAgencyPage, StudioAgencyPage, DigitalAgencyPage, TechStartupPage, CaseStudyDetailsPage
- **Shop Pages:** Cart, Checkout, ProductDetails, Success, Wishlist, Shop index
- **Hero Variants:** HeroStyle2, HeroStyle3, HeroStyle4, HeroStyle5
- **Layout:** Layout3 (Shop only)
- **Components:** ShopComponents (6 files), PricingTable (2 files), CaseStudy, AboutStyle2/4/5, IconBoxStyle2, PostGridStyle2
- **Sliders:** ServiceSlider, PortfolioSlider, TestimonialSliderStyle2

### What Remains
- **Homepage:** Home.jsx (Creative Agency)
- **Pages:** About, Service, ServiceDetails, Blog, BlogList, BlogDetails, Portfolio, PortfolioDetails, Team, TeamDetails, Contact, Error
- **Layouts:** Layout (inner pages), Layout2 (homepage)
- **Core Components:** Hero, FunFact, About, WhyChose, Service, Portfolio, Award, Accordion, Cta, TestimonialSlider, PostCarousel, etc.

### Routes After Cleanup
| Route | Component | Status |
|-------|-----------|--------|
| `/` | Home | ✅ Creative Agency |
| `/about` | AboutPage | ✅ Kept |
| `/service` | ServicePage | ✅ Kept |
| `/service/:id` | ServiceDetailsPage | ✅ Kept |
| `/blog` | BlogPage | ✅ Kept |
| `/blog-list` | BlogListPage | ✅ Kept |
| `/blog/:id` | BlogDetailsPage | ✅ Kept |
| `/portfolio` | PortfolioPage | ✅ Kept |
| `/portfolio/:id` | PortfolioDetailsPage | ✅ Kept |
| `/team` | TeamPage | ✅ Kept |
| `/team/:id` | TeamDetailsPage | ✅ Kept |
| `/contact` | ContactPage | ✅ Kept |
| `/light/*` | Light mode variants | ✅ Kept |
| `*` | ErrorPage | ✅ Kept |

### Admin/CMS Untouched
- ✅ Admin app NOT modified
- ✅ Supabase schema NOT modified
- ✅ No CMS wiring introduced

### Build Status
- ✅ Build passes
- ✅ No dead imports

---

## Phase F2: Frontend ↔ CMS Wiring
**Status**: ✅ Complete (2025-12-15)

### Completed Tasks
- [x] Create Supabase client for public app (`apps/public/src/lib/supabase.js`)
- [x] Implement data fetching hooks (`apps/public/src/hooks/useContent.js`)
- [x] Wire homepage sections to CMS tables (hero, services, projects, testimonials, awards, blog)
- [x] Wire individual pages (ServicePage, PortfolioPage, TeamPage, BlogPage)
- [x] Implement loading states with static fallbacks
- [x] All queries are SELECT-only (READ-ONLY)

### Tables Wired
| Table | Hook | Used By |
|-------|------|---------|
| `hero_sections` | `useHeroSections()` | Home |
| `services` | `useServices()` | Home, ServicePage, Footer |
| `projects` | `useProjects()` | Home, PortfolioPage |
| `testimonials` | `useTestimonials()` | Home |
| `awards` | `useAwards()` | Home |
| `blog_posts` | `useBlogPosts()` | Home, BlogPage |
| `team_members` | `useTeamMembers()` | TeamPage |
| `faqs` | `useFaqs()` | FaqPage |

---

## Phase F2.1: CMS Wiring Hotfix Gate
**Status**: ✅ Complete (2025-12-15)

### Completed Tasks
- [x] Wire `site_settings` to Header/Footer via SiteSettingsContext
- [x] Create standalone `/faq` route with FaqPage component
- [x] Remove FAQ section from Home (per Content Contract)
- [x] Clean Header navigation (removed deprecated variants)
- [x] Wire Footer to use services from CMS
- [x] Add newsletter submission TODO placeholder (Phase F4)
- [x] Add contact form submission TODO placeholder (Phase F4)
- [x] Update documentation

### Additional Tables Wired
| Table | Hook | Used By |
|-------|------|---------|
| `site_settings` | `useSiteSettings()` | SiteSettingsContext → Header, Footer |
| `faqs` | `useFaqs()` | FaqPage (standalone) |

### Contract Compliance
- ✅ `/faq` is standalone route (not embedded in Home)
- ✅ Newsletter form present with TODO for Phase F4 INSERT
- ✅ Contact form present with TODO for Phase F4 INSERT
- ✅ All queries remain SELECT-only

---

## Phase F3: Branding & Theme Sync
**Status**: ✅ Complete (2025-12-15)

### Completed Tasks
- [x] Create restore point (`docs/restorepoints/2025-12-15_PhaseF3_BrandingSync_BeforeChange.md`)
- [x] Verify `primary_color` column exists in `site_settings` (no schema change needed)
- [x] Create Admin Branding Settings UI (`apps/admin/src/app/(admin)/system/settings/page.tsx`)
- [x] Implement RBAC: Admin can edit, Editor can view, Viewer denied
- [x] Create BrandingProvider component (`apps/public/src/components/BrandingProvider.jsx`)
- [x] Create SCSS branding overrides (`apps/public/src/sass/_branding.scss`)
- [x] Apply primary color via CSS custom properties at runtime
- [x] Implement fallback to default color if CMS value missing
- [x] Preserve dark/light mode toggle behavior

### Implementation Details

**Admin Branding Settings UI:**
- Located at `/system/settings` (existing page, now functional)
- Color picker + hex text input + preview swatch
- RBAC enforced via `isAdmin`, `isEditor`, `isViewer` from AuthContext
- Uses existing Darkone form patterns (no new styling)

**Frontend Branding Application:**
- `BrandingProvider` reads `primary_color` from `SiteSettingsContext`
- Applies `--cs-primary-color` CSS variable to `:root` at runtime
- SCSS overrides in `_branding.scss` use the CSS variable for buttons, links, accents
- Fallback to `#fd6219` (original SCSS `$accent`) if no value set

**Files Changed:**
| File | Action |
|------|--------|
| `apps/admin/src/app/(admin)/system/settings/page.tsx` | Updated (branding form) |
| `apps/public/src/components/BrandingProvider.jsx` | Created |
| `apps/public/src/sass/_branding.scss` | Created |
| `apps/public/src/sass/index.scss` | Updated (import branding) |
| `apps/public/src/App.jsx` | Updated (wrap with BrandingProvider) |

### Verification
- ✅ Admin theme unchanged (no SCSS token edits in admin)
- ✅ New setting persisted in `site_settings.primary_color` via UPDATE query
- ✅ Frontend reflects primary color on refresh
- ✅ Fallback works when no color set
- ✅ Dark/light mode toggle preserved
- ✅ RBAC enforced (Admin can save, Editor view-only, Viewer denied)

---

## Phase F4: Content Seeding & Verification
**Status**: ✅ Complete (2025-12-15)

### Completed Tasks (F4.0 - F4.4)
- [x] Create restore point (`docs/restorepoints/2025-12-15_PhaseF4_SeedContent_BeforeChange.md`)
- [x] Create idempotent seed scripts
- [x] Seed `site_settings` (primary_color + core fields)
- [x] Seed `hero_sections` (1 active)
- [x] Seed `services` (6 published)
- [x] Seed `projects` (6 published)
- [x] Seed `testimonials` (6 active)
- [x] Seed `team_members` (6 active)
- [x] Seed `awards` (6 active)
- [x] Seed `faqs` (10 active)
- [x] Seed `pages` (3 published: about, privacy, terms)
- [x] Seed `blog_posts` (6 published with author_id FK)

### Seed Files Created
| File | Contents |
|------|----------|
| `supabase/seed/seed_content_core.sql` | team_members, services, pages |
| `supabase/seed/seed_content_homepage.sql` | site_settings, projects, testimonials, awards, faqs |
| `supabase/seed/seed_content_blog.sql` | blog_posts (6 posts with author links) |

### Final Row Counts
| Table | Count |
|-------|-------|
| `hero_sections` | 1 |
| `services` | 6 |
| `projects` | 6 |
| `testimonials` | 6 |
| `team_members` | 6 |
| `awards` | 6 |
| `faqs` | 10 |
| `blog_posts` | 6 |
| `pages` | 3 |

### Verification (F4.5 - F4.6)
- [x] Frontend homepage renders CMS data (hero, services, projects, testimonials, awards, blog)
- [x] `/faq` renders FAQs from database
- [x] `/blog` renders posts from database
- [x] Admin Branding Settings: Admin can update, Editor view-only, Viewer denied
- [x] Frontend reflects primary_color from site_settings

---

## Future Phases (Out of Current Scope)

### Phase A1: Admin CRUD Implementation
- Implement CRUD for all content types in Admin
- Build form interfaces for each table
- Image upload integration
- Preview functionality

### Phase A2: Admin Dashboard Wiring
- Wire real analytics data
- Display content counts
- Recent activity feed
- User activity metrics

### Phase A3: Advanced Features
- Content scheduling
- Bulk operations
- Import/export
- Audit logging

---

## Blocking Issues

| Issue | Description | Status | Blocked By |
|-------|-------------|--------|------------|
| Schema not executed | CMS tables not yet created | ⏳ Awaiting approval | User approval |

---

## Notes

### Risk Areas
1. **Image dimensions**: Frontend must handle various image sizes gracefully
2. **Empty states**: Sections with no data should hide, not break
3. **RLS policies**: Public frontend must be able to read published content anonymously

### Decisions Made
1. Rich text stored as Markdown, rendered client-side
2. Blog featured image: 1200×600 (2:1 aspect ratio)
3. Awards displayed after Testimonials on homepage
4. FAQ is standalone /faq page, not homepage section
5. Newsletter is footer inline form within CTA section

---

*Last updated: 2025-12-15*
