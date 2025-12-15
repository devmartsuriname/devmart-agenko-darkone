-- ============================================================================
-- Content RLS Policies Migration
-- Enable RLS and create policies for all 12 CMS content tables
-- ============================================================================

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 1. SITE_SETTINGS POLICIES
-- ============================================================================
CREATE POLICY "Public can read site settings"
  ON public.site_settings FOR SELECT TO anon USING (true);

CREATE POLICY "Authenticated can read site settings"
  ON public.site_settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin can insert site settings"
  ON public.site_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin and editor can update site settings"
  ON public.site_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admin can delete site settings"
  ON public.site_settings FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- 2. PAGES POLICIES
-- ============================================================================
CREATE POLICY "Public can read published pages"
  ON public.pages FOR SELECT TO anon
  USING (status = 'published' AND published_at <= now());

CREATE POLICY "Authenticated can read all pages"
  ON public.pages FOR SELECT TO authenticated USING (true);

CREATE POLICY "Editors can insert pages"
  ON public.pages FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can update pages"
  ON public.pages FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admin can delete pages"
  ON public.pages FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- 3. HERO_SECTIONS POLICIES
-- ============================================================================
CREATE POLICY "Public can read active hero sections"
  ON public.hero_sections FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Authenticated can read all hero sections"
  ON public.hero_sections FOR SELECT TO authenticated USING (true);

CREATE POLICY "Editors can insert hero sections"
  ON public.hero_sections FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can update hero sections"
  ON public.hero_sections FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admin can delete hero sections"
  ON public.hero_sections FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- 4. SERVICES POLICIES
-- ============================================================================
CREATE POLICY "Public can read published services"
  ON public.services FOR SELECT TO anon USING (status = 'published');

CREATE POLICY "Authenticated can read all services"
  ON public.services FOR SELECT TO authenticated USING (true);

CREATE POLICY "Editors can insert services"
  ON public.services FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can update services"
  ON public.services FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admin can delete services"
  ON public.services FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- 5. TEAM_MEMBERS POLICIES
-- ============================================================================
CREATE POLICY "Public can read active team members"
  ON public.team_members FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Authenticated can read all team members"
  ON public.team_members FOR SELECT TO authenticated USING (true);

CREATE POLICY "Editors can insert team members"
  ON public.team_members FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can update team members"
  ON public.team_members FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admin can delete team members"
  ON public.team_members FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- 6. AWARDS POLICIES
-- ============================================================================
CREATE POLICY "Public can read active awards"
  ON public.awards FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Authenticated can read all awards"
  ON public.awards FOR SELECT TO authenticated USING (true);

CREATE POLICY "Editors can insert awards"
  ON public.awards FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can update awards"
  ON public.awards FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admin can delete awards"
  ON public.awards FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- 7. FAQS POLICIES
-- ============================================================================
CREATE POLICY "Public can read active faqs"
  ON public.faqs FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Authenticated can read all faqs"
  ON public.faqs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Editors can insert faqs"
  ON public.faqs FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can update faqs"
  ON public.faqs FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admin can delete faqs"
  ON public.faqs FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- 8. CONTACT_SUBMISSIONS POLICIES (Private - no anon read)
-- ============================================================================
CREATE POLICY "Admin and editor can read contact submissions"
  ON public.contact_submissions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Public can submit contact form"
  ON public.contact_submissions FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Authenticated can submit contact form"
  ON public.contact_submissions FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Editors can update contact submissions"
  ON public.contact_submissions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admin can delete contact submissions"
  ON public.contact_submissions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- 9. NEWSLETTER_SUBSCRIBERS POLICIES (Private - admin only read)
-- ============================================================================
CREATE POLICY "Admin can read newsletter subscribers"
  ON public.newsletter_subscribers FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Authenticated can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin can update newsletter subscribers"
  ON public.newsletter_subscribers FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete newsletter subscribers"
  ON public.newsletter_subscribers FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- 10. PROJECTS POLICIES
-- ============================================================================
CREATE POLICY "Public can read published projects"
  ON public.projects FOR SELECT TO anon USING (status = 'published');

CREATE POLICY "Authenticated can read all projects"
  ON public.projects FOR SELECT TO authenticated USING (true);

CREATE POLICY "Editors can insert projects"
  ON public.projects FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can update projects"
  ON public.projects FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admin can delete projects"
  ON public.projects FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- 11. TESTIMONIALS POLICIES
-- ============================================================================
CREATE POLICY "Public can read active testimonials"
  ON public.testimonials FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Authenticated can read all testimonials"
  ON public.testimonials FOR SELECT TO authenticated USING (true);

CREATE POLICY "Editors can insert testimonials"
  ON public.testimonials FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can update testimonials"
  ON public.testimonials FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admin can delete testimonials"
  ON public.testimonials FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- 12. BLOG_POSTS POLICIES
-- ============================================================================
CREATE POLICY "Public can read published blog posts"
  ON public.blog_posts FOR SELECT TO anon
  USING (status = 'published' AND published_at <= now());

CREATE POLICY "Authenticated can read all blog posts"
  ON public.blog_posts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Editors can insert blog posts"
  ON public.blog_posts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can update blog posts"
  ON public.blog_posts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admin can delete blog posts"
  ON public.blog_posts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));