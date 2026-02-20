-- ============================================================
-- CivicLens — Storage Setup
-- Run this in your Supabase SQL Editor to create the bucket
-- and allow image uploads for the reporting engine.
-- ============================================================

-- 1. Create the 'issue-images' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'issue-images',
  'issue-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public read access to images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'issue-images' );

-- 3. Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'issue-images' );

-- 4. Allow authenticated users to update their own images (optional)
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( auth.uid() = owner )
WITH CHECK ( bucket_id = 'issue-images' );

-- 5. Allow users to delete their own images (optional)
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING ( auth.uid() = owner );
