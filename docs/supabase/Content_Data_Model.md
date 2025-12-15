# Supabase Content Data Model

**Version:** 1.0 DRAFT  
**Date:** 2025-12-14  
**Status:** Documentation Only — Schema NOT Executed  
**Source:** [Content Contract v2.0](../contracts/Admin_Frontend_Content_Contract.md)

---

## Overview

This document defines the complete Supabase schema for the Devmart Internal Platform CMS. It covers:
- All content tables with columns, types, and constraints
- Supabase Storage bucket configuration
- Row Level Security (RLS) policies
- Database functions and RPCs
- Frontend content mapping
- Migration and rollback plan

> ⚠️ **DOCUMENTATION ONLY** — No SQL has been executed. This document requires approval before implementation.

---

## A) Tables

### Common Conventions

| Convention | Description |
|------------|-------------|
| **Primary Key** | UUID with `gen_random_uuid()` default |
| **Timestamps** | `created_at`, `updated_at` (TIMESTAMPTZ, NOT NULL, default `now()`) |
| **Audit Fields** | `created_by`, `updated_by` (UUID, nullable, references auth.users) |
| **Slugs** | Unique, lowercase, URL-safe strings |
| **Status** | Enum: `draft`, `published`, `archived` |
| **Sort Order** | Integer for manual ordering where applicable |

---

### 1. `site_settings` (Singleton)

Global branding and configuration. Single-row table.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `site_name` | TEXT | NO | `'Devmart'` | Site name for meta/footer |
| `tagline` | TEXT | YES | NULL | Optional tagline |
| `logo_light_url` | TEXT | YES | NULL | Logo for light mode |
| `logo_dark_url` | TEXT | YES | NULL | Logo for dark mode |
| `favicon_url` | TEXT | YES | NULL | Favicon URL |
| `primary_color` | TEXT | YES | `'#7e67fe'` | Brand primary color (hex) |
| `meta_title_default` | TEXT | YES | NULL | Default SEO title |
| `meta_description_default` | TEXT | YES | NULL | Default SEO description |
| `social_image_url` | TEXT | YES | NULL | OG image URL |
| `social_facebook` | TEXT | YES | NULL | Facebook URL |
| `social_twitter` | TEXT | YES | NULL | Twitter/X URL |
| `social_instagram` | TEXT | YES | NULL | Instagram URL |
| `social_linkedin` | TEXT | YES | NULL | LinkedIn URL |
| `social_github` | TEXT | YES | NULL | GitHub URL |
| `footer_copyright` | TEXT | YES | NULL | Footer copyright text |
| `newsletter_enabled` | BOOLEAN | NO | `true` | Show newsletter signup |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | Last update timestamp |
| `updated_by` | UUID | YES | NULL | Last editor (ref auth.users) |

**Constraints:**
- Single row enforced via trigger or application logic
- No slug (singleton)

**Indexes:** None required (single row)

---

### 2. `pages`

Static and CMS-driven pages (About, Privacy, Terms, etc.)

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `slug` | TEXT | NO | — | URL slug (unique) |
| `title` | TEXT | NO | — | Page title |
| `meta_title` | TEXT | YES | NULL | SEO title override |
| `meta_description` | TEXT | YES | NULL | SEO description |
| `content` | TEXT | YES | NULL | Page body (Markdown) |
| `featured_image_url` | TEXT | YES | NULL | Hero/header image |
| `status` | TEXT | NO | `'draft'` | draft / published / archived |
| `published_at` | TIMESTAMPTZ | YES | NULL | Publish date |
| `sort_order` | INTEGER | NO | `0` | Display order |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | |
| `created_by` | UUID | YES | NULL | |
| `updated_by` | UUID | YES | NULL | |

**Constraints:**
- `slug` UNIQUE
- `status` CHECK IN ('draft', 'published', 'archived')

**Indexes:**
- `idx_pages_slug` on `slug`
- `idx_pages_status` on `status`
- `idx_pages_published_at` on `published_at`

---

### 3. `hero_sections`

Homepage hero slides/sections.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `heading` | TEXT | NO | — | Main heading |
| `subheading` | TEXT | YES | NULL | Subheading text |
| `cta_text` | TEXT | YES | NULL | Button text |
| `cta_link` | TEXT | YES | NULL | Button URL |
| `background_image_url` | TEXT | YES | NULL | Hero background (1920x1080) |
| `background_video_url` | TEXT | YES | NULL | Optional video background |
| `overlay_opacity` | INTEGER | NO | `50` | Overlay darkness (0-100) |
| `text_alignment` | TEXT | NO | `'center'` | left / center / right |
| `is_active` | BOOLEAN | NO | `true` | Show/hide this hero |
| `sort_order` | INTEGER | NO | `0` | Slide order |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | |
| `created_by` | UUID | YES | NULL | |
| `updated_by` | UUID | YES | NULL | |

**Constraints:**
- `text_alignment` CHECK IN ('left', 'center', 'right')
- `overlay_opacity` CHECK BETWEEN 0 AND 100

**Indexes:**
- `idx_hero_sections_active_order` on `(is_active, sort_order)`

---

### 4. `services`

Services offered by Devmart.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `slug` | TEXT | NO | — | URL slug (unique) |
| `title` | TEXT | NO | — | Service name |
| `short_description` | TEXT | YES | NULL | Brief description (homepage) |
| `content` | TEXT | YES | NULL | Full description (Markdown) |
| `icon` | TEXT | YES | NULL | Icon identifier or URL |
| `image_url` | TEXT | YES | NULL | Service image (400x400) |
| `meta_title` | TEXT | YES | NULL | SEO title |
| `meta_description` | TEXT | YES | NULL | SEO description |
| `is_featured` | BOOLEAN | NO | `false` | Show on homepage |
| `status` | TEXT | NO | `'draft'` | draft / published / archived |
| `published_at` | TIMESTAMPTZ | YES | NULL | |
| `sort_order` | INTEGER | NO | `0` | Display order |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | |
| `created_by` | UUID | YES | NULL | |
| `updated_by` | UUID | YES | NULL | |

**Constraints:**
- `slug` UNIQUE
- `status` CHECK IN ('draft', 'published', 'archived')

**Indexes:**
- `idx_services_slug` on `slug`
- `idx_services_status` on `status`
- `idx_services_featured` on `(is_featured, status)`

---

### 5. `projects`

Portfolio/project showcase.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `slug` | TEXT | NO | — | URL slug (unique) |
| `title` | TEXT | NO | — | Project name |
| `short_description` | TEXT | YES | NULL | Brief summary |
| `content` | TEXT | YES | NULL | Full case study (Markdown) |
| `thumbnail_url` | TEXT | YES | NULL | Thumbnail (800x600, 4:3) |
| `featured_image_url` | TEXT | YES | NULL | Detail page header |
| `gallery_urls` | TEXT[] | YES | NULL | Array of gallery image URLs |
| `client_name` | TEXT | YES | NULL | Client name |
| `project_url` | TEXT | YES | NULL | Live project link |
| `technologies` | TEXT[] | YES | NULL | Tech stack tags |
| `category` | TEXT | YES | NULL | Project category |
| `meta_title` | TEXT | YES | NULL | SEO title |
| `meta_description` | TEXT | YES | NULL | SEO description |
| `is_featured` | BOOLEAN | NO | `false` | Show on homepage |
| `status` | TEXT | NO | `'draft'` | draft / published / archived |
| `published_at` | TIMESTAMPTZ | YES | NULL | |
| `sort_order` | INTEGER | NO | `0` | |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | |
| `created_by` | UUID | YES | NULL | |
| `updated_by` | UUID | YES | NULL | |

**Constraints:**
- `slug` UNIQUE
- `status` CHECK IN ('draft', 'published', 'archived')

**Indexes:**
- `idx_projects_slug` on `slug`
- `idx_projects_status` on `status`
- `idx_projects_featured` on `(is_featured, status)`
- `idx_projects_category` on `category`

---

### 6. `blog_posts`

Blog articles.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `slug` | TEXT | NO | — | URL slug (unique) |
| `title` | TEXT | NO | — | Post title |
| `excerpt` | TEXT | YES | NULL | Short excerpt |
| `content` | TEXT | YES | NULL | Full content (Markdown) |
| `featured_image_url` | TEXT | YES | NULL | Featured image (1200x600, 2:1) |
| `author_id` | UUID | YES | NULL | Ref to team_members |
| `category` | TEXT | YES | NULL | Blog category |
| `tags` | TEXT[] | YES | NULL | Tag array |
| `meta_title` | TEXT | YES | NULL | SEO title |
| `meta_description` | TEXT | YES | NULL | SEO description |
| `is_featured` | BOOLEAN | NO | `false` | Featured post |
| `status` | TEXT | NO | `'draft'` | draft / published / archived |
| `published_at` | TIMESTAMPTZ | YES | NULL | |
| `views_count` | INTEGER | NO | `0` | View counter |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | |
| `created_by` | UUID | YES | NULL | |
| `updated_by` | UUID | YES | NULL | |

**Constraints:**
- `slug` UNIQUE
- `status` CHECK IN ('draft', 'published', 'archived')
- `author_id` FK to `team_members(id)` ON DELETE SET NULL

**Indexes:**
- `idx_blog_posts_slug` on `slug`
- `idx_blog_posts_status` on `status`
- `idx_blog_posts_published_at` on `published_at`
- `idx_blog_posts_category` on `category`
- `idx_blog_posts_author` on `author_id`

---

### 7. `testimonials`

Client testimonials.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `client_name` | TEXT | NO | — | Client/person name |
| `client_role` | TEXT | YES | NULL | Job title |
| `client_company` | TEXT | YES | NULL | Company name |
| `avatar_url` | TEXT | YES | NULL | Client photo (200x200, 1:1) |
| `quote` | TEXT | NO | — | Testimonial text |
| `rating` | INTEGER | YES | NULL | Star rating (1-5) |
| `project_id` | UUID | YES | NULL | Related project |
| `is_featured` | BOOLEAN | NO | `false` | Show on homepage |
| `is_active` | BOOLEAN | NO | `true` | Visible on frontend |
| `sort_order` | INTEGER | NO | `0` | |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | |
| `created_by` | UUID | YES | NULL | |
| `updated_by` | UUID | YES | NULL | |

**Constraints:**
- `rating` CHECK BETWEEN 1 AND 5

**Indexes:**
- `idx_testimonials_featured` on `(is_featured, is_active)`
- `idx_testimonials_project` on `project_id`

---

### 8. `team_members`

Team/staff profiles.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `slug` | TEXT | NO | — | URL slug (unique) |
| `name` | TEXT | NO | — | Full name |
| `role` | TEXT | NO | — | Job title |
| `bio` | TEXT | YES | NULL | Biography (Markdown) |
| `avatar_url` | TEXT | YES | NULL | Photo (400x400, 1:1) |
| `email` | TEXT | YES | NULL | Contact email |
| `phone` | TEXT | YES | NULL | Contact phone |
| `social_linkedin` | TEXT | YES | NULL | LinkedIn URL |
| `social_twitter` | TEXT | YES | NULL | Twitter URL |
| `social_github` | TEXT | YES | NULL | GitHub URL |
| `is_featured` | BOOLEAN | NO | `false` | Show on homepage |
| `is_active` | BOOLEAN | NO | `true` | Currently employed |
| `sort_order` | INTEGER | NO | `0` | |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | |
| `created_by` | UUID | YES | NULL | |
| `updated_by` | UUID | YES | NULL | |

**Constraints:**
- `slug` UNIQUE

**Indexes:**
- `idx_team_members_slug` on `slug`
- `idx_team_members_featured` on `(is_featured, is_active)`

---

### 9. `awards`

Awards and recognition (homepage section).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `title` | TEXT | NO | — | Award name |
| `issuer` | TEXT | YES | NULL | Awarding organization |
| `year` | INTEGER | YES | NULL | Year received |
| `description` | TEXT | YES | NULL | Brief description |
| `image_url` | TEXT | YES | NULL | Award badge/logo |
| `link_url` | TEXT | YES | NULL | External link |
| `is_featured` | BOOLEAN | NO | `true` | Show on homepage |
| `is_active` | BOOLEAN | NO | `true` | Visible |
| `sort_order` | INTEGER | NO | `0` | |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | |
| `created_by` | UUID | YES | NULL | |
| `updated_by` | UUID | YES | NULL | |

**Indexes:**
- `idx_awards_featured` on `(is_featured, is_active, sort_order)`

---

### 10. `faqs`

FAQ entries (standalone /faq page).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `question` | TEXT | NO | — | FAQ question |
| `answer` | TEXT | NO | — | Answer (Markdown) |
| `category` | TEXT | YES | NULL | FAQ category |
| `is_featured` | BOOLEAN | NO | `false` | Show on homepage snippet |
| `is_active` | BOOLEAN | NO | `true` | Visible |
| `sort_order` | INTEGER | NO | `0` | |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | |
| `created_by` | UUID | YES | NULL | |
| `updated_by` | UUID | YES | NULL | |

**Indexes:**
- `idx_faqs_category` on `category`
- `idx_faqs_active_order` on `(is_active, sort_order)`

---

### 11. `contact_submissions`

Contact form submissions (frontend → admin).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `name` | TEXT | NO | — | Sender name* |
| `email` | TEXT | NO | — | Sender email* |
| `subject` | TEXT | YES | NULL | Message subject |
| `message` | TEXT | NO | — | Message body* |
| `status` | TEXT | NO | `'new'` | new / read / replied / archived |
| `replied_at` | TIMESTAMPTZ | YES | NULL | When replied |
| `replied_by` | UUID | YES | NULL | Who replied |
| `ip_address` | TEXT | YES | NULL | Sender IP (privacy-aware) |
| `user_agent` | TEXT | YES | NULL | Browser info |
| `created_at` | TIMESTAMPTZ | NO | `now()` | Submission time |

**Constraints:**
- `status` CHECK IN ('new', 'read', 'replied', 'archived')

**Indexes:**
- `idx_contact_submissions_status` on `status`
- `idx_contact_submissions_created` on `created_at`

**Note:** No `updated_at` — submissions are immutable (only status changes).

---

### 12. `newsletter_subscribers`

Newsletter signup (footer inline form).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `email` | TEXT | NO | — | Subscriber email (unique) |
| `is_active` | BOOLEAN | NO | `true` | Subscribed status |
| `subscribed_at` | TIMESTAMPTZ | NO | `now()` | Signup time |
| `unsubscribed_at` | TIMESTAMPTZ | YES | NULL | Unsubscribe time |
| `source` | TEXT | YES | `'footer'` | Signup source |
| `ip_address` | TEXT | YES | NULL | Signup IP |

**Constraints:**
- `email` UNIQUE

**Indexes:**
- `idx_newsletter_email` on `email`
- `idx_newsletter_active` on `is_active`

---

## B) Storage (Supabase Storage)

### Buckets

| Bucket | Public | Purpose |
|--------|--------|---------|
| `media` | ✅ Yes | Public images (heroes, thumbnails, avatars) |
| `documents` | ❌ No | Private files (PDFs, contracts) |

### File Path Conventions

```
media/
├── site/                    # Site-wide assets
│   ├── logo-light.png
│   ├── logo-dark.png
│   ├── favicon.ico
│   └── og-image.jpg
├── heroes/                  # Hero backgrounds
│   └── {hero_id}/
│       └── background.jpg
├── projects/                # Project images
│   └── {project_id}/
│       ├── thumbnail.jpg
│       ├── featured.jpg
│       └── gallery/
│           └── *.jpg
├── blog/                    # Blog images
│   └── {post_id}/
│       └── featured.jpg
├── team/                    # Team photos
│   └── {member_id}/
│       └── avatar.jpg
├── testimonials/            # Client avatars
│   └── {testimonial_id}/
│       └── avatar.jpg
├── services/                # Service images
│   └── {service_id}/
│       └── image.jpg
└── awards/                  # Award badges
    └── {award_id}/
        └── badge.png

documents/
└── internal/                # Private documents
    └── *.pdf
```

### Upload Policies

| Bucket | Action | Who |
|--------|--------|-----|
| `media` | SELECT | Anyone (public) |
| `media` | INSERT | Authenticated (admin, editor) |
| `media` | UPDATE | Authenticated (admin, editor) |
| `media` | DELETE | Admin only |
| `documents` | SELECT | Authenticated (admin, editor) |
| `documents` | INSERT | Authenticated (admin, editor) |
| `documents` | UPDATE | Authenticated (admin, editor) |
| `documents` | DELETE | Admin only |

### File Constraints

| Constraint | Value |
|------------|-------|
| Max file size (images) | 5 MB |
| Max file size (documents) | 20 MB |
| Allowed image types | `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml` |
| Allowed document types | `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |

---

## C) RLS Policy Model

### Role Mapping

Uses existing RBAC system:
- `admin` → Full CRUD on all content tables
- `editor` → CRUD on content (except delete on some tables)
- `viewer` → Read-only (authenticated)
- `anon` → Public read on published content only

### Policy Templates

#### Public Read (Published Content)

```sql
-- Example: Pages (public can read published only)
CREATE POLICY "Public can read published pages"
ON public.pages
FOR SELECT
TO anon
USING (status = 'published' AND published_at <= now());
```

#### Authenticated Read (All Content)

```sql
-- Example: Pages (authenticated can read all)
CREATE POLICY "Authenticated can read all pages"
ON public.pages
FOR SELECT
TO authenticated
USING (true);
```

#### Editor Write Access

```sql
-- Example: Pages (admin/editor can insert)
CREATE POLICY "Editors can insert pages"
ON public.pages
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'editor')
);

-- Example: Pages (admin/editor can update)
CREATE POLICY "Editors can update pages"
ON public.pages
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'editor')
);
```

#### Admin-Only Delete

```sql
-- Example: Pages (admin only can delete)
CREATE POLICY "Admins can delete pages"
ON public.pages
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
```

### Policy Matrix by Table

| Table | Anon SELECT | Auth SELECT | Insert | Update | Delete |
|-------|-------------|-------------|--------|--------|--------|
| `site_settings` | Published only | All | Admin | Admin/Editor | Admin |
| `pages` | Published | All | Admin/Editor | Admin/Editor | Admin |
| `hero_sections` | Active only | All | Admin/Editor | Admin/Editor | Admin |
| `services` | Published | All | Admin/Editor | Admin/Editor | Admin |
| `projects` | Published | All | Admin/Editor | Admin/Editor | Admin |
| `blog_posts` | Published | All | Admin/Editor | Admin/Editor | Admin |
| `testimonials` | Active | All | Admin/Editor | Admin/Editor | Admin |
| `team_members` | Active | All | Admin/Editor | Admin/Editor | Admin |
| `awards` | Active | All | Admin/Editor | Admin/Editor | Admin |
| `faqs` | Active | All | Admin/Editor | Admin/Editor | Admin |
| `contact_submissions` | ❌ None | Admin/Editor | Anon (public form) | Admin/Editor | Admin |
| `newsletter_subscribers` | ❌ None | Admin only | Anon (public form) | Admin | Admin |

---

## D) RPCs / Helper Functions

### Required Functions

#### 1. `update_updated_at_column()` (Exists)

Already exists — reuse for all content tables.

#### 2. `publish_content(table_name, record_id)`

Publish a draft item:

```sql
CREATE OR REPLACE FUNCTION public.publish_content(
  _table_name TEXT,
  _record_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  EXECUTE format(
    'UPDATE public.%I SET status = $1, published_at = $2, updated_by = $3 WHERE id = $4',
    _table_name
  ) USING 'published', now(), auth.uid(), _record_id;
  
  RETURN TRUE;
END;
$$;
```

#### 3. `unpublish_content(table_name, record_id)`

Revert to draft:

```sql
CREATE OR REPLACE FUNCTION public.unpublish_content(
  _table_name TEXT,
  _record_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  EXECUTE format(
    'UPDATE public.%I SET status = $1, updated_by = $2 WHERE id = $3',
    _table_name
  ) USING 'draft', auth.uid(), _record_id;
  
  RETURN TRUE;
END;
$$;
```

#### 4. `reorder_items(table_name, item_ids)`

Bulk reorder by sort_order:

```sql
CREATE OR REPLACE FUNCTION public.reorder_items(
  _table_name TEXT,
  _item_ids UUID[]
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _idx INTEGER;
BEGIN
  IF NOT (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  FOR _idx IN 1..array_length(_item_ids, 1) LOOP
    EXECUTE format(
      'UPDATE public.%I SET sort_order = $1 WHERE id = $2',
      _table_name
    ) USING _idx - 1, _item_ids[_idx];
  END LOOP;
  
  RETURN TRUE;
END;
$$;
```

---

## E) Frontend Content Contract Mapping

### Creative Agency Homepage Sections

| Section | Order | Source Table | Query Filter | Image Specs |
|---------|-------|--------------|--------------|-------------|
| Hero | 1 | `hero_sections` | `is_active = true ORDER BY sort_order` | 1920×1080 (16:9) |
| Services Overview | 2 | `services` | `is_featured = true AND status = 'published'` | 400×400 (1:1) |
| About Snippet | 3 | `pages` | `slug = 'about-snippet'` | Optional |
| Portfolio Preview | 4 | `projects` | `is_featured = true AND status = 'published' LIMIT 6` | 800×600 (4:3) |
| Testimonials | 5 | `testimonials` | `is_featured = true AND is_active = true` | 200×200 (1:1) |
| Awards | 6 | `awards` | `is_featured = true AND is_active = true` | Variable |
| Blog Preview | 7 | `blog_posts` | `status = 'published' ORDER BY published_at DESC LIMIT 3` | 1200×600 (2:1) |
| FAQ (inline/link) | 8 | `faqs` | `is_featured = true AND is_active = true LIMIT 5` | None |
| CTA + Newsletter | 9 | `site_settings` | Singleton row | None |

### Rich Text Format

- **Storage:** Plain text (Markdown)
- **Rendering:** Frontend converts Markdown to HTML
- **Fields:** `content`, `bio`, `answer`, `description`

### Image Dimension Reference

| Use Case | Dimensions | Aspect Ratio |
|----------|------------|--------------|
| Hero Background | 1920×1080 | 16:9 |
| Project Thumbnail | 800×600 | 4:3 |
| Blog Featured | 1200×600 | 2:1 |
| Team Avatar | 400×400 | 1:1 |
| Testimonial Avatar | 200×200 | 1:1 |
| Service Icon/Image | 400×400 | 1:1 |
| Award Badge | Variable | 1:1 preferred |

---

## F) Migration Plan

### Migration Order

Execute in this order to respect foreign key dependencies:

1. **Enums & Functions** (if any new ones needed)
2. **Independent Tables:**
   - `site_settings`
   - `pages`
   - `hero_sections`
   - `services`
   - `team_members`
   - `awards`
   - `faqs`
   - `contact_submissions`
   - `newsletter_subscribers`
3. **Dependent Tables:**
   - `projects` (no FK dependencies)
   - `testimonials` (FK to projects)
   - `blog_posts` (FK to team_members)
4. **RLS Policies** (after all tables created)
5. **Triggers** (updated_at triggers)
6. **Storage Buckets** (media, documents)
7. **Storage Policies**

### Seed Data Plan

Minimal seeds to make frontend render:

```sql
-- 1. Site Settings (required singleton)
INSERT INTO public.site_settings (site_name, primary_color) 
VALUES ('Devmart', '#7e67fe');

-- 2. At least one hero section
INSERT INTO public.hero_sections (heading, subheading, is_active)
VALUES ('Welcome to Devmart', 'Building Digital Excellence', true);

-- 3. About snippet page
INSERT INTO public.pages (slug, title, content, status, published_at)
VALUES ('about-snippet', 'About Us', 'Brief about content...', 'published', now());
```

### Rollback Notes

If migration fails or needs reverting:

1. Drop tables in reverse dependency order
2. Drop storage policies first, then buckets
3. Do NOT drop `user_profiles` or `user_roles` (auth tables)
4. Verify auth/RBAC still functions after rollback

---

## Validation Checklist

| Check | Status |
|-------|--------|
| ✅ Table list complete (matches contract) | ✅ Yes |
| ✅ All 12 tables defined | ✅ Yes |
| ✅ Every table has RLS described | ✅ Yes |
| ✅ Public vs authenticated boundaries clear | ✅ Yes |
| ✅ Storage buckets defined | ✅ Yes |
| ✅ Storage policies documented | ✅ Yes |
| ✅ File path conventions specified | ✅ Yes |
| ✅ No contradictions with Content Contract v2.0 | ✅ Yes |
| ✅ Frontend mapping complete | ✅ Yes |
| ✅ Migration order specified | ✅ Yes |
| ✅ Rollback plan documented | ✅ Yes |
| ⚠️ No SQL executed in this step | ✅ Confirmed |

---

## Confirmation

> ✅ **Schema NOT executed; documentation only.**

This document is ready for review. Upon approval, migrations will be created and executed in the next phase.

---

*Created: 2025-12-14*  
*Last Updated: 2025-12-14*
