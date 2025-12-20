-- ============================================================================
-- Phase A12.10: Home FunFacts Table + RLS + Max 4 Constraint
-- ============================================================================

-- Create table for home funfacts (stats section)
CREATE TABLE public.home_funfacts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid NULL,
  updated_by uuid NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  title text NOT NULL,
  number text NOT NULL
);

-- Enable RLS
ALTER TABLE public.home_funfacts ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_home_funfacts_is_active ON public.home_funfacts(is_active);
CREATE INDEX idx_home_funfacts_sort_order ON public.home_funfacts(sort_order);

-- Add updated_at trigger (uses existing function)
CREATE TRIGGER update_home_funfacts_updated_at
  BEFORE UPDATE ON public.home_funfacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- Max 4 Rows Constraint via Trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION public.check_home_funfacts_max_rows()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.home_funfacts) >= 4 THEN
    RAISE EXCEPTION 'Home FunFacts supports a maximum of 4 items.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER enforce_home_funfacts_max_rows
  BEFORE INSERT ON public.home_funfacts
  FOR EACH ROW
  EXECUTE FUNCTION public.check_home_funfacts_max_rows();

-- ============================================================================
-- RLS Policies (Match existing content table pattern)
-- ============================================================================

-- Public: Read only active funfacts
CREATE POLICY "Public can read active funfacts"
  ON public.home_funfacts
  FOR SELECT
  USING (is_active = true);

-- Authenticated: Read all funfacts (for admin list)
CREATE POLICY "Authenticated can read all funfacts"
  ON public.home_funfacts
  FOR SELECT
  TO authenticated
  USING (true);

-- Editors: Can insert funfacts
CREATE POLICY "Editors can insert funfacts"
  ON public.home_funfacts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'editor'::app_role)
  );

-- Editors: Can update funfacts
CREATE POLICY "Editors can update funfacts"
  ON public.home_funfacts
  FOR UPDATE
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'editor'::app_role)
  );

-- Admin only: Can delete funfacts
CREATE POLICY "Admin can delete funfacts"
  ON public.home_funfacts
  FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================================
-- Add comments for documentation
-- ============================================================================
COMMENT ON TABLE public.home_funfacts IS 'Home page FunFacts/Stats section (max 4 items)';
COMMENT ON COLUMN public.home_funfacts.title IS 'Stat label (e.g., "Active Clients")';
COMMENT ON COLUMN public.home_funfacts.number IS 'Display value (e.g., "22k" or "15K+")';
COMMENT ON FUNCTION public.check_home_funfacts_max_rows() IS 'Enforces max 4 funfact items constraint';