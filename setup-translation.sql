-- setup-translation.sql
-- Add Multi-Language AI Translation Columns to 'issues' table

ALTER TABLE public.issues
ADD COLUMN translated_title TEXT,
ADD COLUMN translated_description TEXT;
