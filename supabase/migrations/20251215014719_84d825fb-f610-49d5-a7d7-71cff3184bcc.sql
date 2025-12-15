-- ============================================================================
-- Content Schema Migration
-- Version: 1.0
-- Date: 2025-12-15
-- Purpose: Create all CMS content tables for Devmart Internal Platform
-- ============================================================================

-- ============================================================================
-- 1. SITE_SETTINGS (Singleton - Global branding)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'Devmart',
  tagline TEXT,
  logo_light_url TEXT,
  logo_dark_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#7e67fe',
  meta_title_default TEXT,
  meta_description_default TEXT,
  social_image_url TEXT,
  social_facebook TEXT,
  social_twitter TEXT,
  social_instagram TEXT,
  social_linkedin TEXT,
  social_github TEXT,
  footer_copyright TEXT,
  newsletter_enabled BOOLEAN NOT NULL DEFAULT true,
  newsletter_heading TEXT DEFAULT 'Stay Updated',
  newsletter_placeholder TEXT DEFAULT 'Enter your email',
  cta_heading TEXT,
  cta_subheading TEXT,
  cta_button_text TEXT,
  cta_button_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.site_settings IS 'Global site settings (singleton row)';

-- ============================================================================
-- 2. PAGES (Static and CMS-driven pages)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  content TEXT,
  featured_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.pages IS 'Static and CMS-driven pages (About, Privacy, Terms, etc.)';

CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON public.pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_published_at ON public.pages(published_at);

-- ============================================================================
-- 3. HERO_SECTIONS (Homepage hero slides)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.hero_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT NOT NULL,
  subheading TEXT,
  cta_text TEXT,
  cta_link TEXT,
  background_image_url TEXT,
  background_video_url TEXT,
  overlay_opacity INTEGER NOT NULL DEFAULT 50 CHECK (overlay_opacity >= 0 AND overlay_opacity <= 100),
  text_alignment TEXT NOT NULL DEFAULT 'center' CHECK (text_alignment IN ('left', 'center', 'right')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.hero_sections IS 'Homepage hero slides/sections';

CREATE INDEX IF NOT EXISTS idx_hero_sections_active_order ON public.hero_sections(is_active, sort_order);

-- ============================================================================
-- 4. SERVICES (Service offerings)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_description TEXT,
  content TEXT,
  icon TEXT,
  image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.services IS 'Services offered by Devmart';

CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_services_featured ON public.services(is_featured, status);

-- ============================================================================
-- 5. TEAM_MEMBERS (Team/staff profiles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  email TEXT,
  phone TEXT,
  social_linkedin TEXT,
  social_twitter TEXT,
  social_github TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.team_members IS 'Team/staff profiles';

CREATE INDEX IF NOT EXISTS idx_team_members_slug ON public.team_members(slug);
CREATE INDEX IF NOT EXISTS idx_team_members_featured ON public.team_members(is_featured, is_active);

-- ============================================================================
-- 6. AWARDS (Awards and recognition)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT,
  year INTEGER,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.awards IS 'Awards and recognition (homepage section after testimonials)';

CREATE INDEX IF NOT EXISTS idx_awards_featured ON public.awards(is_featured, is_active, sort_order);

-- ============================================================================
-- 7. FAQS (FAQ entries for standalone /faq page)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.faqs IS 'FAQ entries (standalone /faq page)';

CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_active_order ON public.faqs(is_active, sort_order);

-- ============================================================================
-- 8. CONTACT_SUBMISSIONS (Contact form submissions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  replied_at TIMESTAMPTZ,
  replied_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.contact_submissions IS 'Contact form submissions (frontend → admin)';

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON public.contact_submissions(created_at);

-- ============================================================================
-- 9. NEWSLETTER_SUBSCRIBERS (Newsletter signups)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  source TEXT DEFAULT 'footer',
  ip_address TEXT
);

COMMENT ON TABLE public.newsletter_subscribers IS 'Newsletter signup (footer inline form)';

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON public.newsletter_subscribers(is_active);

-- ============================================================================
-- 10. PROJECTS (Portfolio/project showcase)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_description TEXT,
  content TEXT,
  thumbnail_url TEXT,
  featured_image_url TEXT,
  gallery_urls TEXT[],
  client_name TEXT,
  project_url TEXT,
  technologies TEXT[],
  category TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.projects IS 'Portfolio/project showcase';

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(is_featured, status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);

-- ============================================================================
-- 11. TESTIMONIALS (Client testimonials - FK to projects)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_role TEXT,
  client_company TEXT,
  avatar_url TEXT,
  quote TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.testimonials IS 'Client testimonials';

CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON public.testimonials(is_featured, is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_project ON public.testimonials(project_id);

-- ============================================================================
-- 12. BLOG_POSTS (Blog articles - FK to team_members)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image_url TEXT,
  author_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  category TEXT,
  tags TEXT[],
  meta_title TEXT,
  meta_description TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.blog_posts IS 'Blog articles';

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts(author_id);

-- ============================================================================
-- TRIGGERS: updated_at auto-update (reuses existing function)
-- ============================================================================
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hero_sections_updated_at
  BEFORE UPDATE ON public.hero_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_awards_updated_at
  BEFORE UPDATE ON public.awards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();