-- ============================================================================
-- Storage Buckets and Policies Migration
-- Version: 1.0
-- Date: 2025-12-15
-- Purpose: Create storage buckets and RLS policies for media and documents
-- ============================================================================
-- IMPORTANT: Run AFTER content schema and RLS migrations
-- Uses existing has_role() function from auth setup
-- ============================================================================

-- ============================================================================
-- CREATE STORAGE BUCKETS
-- ============================================================================

-- 1. Media bucket (PUBLIC - images, logos, thumbnails)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];

-- 2. Documents bucket (PRIVATE - PDFs, internal files)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  20971520, -- 20MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

-- ============================================================================
-- MEDIA BUCKET POLICIES (Public Read)
-- ============================================================================

-- Anyone can read/view media files (public bucket)
CREATE POLICY "Public can view media files"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated can view media files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media');

-- Admin/Editor can upload media files
CREATE POLICY "Editors can upload media files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'media' AND
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

-- Admin/Editor can update media files
CREATE POLICY "Editors can update media files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'media' AND
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

-- Only Admin can delete media files
CREATE POLICY "Admin can delete media files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- DOCUMENTS BUCKET POLICIES (Private)
-- ============================================================================

-- Only authenticated admin/editor can read documents
CREATE POLICY "Admin and editor can view documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents' AND
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

-- Admin/Editor can upload documents
CREATE POLICY "Editors can upload documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

-- Admin/Editor can update documents
CREATE POLICY "Editors can update documents"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'documents' AND
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

-- Only Admin can delete documents
CREATE POLICY "Admin can delete documents"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- END OF STORAGE POLICIES
-- ============================================================================
