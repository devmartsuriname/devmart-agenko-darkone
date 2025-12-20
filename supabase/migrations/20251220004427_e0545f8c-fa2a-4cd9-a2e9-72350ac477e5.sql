-- ============================================================================
-- Phase A12.12a — Home WhyChoose Section Table
-- Homepage-only section with JSONB features array
-- ============================================================================

-- Create table for home WhyChoose section
CREATE TABLE public.home_whychoose (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Section metadata
  section_title TEXT NOT NULL,
  section_subtitle TEXT,
  thumbnail_url TEXT,
  
  -- Features as JSONB array: [{ "title": "...", "content": "..." }, ...]
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Display control
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  
  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Add comment explaining the JSONB structure
COMMENT ON COLUMN public.home_whychoose.features IS 'Array of feature objects: [{ "title": "string", "content": "string" }]';

-- Enable RLS
ALTER TABLE public.home_whychoose ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies (same pattern as home_funfacts)
-- ============================================================================

-- Public can read active sections
CREATE POLICY "Public can read active home whychoose" 
ON public.home_whychoose 
FOR SELECT 
TO anon
USING (is_active = true);

-- Authenticated can read all sections (for admin preview)
CREATE POLICY "Authenticated can read all home whychoose" 
ON public.home_whychoose 
FOR SELECT 
TO authenticated
USING (true);

-- Editors can insert
CREATE POLICY "Editors can insert home whychoose" 
ON public.home_whychoose 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Editors can update
CREATE POLICY "Editors can update home whychoose" 
ON public.home_whychoose 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Admin-only delete
CREATE POLICY "Admin can delete home whychoose" 
ON public.home_whychoose 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================================
-- Updated_at trigger
-- ============================================================================
CREATE TRIGGER update_home_whychoose_updated_at
BEFORE UPDATE ON public.home_whychoose
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();