-- Footer About Section
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS footer_about_title TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS footer_about_description TEXT;

-- Contact Info (shared with Contact Page)
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_address_line1 TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_address_line2 TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_city TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_country TEXT;

-- Map
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_map_embed_url TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS contact_map_link_url TEXT;