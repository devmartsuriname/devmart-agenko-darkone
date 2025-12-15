-- =============================================================================
-- SEED: Homepage Content (Projects, Testimonials, Awards, Blog, FAQs)
-- Phase: F4.1
-- Date: 2025-12-15
-- =============================================================================

-- Update site_settings with complete branding
UPDATE public.site_settings 
SET 
  site_name = 'Devmart',
  tagline = 'Creative Digital Agency',
  primary_color = '#fd6219',
  logo_light_url = '/images/logo_white.svg',
  logo_dark_url = '/images/logo.svg',
  favicon_url = '/favicon.ico',
  meta_title_default = 'Devmart | Creative Digital Agency',
  meta_description_default = 'Devmart is a creative digital agency specializing in web development, UI/UX design, digital marketing, and brand strategy.',
  footer_copyright = '© 2024 Devmart. All rights reserved.',
  newsletter_enabled = true,
  newsletter_heading = 'Stay Updated',
  newsletter_placeholder = 'Enter your email',
  cta_heading = 'Ready to transform your digital presence?',
  cta_subheading = 'Lets discuss your project and create something amazing together.',
  cta_button_text = 'Get Started',
  cta_button_link = '/contact',
  social_facebook = 'https://facebook.com/devmart',
  social_twitter = 'https://twitter.com/devmart',
  social_instagram = 'https://instagram.com/devmart',
  social_linkedin = 'https://linkedin.com/company/devmart',
  social_github = 'https://github.com/devmart'
WHERE id = (SELECT id FROM public.site_settings LIMIT 1);

-- Projects (6 published)
INSERT INTO public.projects (slug, title, short_description, category, client_name, thumbnail_url, featured_image_url, technologies, status, is_featured, sort_order)
VALUES 
  ('brand-refresh-techcorp', 'TechCorp Brand Refresh', 'Complete brand overhaul including new visual identity and website redesign.', 'Branding', 'TechCorp Inc.', '/images/creative-agency/portfolio_1.jpeg', '/images/creative-agency/portfolio_1.jpeg', ARRAY['Figma', 'Illustrator', 'Webflow'], 'published', true, 1),
  ('ecommerce-platform-freshmart', 'FreshMart E-Commerce', 'Full-stack e-commerce platform with inventory management.', 'Development', 'FreshMart', '/images/creative-agency/portfolio_2.jpeg', '/images/creative-agency/portfolio_2.jpeg', ARRAY['React', 'Node.js', 'PostgreSQL'], 'published', true, 2),
  ('mobile-app-fittrack', 'FitTrack Mobile App', 'Cross-platform fitness tracking app with AI recommendations.', 'Mobile', 'FitTrack', '/images/creative-agency/portfolio_3.jpeg', '/images/creative-agency/portfolio_3.jpeg', ARRAY['React Native', 'Python', 'Firebase'], 'published', true, 3),
  ('marketing-campaign-greenenergy', 'GreenEnergy Launch', 'Integrated digital marketing campaign for startup launch.', 'Marketing', 'GreenEnergy', '/images/creative-agency/portfolio_4.jpeg', '/images/creative-agency/portfolio_4.jpeg', ARRAY['HubSpot', 'Google Ads', 'SEMrush'], 'published', false, 4),
  ('web-app-edulearn', 'EduLearn Platform', 'Learning management system with live classes and certification.', 'Development', 'EduLearn', '/images/creative-agency/portfolio_5.jpeg', '/images/creative-agency/portfolio_5.jpeg', ARRAY['Next.js', 'Supabase', 'AWS'], 'published', false, 5),
  ('ux-redesign-financeplus', 'FinancePlus UX Redesign', 'Complete UX overhaul of banking app.', 'Design', 'FinancePlus', '/images/creative-agency/portfolio_6.jpeg', '/images/creative-agency/portfolio_6.jpeg', ARRAY['Figma', 'React Native'], 'published', false, 6)
ON CONFLICT (slug) DO NOTHING;

-- Testimonials (6 active)
INSERT INTO public.testimonials (client_name, client_role, client_company, quote, avatar_url, rating, is_active, is_featured, sort_order)
VALUES 
  ('Jennifer Martinez', 'CEO', 'TechCorp Inc.', 'Devmart transformed our brand identity completely. Their strategic approach and creative execution exceeded our expectations.', '/images/avatar_1.png', 5, true, true, 1),
  ('Robert Chen', 'Founder', 'FreshMart', 'The e-commerce platform Devmart built has revolutionized our business. Sales increased dramatically.', '/images/avatar_2.png', 5, true, true, 2),
  ('Amanda Foster', 'Marketing Director', 'GreenEnergy', 'The launch campaign was nothing short of amazing. We went from unknown to featured in major publications.', '/images/avatar_3.png', 5, true, true, 3),
  ('David Kim', 'CTO', 'EduLearn', 'Working with Devmart was a pleasure. They delivered a robust LMS that scales beautifully.', '/images/avatar_4.png', 5, true, false, 4),
  ('Sarah Williams', 'Product Manager', 'FinancePlus', 'The UX redesign significantly improved our customer satisfaction scores.', '/images/avatar_1.png', 5, true, false, 5),
  ('Michael Torres', 'CEO', 'FitTrack', 'Devmart delivered our app on time and on budget. The AI features are a major differentiator.', '/images/avatar_2.png', 5, true, false, 6)
ON CONFLICT DO NOTHING;

-- Awards (6 active)
INSERT INTO public.awards (title, issuer, year, description, image_url, is_active, is_featured, sort_order)
VALUES 
  ('Best Digital Agency', 'Digital Excellence Awards', 2024, 'Recognized as the top digital agency for innovative client solutions.', '/images/icons/award.svg', true, true, 1),
  ('UX Design Award', 'Design Weekly', 2024, 'Winner for outstanding user experience design in financial services.', '/images/icons/award.svg', true, true, 2),
  ('Top 100 Agencies', 'Agency Rankings', 2024, 'Named among the top 100 digital agencies worldwide.', '/images/icons/award.svg', true, true, 3),
  ('E-Commerce Excellence', 'Retail Tech Awards', 2023, 'Best e-commerce platform development.', '/images/icons/award.svg', true, false, 4),
  ('Innovation in EdTech', 'EdTech Digest', 2023, 'Recognized for innovative learning platform development.', '/images/icons/award.svg', true, false, 5),
  ('Best Startup Partner', 'Startup Weekly', 2023, 'Voted best agency partner for startups.', '/images/icons/award.svg', true, false, 6)
ON CONFLICT DO NOTHING;

-- FAQs (10 active)
INSERT INTO public.faqs (question, answer, category, is_active, is_featured, sort_order)
VALUES 
  ('What services does Devmart offer?', 'We offer comprehensive digital services including web development, UI/UX design, digital marketing, brand strategy, mobile app development, and digital consulting.', 'Services', true, true, 1),
  ('How long does a typical project take?', 'Project timelines vary based on scope. A simple website might take 4-6 weeks, while a complex application could take 3-6 months.', 'Process', true, true, 2),
  ('What is your pricing structure?', 'We offer both project-based and retainer pricing models. Contact us for a custom quote based on your requirements.', 'Pricing', true, true, 3),
  ('Do you work with startups?', 'Absolutely! We love working with startups and have special packages designed for early-stage companies.', 'General', true, false, 4),
  ('What technologies do you specialize in?', 'Our tech stack includes React, Next.js, Node.js, Python, React Native, PostgreSQL, and cloud platforms like AWS and Supabase.', 'Technical', true, false, 5),
  ('How do you handle project communication?', 'We use project management tools, regular video calls, and Slack for day-to-day communication with a dedicated project manager.', 'Process', true, false, 6),
  ('Do you provide ongoing support after launch?', 'Yes, we offer various support and maintenance packages including bug fixes, security updates, and feature enhancements.', 'Support', true, false, 7),
  ('Can you help with SEO and content strategy?', 'Yes, SEO and content strategy are core parts of our digital marketing services.', 'Services', true, false, 8),
  ('What makes Devmart different from other agencies?', 'We combine strategic thinking with hands-on execution across design, development, and marketing for integrated solutions.', 'General', true, false, 9),
  ('How do I get started with Devmart?', 'Simply reach out through our contact form or email us. We will schedule a free consultation to discuss your project.', 'General', true, false, 10)
ON CONFLICT DO NOTHING;