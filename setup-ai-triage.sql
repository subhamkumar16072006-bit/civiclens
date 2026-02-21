-- ============================================================
-- CivicLens — AI Triage Setup
-- Run this in your Supabase SQL Editor to add severity scoring
-- for automatic issue prioritization.
-- ============================================================

-- Add AI Triage Columns to the Issues table
ALTER TABLE public.issues
ADD COLUMN IF NOT EXISTS risk_score integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS risk_reasoning text;

-- Add a constraint to ensure risk_score is between 1 and 10
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'risk_score_range'
    ) THEN
        ALTER TABLE public.issues
        ADD CONSTRAINT risk_score_range CHECK (risk_score >= 1 AND risk_score <= 10);
    END IF;
END $$;
