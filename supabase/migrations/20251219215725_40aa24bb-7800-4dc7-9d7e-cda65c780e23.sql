-- ============================================================================
-- Phase A12.8 — Home About Sections Table
-- Purpose: Admin-managed About sections for the Home page
-- ============================================================================

-- Create the home_about_sections table
CREATE TABLE public.home_about_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  eyebrow TEXT,
  heading TEXT NOT NULL,
  body TEXT,
  bullets JSONB DEFAULT '[]'::jsonb,
  cta_text TEXT,
  cta_link TEXT,
  image_url TEXT
);

-- Create index for sorting/filtering
CREATE INDEX idx_home_about_sections_sort ON public.home_about_sections(sort_order, updated_at DESC);
CREATE INDEX idx_home_about_sections_active ON public.home_about_sections(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.home_about_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies (standard content pattern)

-- Public can read active sections only
CREATE POLICY "Public can read active home about sections"
ON public.home_about_sections
FOR SELECT
USING (is_active = true);

-- Authenticated users can read all sections (for admin list)
CREATE POLICY "Authenticated can read all home about sections"
ON public.home_about_sections
FOR SELECT
TO authenticated
USING (true);

-- Editors and admins can insert
CREATE POLICY "Editors can insert home about sections"
ON public.home_about_sections
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'editor'::app_role)
);

-- Editors and admins can update
CREATE POLICY "Editors can update home about sections"
ON public.home_about_sections
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'editor'::app_role)
);

-- Only admins can delete
CREATE POLICY "Admin can delete home about sections"
ON public.home_about_sections
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_home_about_sections_updated_at
  BEFORE UPDATE ON public.home_about_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed data matching current Zivan Home About content
INSERT INTO public.home_about_sections (
  is_active,
  sort_order,
  eyebrow,
  heading,
  body,
  bullets,
  cta_text,
  cta_link,
  image_url
) VALUES (
  true,
  0,
  'Who We Are',
  'Full-stack creatives and designing agency',
  'Our team, specializing in strategic digital marketing, partners with the world''s leading brands. Breaking from the norm, we push boundaries and merge imaginative thinking, consumer behavior, and data-driven design with advanced technology to deliver unparalleled brand experiences.',
  '["Designing content with AI power", "Trending marketing tools involve", "Powerful market strategy use"]'::jsonb,
  'Learn More',
  '/about',
  '/images/creative-agency/about_1.jpeg'
);