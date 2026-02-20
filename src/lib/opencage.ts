/**
 * OpenCage Geocoding Utility
 * Free tier: 2,500 requests/day — no credit card needed.
 */

const OPENCAGE_API_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

export interface GeoResult {
    address: string;
    city: string;
    country: string;
    formatted: string;
}

/**
 * Reverse geocode (lat/lng → human-readable address) using OpenCage.
 */
export async function getAddress(lat: number, lng: number): Promise<GeoResult | null> {
    if (!OPENCAGE_API_KEY || OPENCAGE_API_KEY === 'your-opencage-key-here') {
        // Graceful fallback when key not configured
        return {
            address: `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
            city: 'Unknown',
            country: 'Unknown',
            formatted: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
        };
    }

    try {
        const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}&language=en&pretty=1&no_annotations=1`
        );
        const data = await res.json();

        if (!data.results || data.results.length === 0) return null;

        const result = data.results[0];
        const components = result.components;

        return {
            address: [components.road, components.suburb, components.neighbourhood]
                .filter(Boolean).join(', '),
            city: components.city || components.town || components.village || components.county || '',
            country: components.country || '',
            formatted: result.formatted,
        };
    } catch (err) {
        console.error('[OpenCage]', err);
        return null;
    }
}
