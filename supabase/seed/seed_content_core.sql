-- =============================================================================
-- SEED: Core Content (Team Members, Services, Pages)
-- Phase: F4.1
-- Date: 2025-12-15
-- IDEMPOTENT: Uses INSERT ... ON CONFLICT DO NOTHING with deterministic slugs
-- =============================================================================

-- -----------------------------------------------------------------------------
-- TEAM MEMBERS (6 active)
-- -----------------------------------------------------------------------------
INSERT INTO public.team_members (slug, name, role, bio, avatar_url, email, social_linkedin, social_twitter, social_github, is_active, is_featured, sort_order)
VALUES 
  ('james-wilson', 'James Wilson', 'CEO & Founder', 'Visionary leader with 15+ years in digital innovation. James founded Devmart with a mission to transform how businesses connect with their audiences.', '/images/studio-agency/team_1.jpeg', 'james@devmart.com', 'https://linkedin.com/in/jameswilson', 'https://twitter.com/jameswilson', NULL, true, true, 1),
  ('sarah-chen', 'Sarah Chen', 'Creative Director', 'Award-winning designer with a passion for creating memorable brand experiences. Sarah leads our creative team with innovation and precision.', '/images/studio-agency/team_2.jpeg', 'sarah@devmart.com', 'https://linkedin.com/in/sarahchen', NULL, NULL, true, true, 2),
  ('michael-brooks', 'Michael Brooks', 'Technical Lead', 'Full-stack architect with expertise in scalable systems. Michael ensures our technical solutions are robust and future-proof.', '/images/studio-agency/team_3.jpeg', 'michael@devmart.com', 'https://linkedin.com/in/michaelbrooks', NULL, 'https://github.com/mbrooks', true, true, 3),
  ('emily-rodriguez', 'Emily Rodriguez', 'Marketing Director', 'Strategic marketer with a data-driven approach. Emily crafts campaigns that deliver measurable results and lasting impact.', '/images/studio-agency/team_4.jpeg', 'emily@devmart.com', 'https://linkedin.com/in/emilyrodriguez', 'https://twitter.com/emilyrod', NULL, true, false, 4),
  ('david-kim', 'David Kim', 'UX/UI Designer', 'Human-centered designer focused on creating intuitive digital experiences. David bridges the gap between user needs and business goals.', '/images/studio-agency/team_1.jpeg', 'david@devmart.com', 'https://linkedin.com/in/davidkim', NULL, NULL, true, false, 5),
  ('amanda-foster', 'Amanda Foster', 'Project Manager', 'Certified PMP with expertise in agile methodologies. Amanda keeps our projects on track and our clients informed every step of the way.', '/images/studio-agency/team_2.jpeg', 'amanda@devmart.com', 'https://linkedin.com/in/amandafoster', NULL, NULL, true, false, 6)
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- SERVICES (6 published)
-- -----------------------------------------------------------------------------
INSERT INTO public.services (slug, title, short_description, content, icon, status, is_featured, sort_order, image_url, meta_title, meta_description)
VALUES 
  ('web-development', 'Web Development', 'Custom web applications built with modern technologies for optimal performance and scalability.', 
   '## Web Development Services\n\nWe build custom web applications using cutting-edge technologies like React, Next.js, and Node.js. Our development process focuses on:\n\n- **Performance**: Optimized code for fast load times\n- **Scalability**: Architecture that grows with your business\n- **Security**: Best practices to protect your data\n- **Maintainability**: Clean code that''s easy to update\n\nFrom simple landing pages to complex enterprise applications, we deliver solutions that exceed expectations.',
   'mdi:web', 'published', true, 1, '/images/creative-agency/service_1.jpeg', 'Web Development Services | Devmart', 'Custom web applications built with React, Next.js, and modern technologies.'),
  
  ('ui-ux-design', 'UI/UX Design', 'User-centered design that creates intuitive and engaging digital experiences for your audience.',
   '## UI/UX Design Services\n\nGreat design is invisible—it just works. Our design team creates experiences that delight users and drive conversions:\n\n- **User Research**: Understanding your audience''s needs\n- **Wireframing**: Mapping out the user journey\n- **Visual Design**: Creating beautiful, on-brand interfaces\n- **Prototyping**: Testing ideas before development\n\nWe believe design should solve problems, not just look pretty.',
   'mdi:palette-outline', 'published', true, 2, '/images/creative-agency/service_2.jpeg', 'UI/UX Design Services | Devmart', 'User-centered design creating intuitive digital experiences.'),
  
  ('digital-marketing', 'Digital Marketing', 'Strategic marketing campaigns that increase visibility, engagement, and conversions.',
   '## Digital Marketing Services\n\nReach your audience where they are. Our marketing strategies combine creativity with data:\n\n- **SEO**: Improve organic search rankings\n- **Content Marketing**: Engage audiences with valuable content\n- **Social Media**: Build community and brand awareness\n- **PPC Advertising**: Targeted campaigns for immediate results\n\nWe measure everything and optimize continuously for maximum ROI.',
   'mdi:bullhorn-outline', 'published', true, 3, '/images/creative-agency/service_3.jpeg', 'Digital Marketing Services | Devmart', 'Strategic marketing campaigns for visibility and conversions.'),
  
  ('brand-strategy', 'Brand Strategy', 'Comprehensive branding that defines your identity and sets you apart from competitors.',
   '## Brand Strategy Services\n\nYour brand is more than a logo—it''s how people feel about your business. We help you define and express your unique identity:\n\n- **Brand Discovery**: Uncovering what makes you unique\n- **Visual Identity**: Logo, colors, typography, and more\n- **Brand Guidelines**: Ensuring consistency everywhere\n- **Brand Voice**: How you communicate with your audience\n\nA strong brand builds trust and loyalty.',
   'mdi:lightbulb-outline', 'published', false, 4, '/images/creative-agency/service_1.jpeg', 'Brand Strategy Services | Devmart', 'Comprehensive branding that defines your unique identity.'),
  
  ('mobile-development', 'Mobile Development', 'Native and cross-platform mobile apps that deliver exceptional user experiences.',
   '## Mobile Development Services\n\nBring your app idea to life. We build mobile applications that users love:\n\n- **iOS Development**: Native Swift applications\n- **Android Development**: Native Kotlin applications\n- **Cross-Platform**: React Native for cost-effective solutions\n- **App Store Optimization**: Getting discovered by users\n\nFrom concept to launch and beyond, we''re your mobile development partner.',
   'mdi:cellphone', 'published', false, 5, '/images/creative-agency/service_2.jpeg', 'Mobile Development Services | Devmart', 'Native and cross-platform mobile apps for exceptional experiences.'),
  
  ('consulting', 'Digital Consulting', 'Expert guidance to help you navigate digital transformation and maximize technology investments.',
   '## Digital Consulting Services\n\nMake informed decisions about your digital future. Our consultants bring decades of combined experience:\n\n- **Technology Assessment**: Evaluating your current stack\n- **Digital Strategy**: Roadmapping your transformation\n- **Vendor Selection**: Finding the right partners\n- **Process Optimization**: Streamlining workflows\n\nWe help you see the big picture and take the right steps.',
   'mdi:account-tie', 'published', false, 6, '/images/creative-agency/service_3.jpeg', 'Digital Consulting Services | Devmart', 'Expert guidance for digital transformation.')
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- PAGES (2 published: about, privacy)
-- -----------------------------------------------------------------------------
INSERT INTO public.pages (slug, title, content, status, sort_order, meta_title, meta_description)
VALUES 
  ('about', 'About Us', 
   '## About Devmart\n\nWe are a creative digital agency passionate about helping businesses thrive in the digital age. Founded in 2018, Devmart has grown from a small team of dreamers to a full-service agency serving clients worldwide.\n\n### Our Mission\n\nTo empower businesses with innovative digital solutions that drive growth and create lasting connections with their audiences.\n\n### Our Values\n\n- **Innovation**: We stay ahead of trends and embrace new technologies\n- **Quality**: We never compromise on the excellence of our work\n- **Collaboration**: We work closely with clients as true partners\n- **Integrity**: We are honest, transparent, and accountable\n\n### Our Story\n\nDevmart started with a simple belief: great digital experiences can transform businesses. Today, we''ve helped hundreds of companies achieve their goals through thoughtful design, powerful technology, and strategic marketing.',
   'published', 1, 'About Us | Devmart', 'Learn about Devmart, our mission, values, and the team behind our digital agency.'),
  
  ('privacy-policy', 'Privacy Policy',
   '## Privacy Policy\n\n**Last Updated: December 2024**\n\nAt Devmart, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.\n\n### Information We Collect\n\nWe collect information you provide directly, such as:\n- Name and email address when you contact us\n- Information submitted through our contact form\n\n### How We Use Your Information\n\nWe use your information to:\n- Respond to your inquiries\n- Send you updates about our services (with your consent)\n- Improve our website and services\n\n### Data Protection\n\nWe implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.\n\n### Your Rights\n\nYou have the right to:\n- Access your personal data\n- Request correction of inaccurate data\n- Request deletion of your data\n\n### Contact Us\n\nFor privacy-related questions, please contact us at privacy@devmart.com.',
   'published', 2, 'Privacy Policy | Devmart', 'Devmart privacy policy explaining how we collect and protect your data.')
ON CONFLICT (slug) DO NOTHING;
