-- ============================================================
-- CivicLens — Auto-assign Officer Role Trigger (DEMO MODE)
-- Run this in your Supabase SQL Editor.
-- DEMO HACK: Automatically assigns role='officer' if the user
-- selects the "Authority" mode. Since we can't pass mode directly 
-- via OTP, for the demo we'll make EVERY new user an officer 
-- OR use a specific domain if you prefer. 
--
-- Actually, the best way for a Demo without blocking is to just 
-- let the frontend pass a specific username format or just manually
-- assign it. For this demo bypass: Let's make everyone who signs up 
-- right now an officer so you can test the dashboard!
-- ============================================================

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

  -- Append a short ID suffix to ensure uniqueness
  final_username := LEFT(base_username, 15) || '_' || LEFT(NEW.id::text, 4);

  -- For Demo Purposes: Make everyone an officer so the hackathon judges can test it immediately
  INSERT INTO public.profiles (id, username, civic_credits, avatar_url, role)
  VALUES (
    NEW.id,
    final_username,
    0,
    NULL,
    'officer'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;
