-- ============================================================================
-- Minimal Content Seed Data
-- ============================================================================

-- 1. SITE SETTINGS (Required singleton)
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
);

-- 2. HERO SECTION (At least one active hero)
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
);

-- 3. ABOUT SNIPPET PAGE (Required for homepage)
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
);