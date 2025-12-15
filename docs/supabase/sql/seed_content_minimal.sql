-- ============================================================================
-- Minimal Content Seed Data
-- Version: 1.0
-- Date: 2025-12-15
-- Purpose: Seed minimal data to make frontend render
-- ============================================================================
-- IMPORTANT: Run AFTER all migrations are applied
-- This seed is optional and creates just enough data to test the frontend
-- ============================================================================

-- ============================================================================
-- 1. SITE SETTINGS (Required singleton)
-- ============================================================================
INSERT INTO public.site_settings (
  site_name,
  tagline,
  primary_color,
  footer_copyright,
  newsletter_enabled,
  newsletter_heading,
  cta_heading,
  cta_subheading,
  cta_button_text,
  cta_button_link
) VALUES (
  'Devmart',
  'Building Digital Excellence',
  '#7e67fe',
  '© 2025 Devmart. All rights reserved.',
  true,
  'Stay Updated',
  'Ready to Start Your Project?',
  'Let''s build something amazing together.',
  'Get in Touch',
  '/contact'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 2. HERO SECTION (At least one active hero)
-- ============================================================================
INSERT INTO public.hero_sections (
  heading,
  subheading,
  cta_text,
  cta_link,
  is_active,
  sort_order
) VALUES (
  'Welcome to Devmart',
  'We create exceptional digital experiences that drive business growth.',
  'View Our Work',
  '/portfolio',
  true,
  0
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. ABOUT SNIPPET PAGE (Required for homepage)
-- ============================================================================
INSERT INTO public.pages (
  slug,
  title,
  content,
  status,
  published_at,
  sort_order
) VALUES (
  'about-snippet',
  'About Devmart',
  'Devmart is a creative agency specializing in web development, branding, and digital marketing. We help businesses transform their digital presence and achieve their goals through innovative solutions.',
  'published',
  now(),
  0
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 4. SAMPLE SERVICE (Optional - for services section)
-- ============================================================================
INSERT INTO public.services (
  slug,
  title,
  short_description,
  icon,
  is_featured,
  status,
  published_at,
  sort_order
) VALUES (
  'web-development',
  'Web Development',
  'Custom web applications built with modern technologies for performance and scalability.',
  'code',
  true,
  'published',
  now(),
  0
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 5. SAMPLE FAQ (Optional - for FAQ page)
-- ============================================================================
INSERT INTO public.faqs (
  question,
  answer,
  category,
  is_featured,
  is_active,
  sort_order
) VALUES (
  'What services does Devmart offer?',
  'We offer a comprehensive range of digital services including web development, mobile app development, UI/UX design, branding, and digital marketing.',
  'Services',
  true,
  true,
  0
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
-- Note: Additional seed data can be added as needed.
-- For production, content should be created through the Admin CMS.
-- ============================================================================
