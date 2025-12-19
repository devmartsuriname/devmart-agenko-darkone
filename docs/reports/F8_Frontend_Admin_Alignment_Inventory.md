# F8 — Frontend ↔ Admin Content Alignment Inventory

**Created:** 2025-12-18  
**Phase:** F8 — Inventory + Mapping ONLY  
**Status:** Documentation Complete

---

## Overview

This document maps all content sections in the Zivan Public app to their data sources (Supabase tables, Admin CRUD modules, or hardcoded content). It identifies wiring gaps and proposes a future "Section Edit" approach.

---

## 1. Dynamic Sections Already Wired

These sections fetch data from Supabase and have corresponding Admin CRUD modules (or partial support).

### Homepage Sections (apps/public/src/components/Pages/Home.jsx)

| Section | Frontend Component | Hook | Table | Admin Module | Status |
|---------|-------------------|------|-------|--------------|--------|
| Hero | `Hero/index.jsx` | `useHeroSections()` | `hero_sections` | ❌ **MISSING** | ⚠️ Wired to DB, no Admin CRUD |
| Services | `Service/index.jsx` | `useServices()` | `services` | ✅ `/content/services` | ✅ Fully Wired |
| Portfolio | `Portfolio/index.jsx` | `useProjects({ featuredOnly: true })` | `projects` | ✅ `/content/projects` | ✅ Fully Wired |
| Awards | `Award/index.jsx` | `useAwards()` | `awards` | ✅ `/content/awards` | ✅ Fully Wired |
| Testimonials | `Slider/TestimonialSlider.jsx` | `useTestimonials()` | `testimonials` | ✅ `/content/testimonials` | ✅ Fully Wired |
| Blog (carousel) | `Slider/PostCarousel.jsx` | `useBlogPosts({ limit: 8 })` | `blog_posts` | ✅ `/content/blog` | ✅ Fully Wired |

### Detail Pages

| Page | Frontend File | Hook | Table | Admin Module | Status |
|------|---------------|------|-------|--------------|--------|
| Service Details | `Pages/ServiceDetailsPage.jsx` | `useService(slug)` | `services` | ✅ `/content/services` | ✅ Fully Wired |
| Portfolio Details | `Pages/PortfolioDetailsPage.jsx` | `useProject(slug)` | `projects` | ✅ `/content/projects` | ✅ Fully Wired |
| Blog Details | `Pages/BlogDetailsPage.jsx` | `useBlogPost(slug)` | `blog_posts` | ✅ `/content/blog` | ✅ Fully Wired |
| Team Member Details | `Pages/TeamDetailsPage.jsx` | `useTeamMember(slug)` | `team_members` | ✅ `/content/team` | ✅ Fully Wired |

### List Pages

| Page | Frontend File | Hook | Table | Admin Module | Status |
|------|---------------|------|-------|--------------|--------|
| Services List | `Pages/ServicePage.jsx` | `useServices()` | `services` | ✅ `/content/services` | ✅ Fully Wired |
| Portfolio List | `Pages/PortfolioPage.jsx` | `useProjects()` | `projects` | ✅ `/content/projects` | ✅ Fully Wired |
| Blog List | `Pages/BlogPage.jsx` | `useBlogPosts()` | `blog_posts` | ✅ `/content/blog` | ✅ Fully Wired |
| Team List | `Pages/TeamPage.jsx` | `useTeamMembers()` | `team_members` | ✅ `/content/team` | ✅ Fully Wired |
| FAQ List | `Pages/FaqPage.jsx` | `useFaqs()` | `faqs` | ✅ `/content/faqs` | ✅ Fully Wired |

### Shared Components

| Component | Location | Hook | Table | Admin Module | Status |
|-----------|----------|------|-------|--------------|--------|
| Footer | `Footer/index.jsx` | `useSiteSettings()` | `site_settings` | ⚠️ `/system/settings` (partial) | ⚠️ Partial |
| Header | `Header/index.jsx` | `useSiteSettings()` | `site_settings` | ⚠️ `/system/settings` (partial) | ⚠️ Partial |
| BrandingProvider | `context/BrandingProvider.jsx` | `useSiteSettings()` | `site_settings` | ⚠️ `/system/settings` (partial) | ⚠️ Partial |

---

## 2. Static/Hardcoded Sections

These sections use hardcoded/fallback data and are NOT CMS-driven.

### Homepage Static Sections (Home.jsx)

| Section | Component | Line(s) | Current Source | What Should Be Editable |
|---------|-----------|---------|----------------|-------------------------|
| FunFact/Stats | `FunFact/index.jsx` | 36-41, 276 | `fallbackFunfact` hardcoded | Numbers (22k, 15k, 121, 15), titles |
| About Section | `About/index.jsx` | 279-291 | Props hardcoded inline | Thumbnail, uperTitle, title, subTitle, featureList, btnText, btnUrl |
| WhyChose Section | `WhyChose/index.jsx` | 43-56, 293-298 | `fallbackWhyChose` hardcoded | sectionTitle, sectionSubTitle, thumbnailSrc, feature items (title, content) |
| CTA Section | `Cta/index.jsx` | 367-373 | Props hardcoded inline | title, btnText, btnUrl, bgUrl |
| Testimonial Images | `TestimonialSlider.jsx` | 163-169, 362-363 | `fallbackLayeredImages` hardcoded | Background layer images for testimonial section |

### About Page Static Sections (AboutPage.jsx)

| Section | Component | Current Source | What Should Be Editable |
|---------|-----------|----------------|-------------------------|
| About Block 1 | `AboutStyle4` | Props hardcoded | thumbnail, title, subTitle, featureList |
| About Block 2 | `AboutStyle3` | Props hardcoded | thumbnail, title, subTitle, features |
| How We Work | `IconBoxStyle6` items | Hardcoded array | Process steps (icon, title, content) |

### Contact Page Static Sections (ContactPage.jsx)

| Section | Current Source | What Should Be Editable |
|---------|----------------|-------------------------|
| Contact Info | Hardcoded strings | Email, phone, address, map coordinates |
| Map Settings | Hardcoded | Google Maps API key, coordinates |

### Header/Navigation (Header/index.jsx)

| Section | Current Source | What Should Be Editable |
|---------|----------------|-------------------------|
| Navigation Menu | Hardcoded nav items | Menu structure, labels, URLs (if dynamic menu needed) |
| Logo | `useSiteSettings().logo_light_url` | ⚠️ Data exists in DB but NOT exposed in Admin UI |

### Footer (Footer/index.jsx)

| Section | Current Source | What Should Be Editable |
|---------|----------------|-------------------------|
| Copyright | `useSiteSettings().footer_copyright` | ⚠️ Data exists in DB but NOT exposed in Admin UI |
| Social Links | `useSiteSettings().social_*` | ⚠️ Data exists in DB but NOT exposed in Admin UI |
| Policy Links | Hardcoded | Terms, Privacy URLs |

---

## 3. Admin Content Sources

### Fully Implemented Admin CRUD Modules

| Admin Route | Table | Frontend Consumption |
|-------------|-------|---------------------|
| `/content/services` | `services` | Home, ServicePage, ServiceDetailsPage |
| `/content/projects` | `projects` | Home, PortfolioPage, PortfolioDetailsPage |
| `/content/blog` | `blog_posts` | Home, BlogPage, BlogDetailsPage |
| `/content/pages` | `pages` | Generic CMS pages (not heavily used in Zivan) |
| `/content/team` | `team_members` | AboutPage, TeamPage, TeamDetailsPage |
| `/content/testimonials` | `testimonials` | Home (TestimonialSlider) |
| `/content/awards` | `awards` | Home (Award section) |
| `/content/faqs` | `faqs` | FaqPage |
| `/crm/contacts` | `contact_submissions` | Receives submissions from ContactPage |
| `/marketing/newsletter` | `newsletter_subscribers` | Receives submissions from Footer |

### Partially Implemented Admin Modules

| Admin Route | Table | Fields in DB | Fields Exposed in Admin UI |
|-------------|-------|--------------|---------------------------|
| `/system/settings` | `site_settings` | 24 fields total | ⚠️ Only `primary_color` exposed |

**Missing from Admin UI (site_settings fields NOT exposed):**
- `site_name`, `tagline`
- `logo_light_url`, `logo_dark_url`, `favicon_url`
- `meta_title_default`, `meta_description_default`, `social_image_url`
- `social_facebook`, `social_twitter`, `social_instagram`, `social_linkedin`, `social_github`
- `footer_copyright`
- `cta_heading`, `cta_subheading`, `cta_button_text`, `cta_button_link`
- `newsletter_enabled`, `newsletter_heading`, `newsletter_placeholder`

### Missing Admin CRUD Modules

| Table | Status | Impact |
|-------|--------|--------|
| `hero_sections` | ❌ No Admin CRUD | Hero content can only be edited via SQL/Supabase Dashboard |

---

## 4. Wiring Gaps / Mismatches

### Critical Gaps

| # | Gap | Table | Admin | Frontend | Impact | Priority |
|---|-----|-------|-------|----------|--------|----------|
| 1 | **Hero Sections Admin CRUD Missing** | `hero_sections` (exists) | ❌ No module | ✅ Uses `useHeroSections()` | Cannot edit hero from Admin | 🔴 High |
| 2 | **Site Settings Admin UI Incomplete** | `site_settings` (exists) | ⚠️ Only `primary_color` | ✅ Uses `useSiteSettings()` | Cannot edit logos, social links, SEO defaults, CTA, newsletter from Admin | 🔴 High |

### Medium Priority Gaps

| # | Gap | Current State | What's Needed | Priority |
|---|-----|---------------|---------------|----------|
| 3 | **CTA Section Wiring Gap** | Hardcoded in `Home.jsx` | Wire to `site_settings.cta_*` fields (already in DB) | 🟡 Medium |
| 4 | **FunFact/Stats Static** | `fallbackFunfact` hardcoded | No table exists — would need schema change OR section blocks | 🟡 Medium |
| 5 | **About Section Static** | Props hardcoded | No table exists — would need schema change OR section blocks | 🟡 Medium |
| 6 | **WhyChose Section Static** | `fallbackWhyChose` hardcoded | No table exists — would need schema change OR section blocks | 🟡 Medium |

### Low Priority Gaps

| # | Gap | Current State | What's Needed | Priority |
|---|-----|---------------|---------------|----------|
| 7 | **Contact Info Static** | Hardcoded in ContactPage | Could add to `site_settings` or new table | 🟢 Low |
| 8 | **Testimonial Layer Images** | `fallbackLayeredImages` hardcoded | Could add to `site_settings` or section blocks | 🟢 Low |
| 9 | **Navigation Menu Static** | Hardcoded in Header | Dynamic menu would need new `navigation_items` table | 🟢 Low |
| 10 | **Footer Policy Links** | Hardcoded | Could add to `site_settings` | 🟢 Low |

### Field Naming Mismatches (Minor)

| Table | DB Field | Frontend Expects | Notes |
|-------|----------|------------------|-------|
| `hero_sections` | `heading` | `title` (array) | Transformer handles this |
| `hero_sections` | `subheading` | `subtitle` | Transformer handles this |
| `testimonials` | `quote` | `text` | Transformer handles this |
| `testimonials` | `client_name` | `avatarName` | Transformer handles this |
| `awards` | `issuer` | `brand` | Transformer handles this |

*Note: All mismatches are handled by transformer functions in `Home.jsx`. No action needed.*

---

## 5. "Section Edit Model" Proposal (DOCUMENT ONLY)

### Objective

Enable Admin users to edit homepage sections that are currently hardcoded (FunFact, About, WhyChose, CTA, etc.) WITHOUT breaking existing dynamic sections and WITHOUT creating a table-per-section explosion.

### Proposed Approach: Hybrid Content Blocks

**Concept:** Add a generic `content_blocks` table that stores section-specific JSON content, keyed by a `section_key` identifier.

#### Schema Proposal (NOT EXECUTED)

```sql
-- DO NOT EXECUTE — Proposal only
CREATE TABLE public.content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,  -- e.g., 'home_funfact', 'home_about', 'home_whychose', 'home_cta'
  content JSONB NOT NULL DEFAULT '{}',  -- Flexible JSON content
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID,
  updated_by UUID
);
```

#### Section Key Registry

| section_key | Content Structure |
|-------------|-------------------|
| `home_funfact` | `{ items: [{ title, number }, ...] }` |
| `home_about` | `{ thumbnail, uperTitle, title, subTitle, featureList, btnText, btnUrl }` |
| `home_whychose` | `{ sectionTitle, sectionSubTitle, thumbnailSrc, items: [{ title, content }, ...] }` |
| `home_cta` | `{ title, btnText, btnUrl, bgUrl }` |
| `about_block_1` | `{ thumbnail, title, subTitle, featureList }` |
| `about_howwework` | `{ items: [{ icon, title, content }, ...] }` |
| `contact_info` | `{ email, phone, address, mapCoordinates }` |
| `footer_policy_links` | `{ terms_url, privacy_url }` |

#### Admin UI Approach

**Option A: Generic Section Editor (Recommended)**
- Single Admin page: `/system/sections`
- Dropdown to select section (by `section_key`)
- JSON form builder that renders fields based on section schema
- Pros: Single CRUD module for all static sections
- Cons: Requires schema-per-section definition in code

**Option B: Per-Section Admin Pages**
- Separate page for each section type
- More custom UI but more maintenance
- Not recommended for MVP

#### Frontend Integration

```jsx
// New hook (proposal)
export function useContentBlock(sectionKey) {
  const [block, setBlock] = useState(null);
  // ... fetch from content_blocks where section_key = sectionKey
  return { block, loading, error };
}

// Usage in Home.jsx
const { block: funfactData } = useContentBlock('home_funfact');
const funfactItems = funfactData?.content?.items || fallbackFunfact;
```

### Alternative: Expand Site Settings

Instead of a new table, expand `site_settings` with additional JSONB columns:
- `home_funfact_config` (JSONB)
- `home_about_config` (JSONB)
- `home_whychose_config` (JSONB)

**Pros:** No new table, simpler RLS
**Cons:** `site_settings` becomes bloated, harder to manage

### Recommendation

1. **Phase 1 (No Schema Changes):**
   - Implement Hero Sections Admin CRUD (table exists)
   - Expand Site Settings Admin UI (fields exist)
   - Wire CTA section to existing `site_settings.cta_*` fields

2. **Phase 2 (Schema Decision):**
   - Choose between `content_blocks` table vs expanded `site_settings`
   - Implement Section Editor for remaining static sections

---

## Summary

### What's Fully Wired ✅
- Services, Projects, Blog, Team, Testimonials, Awards, FAQs
- All list pages and detail pages
- Newsletter + Contact form submissions

### What's Partially Wired ⚠️
- Site Settings (DB fields exist, Admin UI only shows `primary_color`)
- Hero Sections (DB table exists, no Admin CRUD)

### What's Completely Static ❌
- FunFact, About, WhyChose, CTA, How We Work
- Contact Info, Policy Links, Navigation Menu

### Recommended Next Steps (Priority Order)
1. **A9 — Hero Sections Admin CRUD** (table exists, just needs UI)
2. **A12 — Expand Site Settings Admin UI** (fields exist, just needs exposure)
3. **F9 — Wire CTA to site_settings.cta_* fields** (no schema change)
4. **Future — Content Blocks for remaining static sections** (requires schema decision)

---

*End of F8 Inventory Report*
