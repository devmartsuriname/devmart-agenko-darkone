-- ============================================================================
-- Storage Buckets and Policies Migration
-- ============================================================================

-- 1. Media bucket (PUBLIC - images, logos, thumbnails)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  5242880,
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
  20971520,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

-- ============================================================================
-- MEDIA BUCKET POLICIES (Public Read)
-- ============================================================================
CREATE POLICY "Public can view media files"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated can view media files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media');

CREATE POLICY "Editors can upload media files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'media' AND
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

CREATE POLICY "Editors can update media files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'media' AND
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

CREATE POLICY "Admin can delete media files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- DOCUMENTS BUCKET POLICIES (Private)
-- ============================================================================
CREATE POLICY "Admin and editor can view documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents' AND
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

CREATE POLICY "Editors can upload documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

CREATE POLICY "Editors can update documents"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'documents' AND
    (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  );

CREATE POLICY "Admin can delete documents"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin'));