# Admin ↔ Frontend Content Contract

> **Status:** DRAFT  
> **Version:** 1.0  
> **Last Updated:** 2025-12-15  
> **Authoritative:** Yes — defines the data contract between Admin CMS, Zivan Frontend, and Supabase

---

## Purpose

This document defines the exact content, settings, and data contract between:
- **Darkone Admin** (CMS for content management)
- **Zivan Creative Agency Frontend** (public-facing website)
- **Supabase** (backend data layer)

### Source Documents
- [Primary PRD](/docs/prd/prd-devmart-internal-platform.md)
- [Secondary PRD](/docs/prd/prd-devmart-company-website.md)
- [Frontend Variant Audit](/docs/frontend/frontend-variant-audit.md)
- [Frontend Cleanup Plan](/docs/frontend/frontend-cleanup-route-reduction-plan.md)

### Scope
- **Frontend Variant:** Creative Agency ONLY (no other variants)
- **Purpose:** Internal Devmart platform (not productized CMS)

---

## 1. Global Site Settings

Settings managed in Admin CMS and consumed by Frontend.

| Setting | Type | Owner | Consumer | Notes |
|---------|------|-------|----------|-------|
| Site Name | `string` | Admin | Frontend | Used in `<title>`, footer, meta |
| Logo (light mode) | `image URL` | Admin | Frontend | Header, Footer |
| Logo (dark mode) | `image URL` | Admin | Frontend | Optional dark variant |
| Favicon | `image URL` | Admin | Frontend | Browser tab icon |
| Primary Color | `hex string` | Admin | Frontend | Accent color (buttons, links) |
| Default Meta Title | `string` | Admin | Frontend | SEO fallback when page has no title |
| Default Meta Description | `string` | Admin | Frontend | SEO fallback |
| Social Image (OG) | `image URL` | Admin | Frontend | Open Graph image |
| Footer Copyright | `string` | Admin | Frontend | e.g., "© 2025 Devmart" |
| Social Links | `JSON` | Admin | Frontend | `{ twitter, linkedin, github }` |

### Storage Location
- **Supabase Table:** `site_settings` (single-row or key-value)
- **Admin Route:** `/system/settings`

---

## 2. Homepage Section-by-Section Mapping (Creative Agency)

The Creative Agency homepage consists of the following sections, in order:

| # | Section | Static/CMS | Content Source | High-Level Fields |
|---|---------|------------|----------------|-------------------|
| 1 | **Hero** | CMS | `hero_sections` | heading, subheading, cta_text, cta_link, background_image |
| 2 | **Services Overview** | CMS | `services` (featured) | title, description, icon, link, display_order |
| 3 | **About / Why Devmart** | CMS | `pages` (slug: `about-snippet`) | heading, body_content, image |
| 4 | **Portfolio Preview** | CMS | `projects` (featured=true, limit 6) | title, thumbnail, slug, category |
| 5 | **Testimonials** | CMS | `testimonials` (active=true) | name, role, company, quote, avatar |
| 6 | **Blog Preview** | CMS | `blog_posts` (recent 3, published) | title, excerpt, featured_image, slug, published_at |
| 7 | **Call-to-Action** | CMS | `site_settings` or `cta_blocks` | heading, subheading, button_text, button_link |

### Section Display Rules
- Sections with no data are **hidden** (not shown with empty state)
- Order is fixed (not configurable via CMS)
- Each section has a `display_order` or `featured` flag for content prioritization

---

## 3. CMS Content Types & Ownership

| Content Type | Supabase Table | Owner | Consumer | Admin CRUD Route |
|--------------|----------------|-------|----------|------------------|
| Site Settings | `site_settings` | Admin | Frontend | `/system/settings` |
| Pages | `pages` | Admin | Frontend | `/content/pages` |
| Services | `services` | Admin | Frontend | `/content/services` |
| Projects | `projects` | Admin | Frontend | `/content/projects` |
| Blog Posts | `blog_posts` | Admin | Frontend | `/content/blog` |
| Testimonials | `testimonials` | Admin | Frontend | `/content/testimonials` |
| Team Members | `team_members` | Admin | Frontend | `/content/team` |
| Hero Sections | `hero_sections` | Admin | Frontend | `/content/hero` |
| Contact Submissions | `contact_submissions` | Frontend (submit) | Admin (read) | `/crm/contacts` |

### Content Ownership Rules
- **Admin creates/edits:** All content types except Contact Submissions
- **Frontend creates:** Contact Submissions only (form submissions)
- **Frontend reads:** All content types (public read access)

---

## 4. Routing Rules (Static vs CMS-Driven)

### Frontend Routes

| Route | Type | Data Source | Notes |
|-------|------|-------------|-------|
| `/` | CMS-driven | Multiple tables | Homepage (hero, services, projects, testimonials, blog) |
| `/about` | CMS-driven | `pages` (slug: `about`) | Single page content |
| `/services` | CMS-driven | `services` (list) | All active services |
| `/services/:slug` | CMS-driven | `services` (single) | Service detail page |
| `/portfolio` | CMS-driven | `projects` (list) | All published projects |
| `/portfolio/:slug` | CMS-driven | `projects` (single) | Project detail page |
| `/blog` | CMS-driven | `blog_posts` (list) | All published posts |
| `/blog/:slug` | CMS-driven | `blog_posts` (single) | Blog post detail page |
| `/team` | CMS-driven | `team_members` (list) | Team listing page |
| `/contact` | Hybrid | Static layout + form | Form submits to `contact_submissions` |
| `/404` | Static | Hardcoded | Error page |

### Admin Routes (Reference)

| Route Prefix | Content Type | RBAC |
|--------------|--------------|------|
| `/system/settings` | Site Settings | admin |
| `/content/pages` | Pages | admin, editor |
| `/content/services` | Services | admin, editor |
| `/content/projects` | Projects | admin, editor |
| `/content/blog` | Blog Posts | admin, editor |
| `/content/testimonials` | Testimonials | admin, editor |
| `/content/team` | Team Members | admin, editor |
| `/crm/contacts` | Contact Submissions | admin, editor |

---

## 5. Explicit Non-Goals

The following are explicitly **OUT OF SCOPE** for this platform:

| Non-Goal | Reason |
|----------|--------|
| ❌ Page Builder | Content blocks are predefined, not drag-and-drop |
| ❌ White-label CMS | Internal use only, no branding customization |
| ❌ Multi-tenant | Single organization (Devmart) |
| ❌ E-commerce | Not in initial scope (per PRD) |
| ❌ Custom Font Uploads | Use system/theme fonts only |
| ❌ Admin Theme Customization | Darkone Admin is fixed |
| ❌ User-Generated Content | No public comments, no public accounts |
| ❌ Multiple Homepage Variants | Creative Agency ONLY |
| ❌ Page Versioning | No draft/publish workflow in MVP |
| ❌ Content Scheduling | No future-dated publishing |

---

## 6. Open Questions

Items requiring clarification before schema implementation:

| # | Question | Context | Status |
|---|----------|---------|--------|
| 1 | **Awards section** | PRD mentions "Awards (dynamic)" | **OPEN:** Include in homepage or separate page? |
| 2 | **FAQ section** | PRD mentions "FAQs" module | **OPEN:** Homepage section or standalone `/faq` page? |
| 3 | **Newsletter** | PRD mentions "Newsletter" module | **OPEN:** Footer signup or dedicated CRM section? |
| 4 | **Contact form fields** | Not defined in PRD | **OPEN:** What are the required/optional fields? |
| 5 | **Media Library** | File storage approach | **OPEN:** Supabase Storage buckets or external URLs? |
| 6 | **Rich text format** | Blog/Page body content | **OPEN:** Markdown, HTML, or structured JSON? |
| 7 | **Image dimensions** | Thumbnail vs full-size | **OPEN:** Define required image sizes per content type? |

---

## 7. Related Documents

| Document | Purpose |
|----------|---------|
| [Backend Schema](/docs/backend.md) | Database tables and RLS policies (TBD) |
| [Frontend Cleanup Plan](/docs/frontend/frontend-cleanup-route-reduction-plan.md) | Route consolidation before CMS integration |
| [Frontend Variant Audit](/docs/frontend/frontend-variant-audit.md) | Creative Agency selection rationale |

---

## Appendix: Content Type Field Reference

> **Note:** Detailed field specifications will be added in the **Content Data Model (Supabase)** document once Open Questions are resolved.

### Minimum Viable Fields (Per Content Type)

| Content Type | Required Fields |
|--------------|-----------------|
| Site Settings | site_name, logo_url, favicon_url, primary_color, meta_title, meta_description |
| Pages | id, slug, title, body, meta_title, meta_description, is_published |
| Services | id, slug, title, description, icon, display_order, is_featured |
| Projects | id, slug, title, description, thumbnail, category, is_featured |
| Blog Posts | id, slug, title, excerpt, body, featured_image, published_at, is_published |
| Testimonials | id, name, role, company, quote, avatar_url, is_active |
| Team Members | id, name, role, bio, avatar_url, display_order |
| Hero Sections | id, heading, subheading, cta_text, cta_link, background_image, is_active |
| Contact Submissions | id, name, email, message, submitted_at, is_read |

---

*End of Contract Document*
