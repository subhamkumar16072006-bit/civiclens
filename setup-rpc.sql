-- ============================================================
-- CivicLens — Civic Credits RPC
-- Run this in your Supabase SQL Editor to allow the API
-- to securely award Civic Credits upon AI verification.
-- ============================================================

CREATE OR REPLACE FUNCTION public.increment_civic_credits(target_user_id uuid, amount int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET civic_credits = civic_credits + amount
  WHERE id = target_user_id;
END;
$$;
