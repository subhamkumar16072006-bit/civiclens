-- ============================================================
-- CivicLens — Officer Roles Setup
-- Run this in your Supabase SQL Editor to add Roles.
-- ============================================================

-- 1. Add "role" column to public.profiles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'role'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN role text DEFAULT 'citizen';
    END IF;
END $$;

-- 2. Optional: Immediately upgrade a specific user to an officer for testing
-- Replace 'subhamkumar@example.com' with the email you signed up with!
UPDATE public.profiles
SET role = 'officer'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'your-officer-email@example.com'
);

-- Note: Because we used OTP, if you haven't created your officer account yet,
-- you can sign in via OTP first, then run step 2 replacing your email.
