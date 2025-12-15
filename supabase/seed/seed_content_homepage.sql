-- =============================================================================
-- SEED: Homepage Content (Projects, Testimonials, Awards, Blog, FAQs)
-- Phase: F4.1
-- Date: 2025-12-15
-- IDEMPOTENT: Uses INSERT ... ON CONFLICT DO NOTHING with deterministic slugs
-- =============================================================================

-- -----------------------------------------------------------------------------
-- SITE SETTINGS UPDATE (ensure branding is complete)
-- -----------------------------------------------------------------------------
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
  cta_subheading = 'Let''s discuss your project and create something amazing together.',
  cta_button_text = 'Get Started',
  cta_button_link = '/contact',
  social_facebook = 'https://facebook.com/devmart',
  social_twitter = 'https://twitter.com/devmart',
  social_instagram = 'https://instagram.com/devmart',
  social_linkedin = 'https://linkedin.com/company/devmart',
  social_github = 'https://github.com/devmart'
WHERE id = (SELECT id FROM public.site_settings LIMIT 1);

-- -----------------------------------------------------------------------------
-- PROJECTS (6 published)
-- -----------------------------------------------------------------------------
INSERT INTO public.projects (slug, title, short_description, content, category, client_name, project_url, thumbnail_url, featured_image_url, technologies, status, is_featured, sort_order, meta_title, meta_description)
VALUES 
  ('brand-refresh-techcorp', 'TechCorp Brand Refresh', 'Complete brand overhaul including new visual identity, website redesign, and marketing collateral.',
   '## Project Overview\n\nTechCorp, a B2B SaaS company, needed a fresh brand identity to match their evolution from startup to industry leader.\n\n### The Challenge\n\nTheir existing brand felt dated and didn''t reflect their innovative technology solutions.\n\n### Our Solution\n\n- New logo and visual identity system\n- Complete website redesign with improved UX\n- Marketing collateral and brand guidelines\n- Social media templates\n\n### Results\n\n- 45% increase in website engagement\n- 30% improvement in lead quality\n- Consistent brand experience across all touchpoints',
   'Branding', 'TechCorp Inc.', 'https://techcorp.example.com', '/images/creative-agency/portfolio_1.jpeg', '/images/creative-agency/portfolio_1.jpeg', ARRAY['Figma', 'Illustrator', 'Webflow'], 'published', true, 1, 'TechCorp Brand Refresh | Devmart Portfolio', 'Complete brand overhaul for TechCorp including visual identity and website redesign.'),
  
  ('ecommerce-platform-freshmart', 'FreshMart E-Commerce', 'Full-stack e-commerce platform with inventory management and delivery tracking.',
   '## Project Overview\n\nFreshMart needed a modern e-commerce platform to compete with major online grocery retailers.\n\n### The Challenge\n\nBuilding a scalable platform that handles real-time inventory and delivery logistics.\n\n### Our Solution\n\n- Custom React-based storefront\n- Node.js backend with PostgreSQL\n- Real-time inventory management\n- Integrated delivery tracking\n- Mobile-responsive design\n\n### Results\n\n- 200% increase in online orders\n- 50% reduction in delivery errors\n- 4.8★ average customer rating',
   'Development', 'FreshMart', 'https://freshmart.example.com', '/images/creative-agency/portfolio_2.jpeg', '/images/creative-agency/portfolio_2.jpeg', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], 'published', true, 2, 'FreshMart E-Commerce Platform | Devmart Portfolio', 'Full-stack e-commerce platform with inventory and delivery tracking.'),
  
  ('mobile-app-fittrack', 'FitTrack Mobile App', 'Cross-platform fitness tracking app with social features and AI-powered workout recommendations.',
   '## Project Overview\n\nFitTrack wanted to enter the competitive fitness app market with a unique, AI-powered approach.\n\n### The Challenge\n\nCreating an engaging app that stands out in a crowded market.\n\n### Our Solution\n\n- React Native cross-platform app\n- AI workout recommendation engine\n- Social features and challenges\n- Wearable device integration\n- Gamification elements\n\n### Results\n\n- 100K+ downloads in first month\n- 4.7★ App Store rating\n- 65% weekly active user retention',
   'Mobile', 'FitTrack', 'https://fittrack.example.com', '/images/creative-agency/portfolio_3.jpeg', '/images/creative-agency/portfolio_3.jpeg', ARRAY['React Native', 'Python', 'TensorFlow', 'Firebase'], 'published', true, 3, 'FitTrack Mobile App | Devmart Portfolio', 'Cross-platform fitness app with AI-powered workout recommendations.'),
  
  ('marketing-campaign-greenenergy', 'GreenEnergy Launch Campaign', 'Integrated digital marketing campaign for renewable energy startup launch.',
   '## Project Overview\n\nGreenEnergy, a renewable energy startup, needed a powerful launch campaign to build awareness and attract investors.\n\n### The Challenge\n\nEstablishing credibility in a competitive market with limited brand recognition.\n\n### Our Solution\n\n- Multi-channel content strategy\n- SEO and content marketing\n- Targeted social media campaigns\n- Influencer partnerships\n- PR and media outreach\n\n### Results\n\n- 500% increase in website traffic\n- Featured in 12 major publications\n- Secured $2M in seed funding',
   'Marketing', 'GreenEnergy', 'https://greenenergy.example.com', '/images/creative-agency/portfolio_4.jpeg', '/images/creative-agency/portfolio_4.jpeg', ARRAY['HubSpot', 'Google Ads', 'Meta Ads', 'SEMrush'], 'published', false, 4, 'GreenEnergy Launch Campaign | Devmart Portfolio', 'Integrated digital marketing campaign for renewable energy startup.'),
  
  ('web-app-edulearn', 'EduLearn Platform', 'Learning management system with live classes, progress tracking, and certification.',
   '## Project Overview\n\nEduLearn needed a comprehensive LMS to deliver online courses to thousands of students.\n\n### The Challenge\n\nBuilding a platform that handles live video, assessments, and certificates at scale.\n\n### Our Solution\n\n- Custom LMS built with Next.js\n- Live video integration with recording\n- Automated assessment grading\n- Progress analytics dashboard\n- Certificate generation system\n\n### Results\n\n- 50K+ registered students\n- 98% course completion rate\n- Reduced admin time by 70%',
   'Development', 'EduLearn', 'https://edulearn.example.com', '/images/creative-agency/portfolio_5.jpeg', '/images/creative-agency/portfolio_5.jpeg', ARRAY['Next.js', 'Supabase', 'Zoom API', 'AWS'], 'published', false, 5, 'EduLearn Platform | Devmart Portfolio', 'Learning management system with live classes and certification.'),
  
  ('ux-redesign-financeplus', 'FinancePlus UX Redesign', 'Complete UX overhaul of banking app improving user satisfaction and task completion.',
   '## Project Overview\n\nFinancePlus, a digital bank, needed to improve their mobile app experience to reduce customer complaints.\n\n### The Challenge\n\nUsers found the existing app confusing and abandoned key tasks before completion.\n\n### Our Solution\n\n- Comprehensive user research and testing\n- Information architecture restructure\n- New visual design system\n- Simplified transaction flows\n- Accessibility improvements\n\n### Results\n\n- 60% reduction in support tickets\n- 40% faster task completion\n- NPS improved from 32 to 67',
   'Design', 'FinancePlus', 'https://financeplus.example.com', '/images/creative-agency/portfolio_6.jpeg', '/images/creative-agency/portfolio_6.jpeg', ARRAY['Figma', 'Maze', 'Hotjar', 'React Native'], 'published', false, 6, 'FinancePlus UX Redesign | Devmart Portfolio', 'Complete UX overhaul of banking app for improved user satisfaction.')
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- TESTIMONIALS (6 active)
-- -----------------------------------------------------------------------------
INSERT INTO public.testimonials (client_name, client_role, client_company, quote, avatar_url, rating, is_active, is_featured, sort_order)
SELECT 'Jennifer Martinez', 'CEO', 'TechCorp Inc.', 'Devmart transformed our brand identity completely. Their strategic approach and creative execution exceeded our expectations. The team was professional, responsive, and truly understood our vision.', '/images/avatar_1.png', 5, true, true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials WHERE client_name = 'Jennifer Martinez' AND client_company = 'TechCorp Inc.');

INSERT INTO public.testimonials (client_name, client_role, client_company, quote, avatar_url, rating, is_active, is_featured, sort_order)
SELECT 'Robert Chen', 'Founder', 'FreshMart', 'The e-commerce platform Devmart built for us has revolutionized our business. Sales have increased dramatically and our customers love the new shopping experience.', '/images/avatar_2.png', 5, true, true, 2
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials WHERE client_name = 'Robert Chen' AND client_company = 'FreshMart');

INSERT INTO public.testimonials (client_name, client_role, client_company, quote, avatar_url, rating, is_active, is_featured, sort_order)
SELECT 'Amanda Foster', 'Marketing Director', 'GreenEnergy', 'The launch campaign Devmart created for us was nothing short of amazing. We went from unknown to featured in major publications within weeks.', '/images/avatar_3.png', 5, true, true, 3
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials WHERE client_name = 'Amanda Foster' AND client_company = 'GreenEnergy');

INSERT INTO public.testimonials (client_name, client_role, client_company, quote, avatar_url, rating, is_active, is_featured, sort_order)
SELECT 'David Kim', 'CTO', 'EduLearn', 'Working with Devmart was a pleasure from start to finish. They delivered a robust LMS that scales beautifully and our students love using it.', '/images/avatar_4.png', 5, true, false, 4
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials WHERE client_name = 'David Kim' AND client_company = 'EduLearn');

INSERT INTO public.testimonials (client_name, client_role, client_company, quote, avatar_url, rating, is_active, is_featured, sort_order)
SELECT 'Sarah Williams', 'Product Manager', 'FinancePlus', 'The UX redesign significantly improved our customer satisfaction scores. Devmart''s research-driven approach made all the difference.', '/images/avatar_1.png', 5, true, false, 5
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials WHERE client_name = 'Sarah Williams' AND client_company = 'FinancePlus');

INSERT INTO public.testimonials (client_name, client_role, client_company, quote, avatar_url, rating, is_active, is_featured, sort_order)
SELECT 'Michael Torres', 'CEO', 'FitTrack', 'Devmart delivered our app on time and on budget. The AI features they implemented have been a major differentiator in the market.', '/images/avatar_2.png', 5, true, false, 6
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials WHERE client_name = 'Michael Torres' AND client_company = 'FitTrack');

-- -----------------------------------------------------------------------------
-- AWARDS (6 active)
-- -----------------------------------------------------------------------------
INSERT INTO public.awards (title, issuer, year, description, image_url, link_url, is_active, is_featured, sort_order)
SELECT 'Best Digital Agency', 'Digital Excellence Awards', 2024, 'Recognized as the top digital agency for innovative client solutions.', '/images/icons/award.svg', 'https://example.com/awards', true, true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.awards WHERE title = 'Best Digital Agency' AND year = 2024);

INSERT INTO public.awards (title, issuer, year, description, image_url, link_url, is_active, is_featured, sort_order)
SELECT 'UX Design Award', 'Design Weekly', 2024, 'Winner for outstanding user experience design in financial services.', '/images/icons/award.svg', 'https://example.com/awards', true, true, 2
WHERE NOT EXISTS (SELECT 1 FROM public.awards WHERE title = 'UX Design Award' AND year = 2024);

INSERT INTO public.awards (title, issuer, year, description, image_url, link_url, is_active, is_featured, sort_order)
SELECT 'Top 100 Agencies', 'Agency Rankings', 2024, 'Named among the top 100 digital agencies worldwide.', '/images/icons/award.svg', 'https://example.com/awards', true, true, 3
WHERE NOT EXISTS (SELECT 1 FROM public.awards WHERE title = 'Top 100 Agencies' AND year = 2024);

INSERT INTO public.awards (title, issuer, year, description, image_url, link_url, is_active, is_featured, sort_order)
SELECT 'E-Commerce Excellence', 'Retail Tech Awards', 2023, 'Best e-commerce platform development for FreshMart project.', '/images/icons/award.svg', 'https://example.com/awards', true, false, 4
WHERE NOT EXISTS (SELECT 1 FROM public.awards WHERE title = 'E-Commerce Excellence' AND year = 2023);

INSERT INTO public.awards (title, issuer, year, description, image_url, link_url, is_active, is_featured, sort_order)
SELECT 'Innovation in EdTech', 'EdTech Digest', 2023, 'Recognized for innovative learning platform development.', '/images/icons/award.svg', 'https://example.com/awards', true, false, 5
WHERE NOT EXISTS (SELECT 1 FROM public.awards WHERE title = 'Innovation in EdTech' AND year = 2023);

INSERT INTO public.awards (title, issuer, year, description, image_url, link_url, is_active, is_featured, sort_order)
SELECT 'Best Startup Partner', 'Startup Weekly', 2023, 'Voted best agency partner for startups and emerging companies.', '/images/icons/award.svg', 'https://example.com/awards', true, false, 6
WHERE NOT EXISTS (SELECT 1 FROM public.awards WHERE title = 'Best Startup Partner' AND year = 2023);

-- -----------------------------------------------------------------------------
-- BLOG POSTS (6 published) - author_id linked to team_members
-- -----------------------------------------------------------------------------
INSERT INTO public.blog_posts (slug, title, excerpt, content, category, featured_image_url, status, is_featured, tags, published_at, author_id, meta_title, meta_description)
SELECT 
  'future-of-web-development-2024',
  'The Future of Web Development in 2024',
  'Explore the latest trends shaping web development, from AI-powered tools to edge computing and beyond.',
  '## The Future of Web Development in 2024\n\nThe web development landscape is evolving rapidly. Here are the key trends shaping our industry:\n\n### AI-Powered Development\n\nAI tools are revolutionizing how we write code, from GitHub Copilot to AI-powered testing frameworks.\n\n### Edge Computing\n\nBringing computation closer to users for faster, more reliable experiences.\n\n### WebAssembly\n\nEnabling near-native performance for web applications.\n\n### Conclusion\n\nStaying ahead means embracing these technologies while focusing on fundamentals.',
  'Technology',
  '/images/creative-agency/blog_1.jpeg',
  'published',
  true,
  ARRAY['Web Development', 'AI', 'Trends'],
  NOW() - INTERVAL '2 days',
  (SELECT id FROM public.team_members WHERE slug = 'michael-brooks' LIMIT 1),
  'Future of Web Development 2024 | Devmart Blog',
  'Explore the latest trends shaping web development in 2024.'
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'future-of-web-development-2024');

INSERT INTO public.blog_posts (slug, title, excerpt, content, category, featured_image_url, status, is_featured, tags, published_at, author_id, meta_title, meta_description)
SELECT 
  'building-brand-that-stands-out',
  'Building a Brand That Stands Out',
  'Learn the essential elements of creating a memorable brand identity that resonates with your audience.',
  '## Building a Brand That Stands Out\n\nIn a crowded marketplace, your brand is your most valuable asset.\n\n### Start With Why\n\nYour brand purpose should drive every decision. Why does your company exist beyond making money?\n\n### Visual Identity Matters\n\nConsistency in colors, typography, and imagery builds recognition over time.\n\n### Voice and Tone\n\nHow you communicate is as important as what you say.\n\n### Conclusion\n\nA strong brand takes time to build but pays dividends for years to come.',
  'Branding',
  '/images/creative-agency/blog_2.jpeg',
  'published',
  true,
  ARRAY['Branding', 'Design', 'Strategy'],
  NOW() - INTERVAL '5 days',
  (SELECT id FROM public.team_members WHERE slug = 'sarah-chen' LIMIT 1),
  'Building a Brand That Stands Out | Devmart Blog',
  'Essential elements of creating a memorable brand identity.'
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'building-brand-that-stands-out');

INSERT INTO public.blog_posts (slug, title, excerpt, content, category, featured_image_url, status, is_featured, tags, published_at, author_id, meta_title, meta_description)
SELECT 
  'maximizing-roi-digital-marketing',
  'Maximizing ROI in Digital Marketing',
  'Data-driven strategies to optimize your marketing spend and achieve better results.',
  '## Maximizing ROI in Digital Marketing\n\nEvery marketing dollar should work hard for your business.\n\n### Track Everything\n\nYou can''t improve what you don''t measure. Set up proper analytics from day one.\n\n### Test and Iterate\n\nA/B testing isn''t optional—it''s essential for optimization.\n\n### Focus on Quality\n\nBetter to reach 100 qualified leads than 10,000 uninterested visitors.\n\n### Conclusion\n\nSmart marketing is about working smarter, not just spending more.',
  'Marketing',
  '/images/creative-agency/blog_3.jpeg',
  'published',
  false,
  ARRAY['Marketing', 'ROI', 'Analytics'],
  NOW() - INTERVAL '7 days',
  (SELECT id FROM public.team_members WHERE slug = 'emily-rodriguez' LIMIT 1),
  'Maximizing ROI in Digital Marketing | Devmart Blog',
  'Data-driven strategies to optimize your marketing spend.'
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'maximizing-roi-digital-marketing');

INSERT INTO public.blog_posts (slug, title, excerpt, content, category, featured_image_url, status, is_featured, tags, published_at, author_id, meta_title, meta_description)
SELECT 
  'ux-principles-every-designer-needs',
  'UX Principles Every Designer Needs to Know',
  'Core user experience principles that separate good designs from great ones.',
  '## UX Principles Every Designer Needs to Know\n\nGreat UX is invisible—users just know it works.\n\n### Clarity Over Cleverness\n\nNever sacrifice usability for aesthetics or innovation.\n\n### Consistency Is Key\n\nPatterns should be predictable across your entire product.\n\n### Accessibility First\n\nDesign for everyone, including users with disabilities.\n\n### Conclusion\n\nFocus on solving user problems, and beautiful design will follow.',
  'Design',
  '/images/creative-agency/blog_1.jpeg',
  'published',
  false,
  ARRAY['UX', 'Design', 'Accessibility'],
  NOW() - INTERVAL '10 days',
  (SELECT id FROM public.team_members WHERE slug = 'david-kim' LIMIT 1),
  'UX Principles Every Designer Needs | Devmart Blog',
  'Core user experience principles for great design.'
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'ux-principles-every-designer-needs');

INSERT INTO public.blog_posts (slug, title, excerpt, content, category, featured_image_url, status, is_featured, tags, published_at, author_id, meta_title, meta_description)
SELECT 
  'agile-project-management-tips',
  '10 Agile Project Management Tips',
  'Practical advice for running successful agile projects from our project management team.',
  '## 10 Agile Project Management Tips\n\nAgile is a mindset, not just a methodology.\n\n### 1. Start With Clear Goals\n\nEveryone should understand what success looks like.\n\n### 2. Embrace Change\n\nRequirements will evolve—plan for it.\n\n### 3. Daily Standups Matter\n\nKeep them short and focused.\n\n### 4. Retrospectives Are Essential\n\nContinuous improvement requires honest reflection.\n\n### Conclusion\n\nAgile done right leads to happier teams and better outcomes.',
  'Business',
  '/images/creative-agency/blog_2.jpeg',
  'published',
  false,
  ARRAY['Agile', 'Project Management', 'Tips'],
  NOW() - INTERVAL '14 days',
  (SELECT id FROM public.team_members WHERE slug = 'amanda-foster' LIMIT 1),
  'Agile Project Management Tips | Devmart Blog',
  'Practical advice for running successful agile projects.'
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'agile-project-management-tips');

INSERT INTO public.blog_posts (slug, title, excerpt, content, category, featured_image_url, status, is_featured, tags, published_at, author_id, meta_title, meta_description)
SELECT 
  'why-digital-transformation-matters',
  'Why Digital Transformation Matters',
  'Understanding the imperative for businesses to embrace digital transformation.',
  '## Why Digital Transformation Matters\n\nDigital transformation isn''t optional—it''s survival.\n\n### The Changing Landscape\n\nCustomer expectations have shifted permanently toward digital-first experiences.\n\n### Competitive Advantage\n\nCompanies that transform thrive; those that don''t struggle.\n\n### Where to Start\n\nBegin with customer-facing experiences and work backward.\n\n### Conclusion\n\nThe question isn''t whether to transform, but how fast you can move.',
  'Business',
  '/images/creative-agency/blog_3.jpeg',
  'published',
  false,
  ARRAY['Digital Transformation', 'Business', 'Strategy'],
  NOW() - INTERVAL '21 days',
  (SELECT id FROM public.team_members WHERE slug = 'james-wilson' LIMIT 1),
  'Why Digital Transformation Matters | Devmart Blog',
  'Understanding the imperative for digital transformation.'
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'why-digital-transformation-matters');

-- -----------------------------------------------------------------------------
-- FAQS (10 active)
-- -----------------------------------------------------------------------------
INSERT INTO public.faqs (question, answer, category, is_active, is_featured, sort_order)
SELECT 'What services does Devmart offer?', 'We offer comprehensive digital services including web development, UI/UX design, digital marketing, brand strategy, mobile app development, and digital consulting. Each service is tailored to meet your specific business needs.', 'Services', true, true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.faqs WHERE question = 'What services does Devmart offer?');

INSERT INTO public.faqs (question, answer, category, is_active, is_featured, sort_order)
SELECT 'How long does a typical project take?', 'Project timelines vary based on scope and complexity. A simple website might take 4-6 weeks, while a complex web application could take 3-6 months. We provide detailed timelines during our initial consultation.', 'Process', true, true, 2
WHERE NOT EXISTS (SELECT 1 FROM public.faqs WHERE question = 'How long does a typical project take?');

INSERT INTO public.faqs (question, answer, category, is_active, is_featured, sort_order)
SELECT 'What is your pricing structure?', 'We offer both project-based and retainer pricing models. Project pricing is determined after understanding your requirements, while retainers are ideal for ongoing support and maintenance. Contact us for a custom quote.', 'Pricing', true, true, 3
WHERE NOT EXISTS (SELECT 1 FROM public.faqs WHERE question = 'What is your pricing structure?');

INSERT INTO public.faqs (question, answer, category, is_active, is_featured, sort_order)
SELECT 'Do you work with startups?', 'Absolutely! We love working with startups and have special packages designed for early-stage companies. We understand the unique challenges startups face and offer flexible engagement models.', 'General', true, false, 4
WHERE NOT EXISTS (SELECT 1 FROM public.faqs WHERE question = 'Do you work with startups?');

INSERT INTO public.faqs (question, answer, category, is_active, is_featured, sort_order)
SELECT 'What technologies do you specialize in?', 'Our tech stack includes React, Next.js, Node.js, Python, React Native, PostgreSQL, and cloud platforms like AWS and Supabase. We choose the best technology for each project''s requirements.', 'Technical', true, false, 5
WHERE NOT EXISTS (SELECT 1 FROM public.faqs WHERE question = 'What technologies do you specialize in?');

INSERT INTO public.faqs (question, answer, category, is_active, is_featured, sort_order)
SELECT 'How do you handle project communication?', 'We use a combination of project management tools (like Asana or Jira), regular video calls, and Slack for day-to-day communication. You''ll have a dedicated project manager as your main point of contact.', 'Process', true, false, 6
WHERE NOT EXISTS (SELECT 1 FROM public.faqs WHERE question = 'How do you handle project communication?');

INSERT INTO public.faqs (question, answer, category, is_active, is_featured, sort_order)
SELECT 'Do you provide ongoing support after launch?', 'Yes, we offer various support and maintenance packages to keep your digital products running smoothly. This includes bug fixes, security updates, feature enhancements, and performance monitoring.', 'Support', true, false, 7
WHERE NOT EXISTS (SELECT 1 FROM public.faqs WHERE question = 'Do you provide ongoing support after launch?');

INSERT INTO public.faqs (question, answer, category, is_active, is_featured, sort_order)
SELECT 'Can you help with SEO and content strategy?', 'Yes, SEO and content strategy are core parts of our digital marketing services. We can help improve your search rankings, develop content calendars, and create engaging content that drives traffic.', 'Services', true, false, 8
WHERE NOT EXISTS (SELECT 1 FROM public.faqs WHERE question = 'Can you help with SEO and content strategy?');

INSERT INTO public.faqs (question, answer, category, is_active, is_featured, sort_order)
SELECT 'What makes Devmart different from other agencies?', 'We combine strategic thinking with hands-on execution. Our team has deep expertise across design, development, and marketing, allowing us to deliver integrated solutions rather than siloed services.', 'General', true, false, 9
WHERE NOT EXISTS (SELECT 1 FROM public.faqs WHERE question = 'What makes Devmart different from other agencies?');

INSERT INTO public.faqs (question, answer, category, is_active, is_featured, sort_order)
SELECT 'How do I get started with Devmart?', 'Simply reach out through our contact form or email us at hello@devmart.com. We''ll schedule a free consultation to discuss your project, understand your goals, and provide a tailored proposal.', 'General', true, false, 10
WHERE NOT EXISTS (SELECT 1 FROM public.faqs WHERE question = 'How do I get started with Devmart?');
