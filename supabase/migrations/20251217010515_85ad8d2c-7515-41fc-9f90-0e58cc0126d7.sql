-- Phase A11: Update RLS policies for newsletter_subscribers
-- Allow Admin + Editor to SELECT, INSERT, UPDATE (keep DELETE admin-only)

-- Drop existing admin-only policies
DROP POLICY IF EXISTS "Admin can read newsletter subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admin can update newsletter subscribers" ON newsletter_subscribers;

-- Create new policies allowing Admin + Editor
CREATE POLICY "Admin and Editor can read newsletter subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Admin and Editor can insert newsletter subscribers"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Admin and Editor can update newsletter subscribers"
  ON newsletter_subscribers FOR UPDATE
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));