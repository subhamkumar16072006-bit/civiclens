-- ============================================================
-- CivicLens — PostGIS Setup
-- Run this in your Supabase SQL Editor to enable spatial
-- queries for automatic duplicate issue merging.
-- ============================================================

-- 1. Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Add 'location' column to 'issues' table
-- geography(POINT, 4326) is standard for GPS coords (lat/lng)
ALTER TABLE public.issues
ADD COLUMN IF NOT EXISTS location geography(POINT, 4326);

-- 3. Add 'report_count' to track merged duplicates
ALTER TABLE public.issues
ADD COLUMN IF NOT EXISTS report_count integer DEFAULT 1;

-- 4. Create trigger to auto-update 'location' when lat/lng are set/updated
CREATE OR REPLACE FUNCTION public.update_issue_location()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.lat IS NOT NULL AND NEW.lng IS NOT NULL THEN
        -- PostGIS uses Longitude, Latitude order (X, Y)
        NEW.location = st_setsrid(st_makepoint(NEW.lng, NEW.lat), 4326)::geography;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_issue_location ON public.issues;
CREATE TRIGGER trg_update_issue_location
BEFORE INSERT OR UPDATE OF lat, lng ON public.issues
FOR EACH ROW
EXECUTE FUNCTION public.update_issue_location();

-- 5. Backfill existing data
UPDATE public.issues
SET location = st_setsrid(st_makepoint(lng, lat), 4326)::geography
WHERE lat IS NOT NULL AND lng IS NOT NULL AND location IS NULL;

-- 6. Create RPC to find pending issues within a radius
--    Uses PostGIS ST_DWithin for fast, index-backed spatial searching
CREATE OR REPLACE FUNCTION public.find_nearby_pending_issues(
    search_lat double precision,
    search_lng double precision,
    radius_meters double precision DEFAULT 50.0
)
RETURNS SETOF public.issues
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.issues
    WHERE status = 'pending'
    AND ST_DWithin(
        location,
        st_setsrid(st_makepoint(search_lng, search_lat), 4326)::geography,
        radius_meters
    )
    ORDER BY ST_Distance(
        location,
        st_setsrid(st_makepoint(search_lng, search_lat), 4326)::geography
    ) ASC;
END;
$$;
