-- =============================================================================
-- SEED: Core Content (Team Members, Services, Pages)
-- Phase: F4.1
-- Date: 2025-12-15
-- =============================================================================

-- Team Members (6 active)
INSERT INTO public.team_members (slug, name, role, bio, avatar_url, email, social_linkedin, social_twitter, social_github, is_active, is_featured, sort_order)
VALUES 
  ('james-wilson', 'James Wilson', 'CEO & Founder', 'Visionary leader with 15+ years in digital innovation.', '/images/studio-agency/team_1.jpeg', 'james@devmart.com', 'https://linkedin.com/in/jameswilson', 'https://twitter.com/jameswilson', NULL, true, true, 1),
  ('sarah-chen', 'Sarah Chen', 'Creative Director', 'Award-winning designer with a passion for creating memorable brand experiences.', '/images/studio-agency/team_2.jpeg', 'sarah@devmart.com', 'https://linkedin.com/in/sarahchen', NULL, NULL, true, true, 2),
  ('michael-brooks', 'Michael Brooks', 'Technical Lead', 'Full-stack architect with expertise in scalable systems.', '/images/studio-agency/team_3.jpeg', 'michael@devmart.com', 'https://linkedin.com/in/michaelbrooks', NULL, 'https://github.com/mbrooks', true, true, 3),
  ('emily-rodriguez', 'Emily Rodriguez', 'Marketing Director', 'Strategic marketer with a data-driven approach.', '/images/studio-agency/team_4.jpeg', 'emily@devmart.com', 'https://linkedin.com/in/emilyrodriguez', 'https://twitter.com/emilyrod', NULL, true, false, 4),
  ('david-kim', 'David Kim', 'UX/UI Designer', 'Human-centered designer focused on creating intuitive digital experiences.', '/images/studio-agency/team_1.jpeg', 'david@devmart.com', 'https://linkedin.com/in/davidkim', NULL, NULL, true, false, 5),
  ('amanda-foster', 'Amanda Foster', 'Project Manager', 'Certified PMP with expertise in agile methodologies.', '/images/studio-agency/team_2.jpeg', 'amanda@devmart.com', 'https://linkedin.com/in/amandafoster', NULL, NULL, true, false, 6)
ON CONFLICT (slug) DO NOTHING;

-- Services (6 published)
INSERT INTO public.services (slug, title, short_description, content, icon, status, is_featured, sort_order, image_url, meta_title, meta_description)
VALUES 
  ('web-development', 'Web Development', 'Custom web applications built with modern technologies for optimal performance and scalability.', 
   'We build custom web applications using cutting-edge technologies like React, Next.js, and Node.js.',
   'mdi:web', 'published', true, 1, '/images/creative-agency/service_1.jpeg', 'Web Development Services | Devmart', 'Custom web applications built with React, Next.js.'),
  ('ui-ux-design', 'UI/UX Design', 'User-centered design that creates intuitive and engaging digital experiences.',
   'Great design is invisible—it just works. Our design team creates experiences that delight users.',
   'mdi:palette-outline', 'published', true, 2, '/images/creative-agency/service_2.jpeg', 'UI/UX Design Services | Devmart', 'User-centered design for digital experiences.'),
  ('digital-marketing', 'Digital Marketing', 'Strategic marketing campaigns that increase visibility, engagement, and conversions.',
   'Reach your audience where they are with data-driven marketing strategies.',
   'mdi:bullhorn-outline', 'published', true, 3, '/images/creative-agency/service_3.jpeg', 'Digital Marketing Services | Devmart', 'Strategic marketing campaigns.'),
  ('brand-strategy', 'Brand Strategy', 'Comprehensive branding that defines your identity and sets you apart from competitors.',
   'Your brand is more than a logo—its how people feel about your business.',
   'mdi:lightbulb-outline', 'published', false, 4, '/images/creative-agency/service_1.jpeg', 'Brand Strategy Services | Devmart', 'Comprehensive branding solutions.'),
  ('mobile-development', 'Mobile Development', 'Native and cross-platform mobile apps that deliver exceptional user experiences.',
   'Bring your app idea to life with native iOS, Android, or cross-platform solutions.',
   'mdi:cellphone', 'published', false, 5, '/images/creative-agency/service_2.jpeg', 'Mobile Development Services | Devmart', 'Native and cross-platform mobile apps.'),
  ('consulting', 'Digital Consulting', 'Expert guidance to help you navigate digital transformation.',
   'Make informed decisions about your digital future with our expert consultants.',
   'mdi:account-tie', 'published', false, 6, '/images/creative-agency/service_3.jpeg', 'Digital Consulting Services | Devmart', 'Expert digital consulting.')
ON CONFLICT (slug) DO NOTHING;

-- Pages (2 published)
INSERT INTO public.pages (slug, title, content, status, sort_order, meta_title, meta_description)
VALUES 
  ('about', 'About Us', 
   '## About Devmart\n\nWe are a creative digital agency passionate about helping businesses thrive in the digital age.',
   'published', 1, 'About Us | Devmart', 'Learn about Devmart, our mission and values.'),
  ('privacy-policy', 'Privacy Policy',
   '## Privacy Policy\n\nAt Devmart, we take your privacy seriously.',
   'published', 2, 'Privacy Policy | Devmart', 'Devmart privacy policy.')
ON CONFLICT (slug) DO NOTHING;