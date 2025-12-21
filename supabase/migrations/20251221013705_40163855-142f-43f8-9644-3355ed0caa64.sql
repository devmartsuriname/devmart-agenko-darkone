-- Phase A15: Add footer_links column for simple footer links configuration
-- Allows admin to select/reorder existing page links in footer

ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS footer_links JSONB DEFAULT NULL;

COMMENT ON COLUMN public.site_settings.footer_links IS 
  'JSON array of footer link items: [{key, label, href}]. NULL uses default static list.';