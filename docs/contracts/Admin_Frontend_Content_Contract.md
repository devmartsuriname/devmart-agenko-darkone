# Admin ↔ Frontend Content Contract

> **Status:** FINAL  
> **Version:** 2.0  
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
- **Supabase Table:** `site_settings` (single-row)
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
| 6 | **Awards** | CMS | `awards` (active=true) | title, issuer, year, logo_url |
| 7 | **Blog Preview** | CMS | `blog_posts` (recent 3, published) | title, excerpt, featured_image, slug, published_at |
| 8 | **Call-to-Action + Newsletter** | CMS | `site_settings` | cta_heading, cta_subheading, cta_button_text, cta_button_link, newsletter_enabled |

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
| Awards | `awards` | Admin | Frontend | `/content/awards` |
| FAQs | `faqs` | Admin | Frontend | `/content/faq` |
| Contact Submissions | `contact_submissions` | Frontend (submit) | Admin (read) | `/crm/contacts` |
| Newsletter Subscribers | `newsletter_subscribers` | Frontend (submit) | Admin (read) | `/crm/newsletter` |

### Content Ownership Rules
- **Admin creates/edits:** All content types except Contact Submissions and Newsletter Subscribers
- **Frontend creates:** Contact Submissions, Newsletter Subscribers (form submissions)
- **Frontend reads:** All content types (public read access)

---

## 4. Routing Rules (Static vs CMS-Driven)

### Frontend Routes

| Route | Type | Data Source | Notes |
|-------|------|-------------|-------|
| `/` | CMS-driven | Multiple tables | Homepage (hero, services, projects, testimonials, awards, blog) |
| `/about` | CMS-driven | `pages` (slug: `about`) | Single page content |
| `/services` | CMS-driven | `services` (list) | All active services |
| `/services/:slug` | CMS-driven | `services` (single) | Service detail page |
| `/portfolio` | CMS-driven | `projects` (list) | All published projects |
| `/portfolio/:slug` | CMS-driven | `projects` (single) | Project detail page |
| `/blog` | CMS-driven | `blog_posts` (list) | All published posts |
| `/blog/:slug` | CMS-driven | `blog_posts` (single) | Blog post detail page |
| `/team` | CMS-driven | `team_members` (list) | Team listing page |
| `/faq` | CMS-driven | `faqs` (list) | FAQ accordion page |
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
| `/content/awards` | Awards | admin, editor |
| `/content/faq` | FAQs | admin, editor |
| `/crm/contacts` | Contact Submissions | admin, editor |
| `/crm/newsletter` | Newsletter Subscribers | admin, editor |

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

## 6. Resolved Decisions

All previously open questions have been resolved:

| # | Question | Decision | Status | Impact |
|---|----------|----------|--------|--------|
| 1 | **Awards section** | Homepage section (after Testimonials) | **FINAL** | Add `awards` table, display on homepage |
| 2 | **FAQ section** | Standalone `/faq` page | **FINAL** | Add `faqs` table, new frontend route |
| 3 | **Newsletter** | Footer inline form (part of CTA section) | **FINAL** | Add `newsletter_subscribers` table, toggle in settings |
| 4 | **Contact form fields** | 4 fields: Name*, Email*, Subject (optional), Message* | **FINAL** | Simple form, no phone/company fields |
| 5 | **Media Library** | Supabase Storage with 2 buckets | **FINAL** | `media` (public), `documents` (private) |
| 6 | **Rich text format** | Markdown (stored as text, rendered client-side) | **FINAL** | Simple, portable, editor-friendly |
| 7 | **Image dimensions** | Defined per content type (see Appendix) | **FINAL** | Frontend handles responsive sizing |

---

## 7. Decision Details

### 7.1 Awards Section (FINAL)

**Decision:** Homepage section displayed after Testimonials.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | `string` | Yes | Award name (e.g., "Best Agency 2024") |
| issuer | `string` | Yes | Awarding organization |
| year | `integer` | Yes | Year received |
| logo_url | `string` | No | Award/issuer logo (optional) |
| display_order | `integer` | Yes | Sort order on homepage |
| is_active | `boolean` | Yes | Show/hide toggle |

**Rationale:** Awards add credibility and are visually compact. Homepage placement is standard for agency sites.

---

### 7.2 FAQ Section (FINAL)

**Decision:** Standalone page at `/faq` with accordion UI.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| question | `string` | Yes | The question text |
| answer | `text` | Yes | Markdown-supported answer |
| category | `string` | No | Optional grouping (e.g., "Services", "Pricing") |
| display_order | `integer` | Yes | Sort order |
| is_published | `boolean` | Yes | Show/hide toggle |

**Rationale:** FAQs are typically long-form content unsuitable for homepage. Standalone page allows proper SEO and categorization.

---

### 7.3 Newsletter (FINAL)

**Decision:** Inline footer form within the CTA section.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| email | `string` | Yes | Subscriber email |
| subscribed_at | `timestamp` | Yes | Auto-generated |
| is_confirmed | `boolean` | Yes | Default: false (no double opt-in in MVP) |
| source | `string` | No | e.g., "footer", "blog" |

**Site Settings Addition:**
| Setting | Type | Default |
|---------|------|---------|
| newsletter_enabled | `boolean` | true |
| newsletter_heading | `string` | "Stay Updated" |
| newsletter_placeholder | `string` | "Enter your email" |

**Rationale:** Footer placement is unobtrusive and doesn't require a separate page. CRM section for admin viewing only.

---

### 7.4 Contact Form Fields (FINAL)

**Decision:** 4 simple fields, minimal friction.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | `string` | Yes | Max 100 chars |
| email | `string` | Yes | Valid email, max 255 chars |
| subject | `string` | No | Max 200 chars |
| message | `text` | Yes | Max 2000 chars |

**Additional Fields (Auto-generated):**
| Field | Type | Notes |
|-------|------|-------|
| submitted_at | `timestamp` | Auto-generated |
| is_read | `boolean` | Default: false |
| ip_address | `string` | For spam prevention (optional) |

**Rationale:** No phone/company fields reduces friction. Subject is optional but helps categorization.

---

### 7.5 Media Library (FINAL)

**Decision:** Supabase Storage with 2 buckets.

| Bucket | Visibility | Purpose | Allowed Types |
|--------|------------|---------|---------------|
| `media` | Public | Images, logos, thumbnails | jpg, png, webp, svg, gif |
| `documents` | Private | PDFs, internal files | pdf, doc, docx |

**File Naming Convention:**
```
{content_type}/{id}/{filename}
Example: projects/abc123/hero.webp
```

**Size Limits:**
- Images: Max 5MB
- Documents: Max 10MB

**Rationale:** Supabase Storage is integrated, supports CDN, and handles permissions. Two buckets separate public assets from private documents.

---

### 7.6 Rich Text Format (FINAL)

**Decision:** Markdown stored as plain text.

| Content Type | Field | Format |
|--------------|-------|--------|
| Pages | body | Markdown |
| Blog Posts | body | Markdown |
| Services | description | Plain text (short) |
| FAQs | answer | Markdown |
| Projects | description | Markdown |

**Editor:** Use a simple Markdown editor in Admin (e.g., react-markdown + textarea, or react-quill in markdown mode).

**Rationale:** Markdown is portable, version-control friendly, and renders consistently. Avoids HTML security concerns and complex WYSIWYG state.

---

### 7.7 Image Dimensions (FINAL)

**Decision:** Define standard dimensions per use case.

| Use Case | Dimensions | Aspect Ratio | Format |
|----------|------------|--------------|--------|
| Hero Background | 1920×1080 | 16:9 | webp, jpg |
| Project Thumbnail | 800×600 | 4:3 | webp, jpg |
| Project Full | 1200×800 | 3:2 | webp, jpg |
| Blog Featured | 1200×675 | 16:9 | webp, jpg |
| Team Avatar | 400×400 | 1:1 | webp, jpg, png |
| Testimonial Avatar | 150×150 | 1:1 | webp, jpg, png |
| Award Logo | 200×200 | 1:1 | png, svg |
| Service Icon | 64×64 | 1:1 | svg, png |
| Logo (light/dark) | 300×80 | ~4:1 | svg, png |
| Favicon | 32×32 | 1:1 | ico, png |
| OG Image | 1200×630 | ~1.9:1 | jpg, png |

**Frontend Responsibility:** Responsive image handling via `srcset` or CSS object-fit. CMS stores original; frontend resizes as needed.

**Rationale:** Defined dimensions ensure visual consistency and optimal performance. WebP preferred for smaller file sizes.

---

## 8. Related Documents

| Document | Purpose |
|----------|---------|
| [Backend Schema](/docs/backend.md) | Database tables and RLS policies (TBD) |
| [Frontend Cleanup Plan](/docs/frontend/frontend-cleanup-route-reduction-plan.md) | Route consolidation before CMS integration |
| [Frontend Variant Audit](/docs/frontend/frontend-variant-audit.md) | Creative Agency selection rationale |

---

## Appendix: Content Type Field Reference (Updated)

### Full Field Specifications

| Content Type | Required Fields |
|--------------|-----------------|
| Site Settings | site_name, logo_url, logo_dark_url, favicon_url, primary_color, meta_title, meta_description, og_image_url, footer_copyright, social_links, newsletter_enabled, newsletter_heading, cta_heading, cta_button_text, cta_button_link |
| Pages | id, slug, title, body (markdown), meta_title, meta_description, is_published, created_at, updated_at |
| Services | id, slug, title, description, icon_url, display_order, is_featured, is_published |
| Projects | id, slug, title, description (markdown), thumbnail_url, full_image_url, category, client_name, project_url, is_featured, is_published, created_at |
| Blog Posts | id, slug, title, excerpt, body (markdown), featured_image_url, author_id, published_at, is_published, created_at, updated_at |
| Testimonials | id, name, role, company, quote, avatar_url, is_active, display_order |
| Team Members | id, name, role, bio, avatar_url, email, linkedin_url, display_order, is_active |
| Hero Sections | id, heading, subheading, cta_text, cta_link, background_image_url, is_active |
| Awards | id, title, issuer, year, logo_url, display_order, is_active |
| FAQs | id, question, answer (markdown), category, display_order, is_published |
| Contact Submissions | id, name, email, subject, message, submitted_at, is_read, ip_address |
| Newsletter Subscribers | id, email, subscribed_at, is_confirmed, source |

---

## Decision Summary Table

| # | Question | Decision | Status | Impact |
|---|----------|----------|--------|--------|
| 1 | Awards | Homepage section (after Testimonials) | **FINAL** | New `awards` table |
| 2 | FAQ | Standalone `/faq` page | **FINAL** | New `faqs` table + route |
| 3 | Newsletter | Footer inline form | **FINAL** | New `newsletter_subscribers` table |
| 4 | Contact fields | Name*, Email*, Subject, Message* | **FINAL** | 4-field form |
| 5 | Media Library | Supabase Storage (2 buckets) | **FINAL** | `media` (public) + `documents` (private) |
| 6 | Rich text | Markdown | **FINAL** | Simple editor, portable |
| 7 | Image sizes | Defined per content type | **FINAL** | See dimension table |

---

*End of Contract Document — Version 2.0 FINAL*
