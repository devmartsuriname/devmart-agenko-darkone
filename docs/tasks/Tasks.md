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
| Phase 4 | Documentation & Schema | 🔄 In Progress | 90% |
| Phase F1 | Frontend Cleanup | ⏳ Pending | 0% |
| Phase F2 | Frontend ↔ CMS Wiring | ⏳ Pending | 0% |
| Phase F3 | Branding & Theme Sync | ⏳ Pending | 0% |
| Phase F4 | Content Seeding & QA | ⏳ Pending | 0% |

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

### Phase 4: Documentation & Schema (Current)
- [x] Create Content Contract v2.0 FINAL
- [x] Resolve all 7 open questions (Awards, FAQ, Newsletter, Contact, Media, Rich Text, Images)
- [x] Create Content Data Model documentation
- [x] Create Verification Gate restore point
- [x] Create SQL schema artifact (12 tables)
- [x] Create SQL RLS artifact (all policies)
- [x] Create SQL storage artifact (buckets + policies)
- [x] Create minimal seed data artifact
- [x] Cross-check Contract vs Data Model alignment
- [ ] **Execute schema migration** (awaiting approval)
- [ ] Verify tables created successfully
- [ ] Verify RLS policies applied correctly
- [ ] Verify storage buckets created

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

## Phase F1: Frontend Cleanup (Creative Agency Only)

**Status:** ⏳ Pending  
**Depends On:** Phase 4 complete (schema executed)

### Goal
Remove all non-Creative Agency variants from Zivan Public app. Simplify to a single, clean homepage template that consumes CMS data.

### Scope

**Included:**
- Remove all alternative homepage variants
- Remove unused component folders
- Consolidate routing to Creative Agency only
- Clean up unused SASS/SCSS files
- Remove hardcoded demo data from components
- Prepare data fetching hooks for CMS integration

**Excluded:**
- No CMS wiring yet (that's Phase F2)
- No branding changes (that's Phase F3)
- No Supabase data fetching implementation

### Dependencies
- Phase 4 schema must be executed (tables exist)
- Content Contract v2.0 (reference for section structure)
- Frontend Cleanup Plan document

### Done Criteria
- [ ] Only Creative Agency homepage variant remains
- [ ] No unused component folders
- [ ] All routes match Content Contract (/, /about, /services, /portfolio, /blog, /team, /faq, /contact)
- [ ] Components use prop interfaces ready for CMS data
- [ ] No TypeScript/build errors
- [ ] App renders with placeholder/static data

### Tasks
- [ ] Audit and delete unused page variants
- [ ] Delete unused component folders
- [ ] Consolidate routing to Creative Agency structure
- [ ] Create clean route configuration matching Contract
- [ ] Update component interfaces for CMS data shape
- [ ] Remove hardcoded demo data (replace with empty/placeholder)
- [ ] Verify build passes

### Reference Documents
- `/docs/frontend/frontend-cleanup-route-reduction-plan.md`
- `/docs/frontend/frontend-variant-audit.md`
- `/docs/contracts/Admin_Frontend_Content_Contract.md`

---

## Phase F2: Frontend ↔ CMS Wiring

**Status:** ⏳ Pending  
**Depends On:** Phase F1 complete, Phase 4 schema executed

### Goal
Connect frontend components to Supabase CMS tables. Homepage sections fetch real data. All public routes work with CMS content.

### Scope

**Included:**
- Create Supabase client for public app
- Implement data fetching hooks per content type
- Wire homepage sections to CMS tables
- Wire individual pages (About, Services, etc.)
- Implement dynamic routes (/services/:slug, /portfolio/:slug, /blog/:slug)
- Handle empty states gracefully
- Implement loading states

**Excluded:**
- No admin CRUD UI (out of scope for frontend)
- No authentication on public site
- No branding changes yet

### Dependencies
- Phase F1 complete (cleanup done)
- Phase 4 schema executed (tables exist with RLS)
- Minimal seed data inserted

### Done Criteria
- [ ] Homepage fetches from: hero_sections, services, projects, testimonials, awards, blog_posts, faqs, site_settings
- [ ] All dynamic routes resolve correctly (/services/:slug works)
- [ ] Empty sections hide gracefully (not render empty)
- [ ] Loading states display during fetch
- [ ] Error states handle failures gracefully
- [ ] No console errors related to data fetching

### Tasks
- [ ] Create Supabase client for public app
- [ ] Create useHeroSections hook
- [ ] Create useServices hook
- [ ] Create useProjects hook
- [ ] Create useBlogPosts hook
- [ ] Create useTestimonials hook
- [ ] Create useAwards hook
- [ ] Create useFaqs hook
- [ ] Create useSiteSettings hook
- [ ] Create usePages hook
- [ ] Create useTeamMembers hook
- [ ] Wire Hero section component
- [ ] Wire Services section component
- [ ] Wire About snippet section
- [ ] Wire Portfolio preview section
- [ ] Wire Testimonials section
- [ ] Wire Awards section
- [ ] Wire Blog preview section
- [ ] Wire FAQ inline/link section
- [ ] Wire CTA + Newsletter section
- [ ] Wire /about page
- [ ] Wire /services listing page
- [ ] Wire /services/:slug detail page
- [ ] Wire /portfolio listing page
- [ ] Wire /portfolio/:slug detail page
- [ ] Wire /blog listing page
- [ ] Wire /blog/:slug detail page
- [ ] Wire /team page
- [ ] Wire /faq page
- [ ] Wire /contact page (form submission)
- [ ] Implement newsletter subscription
- [ ] Test all routes with real data

### Reference Documents
- `/docs/supabase/Content_Data_Model.md` (Section E: Frontend Mapping)
- `/docs/contracts/Admin_Frontend_Content_Contract.md`

---

## Phase F3: Branding & Theme Sync

**Status:** ⏳ Pending  
**Depends On:** Phase F2 complete

### Goal
Apply Devmart branding to frontend. Sync theme colors, fonts, and assets from site_settings. Ensure dark/light mode works.

### Scope

**Included:**
- Load primary_color from site_settings
- Apply CSS custom properties for dynamic theming
- Load logos (light/dark) from site_settings
- Update meta tags from site_settings
- Implement dark/light mode toggle
- Persist theme preference
- Apply consistent typography

**Excluded:**
- No changes to admin theme (Darkone is fixed)
- No custom font uploads

### Dependencies
- Phase F2 complete (data fetching works)
- site_settings table has branding data

### Done Criteria
- [ ] Primary color applied from site_settings
- [ ] Logos load dynamically from site_settings
- [ ] Meta title/description from site_settings
- [ ] OG image from site_settings
- [ ] Dark/light mode toggle works
- [ ] Theme preference persists in localStorage
- [ ] Footer copyright from site_settings
- [ ] Social links from site_settings

### Tasks
- [ ] Create theme provider component
- [ ] Load site_settings on app mount
- [ ] Apply primary_color to CSS variables
- [ ] Implement logo component with light/dark variants
- [ ] Create SEO head component (react-helmet-async)
- [ ] Implement dark/light mode toggle
- [ ] Persist theme preference
- [ ] Wire footer with social links
- [ ] Wire footer with copyright
- [ ] Test theme across all pages

### Reference Documents
- `/docs/contracts/Admin_Frontend_Content_Contract.md` (Section 1: Site Settings)
- `/docs/supabase/Content_Data_Model.md` (Table: site_settings)

---

## Phase F4: Content Seeding & QA

**Status:** ⏳ Pending  
**Depends On:** Phase F3 complete

### Goal
Populate CMS with real Devmart content. QA all pages. Fix any issues. Prepare for production launch.

### Scope

**Included:**
- Create real content in Admin CMS
- Upload images to media bucket
- QA all public pages
- Fix layout/styling issues
- Performance optimization
- SEO verification
- Cross-browser testing

**Excluded:**
- No new features
- No structural changes

### Dependencies
- Phase F3 complete (branding applied)
- Admin CMS functional (CRUD works)

### Done Criteria
- [ ] All homepage sections have real content
- [ ] All images uploaded to media bucket
- [ ] All pages render correctly
- [ ] No console errors
- [ ] Lighthouse scores acceptable (>80 Performance, >90 Accessibility)
- [ ] SEO meta tags verified
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsive verified

### Tasks
- [ ] Create site_settings entry with real branding
- [ ] Upload logos to media bucket
- [ ] Create hero section(s)
- [ ] Create services (3-5 entries)
- [ ] Create projects (4-6 entries)
- [ ] Create team members (3-5 entries)
- [ ] Create testimonials (3-5 entries)
- [ ] Create awards (3-5 entries)
- [ ] Create blog posts (2-3 entries)
- [ ] Create FAQ entries (5-10 entries)
- [ ] Create About page content
- [ ] Create Privacy Policy page
- [ ] Create Terms of Service page
- [ ] QA homepage sections
- [ ] QA all listing pages
- [ ] QA all detail pages
- [ ] QA contact form submission
- [ ] QA newsletter subscription
- [ ] Run Lighthouse audit
- [ ] Fix any accessibility issues
- [ ] Cross-browser testing
- [ ] Mobile testing

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
