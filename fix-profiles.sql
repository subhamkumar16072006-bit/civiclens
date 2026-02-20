-- ============================================================
-- CivicLens — Profile Sync Fix (Resilient Version)
-- Run this in your Supabase SQL Editor to fix missing profiles.
-- Handles "duplicate key value violates unique constraint 'profiles_username_key'"
-- ============================================================

-- 1. Sync any existing users from auth.users who are missing in public.profiles
-- We use a more robust username generation to avoid collisions
INSERT INTO public.profiles (id, username, civic_credits)
SELECT 
    id, 
    -- If username exists, we append the first 4 chars of ID to make it unique
    SUBSTRING(
        COALESCE(
            NULLIF(TRIM(raw_user_meta_data->>'username'), ''),
            NULLIF(TRIM(split_part(email, '@', 1)), ''),
            'user'
        ), 1, 15
    ) || '_' || LEFT(id::text, 4) as username,
    0
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- 2. Update the trigger function to be more resilient too
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
BEGIN
  -- Generate a safe base username
  base_username := COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'username'), ''),
      NULLIF(TRIM(split_part(NEW.email, '@', 1)), ''),
      'user'
  );

  -- Append a short ID suffix to ensure uniqueness against existing rows
  final_username := LEFT(base_username, 15) || '_' || LEFT(NEW.id::text, 4);

  INSERT INTO public.profiles (id, username, civic_credits, avatar_url)
  VALUES (
    NEW.id,
    final_username,
    0,
    NULL
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
