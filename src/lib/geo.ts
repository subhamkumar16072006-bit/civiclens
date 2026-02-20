/**
 * geo.ts — Geolocation Service
 * Wraps OpenCage reverse geocoding API.
 * Usage: import { fetchAddress } from "@/lib/geo"
 */

const OPENCAGE_KEY = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

export interface AddressResult {
    formatted: string;   // Full human-readable address
    road: string;        // Street / road name
    city: string;        // City or nearest town
    state: string;       // State
    country: string;     // Country
    postcode: string;    // PIN code
}

/**
 * fetchAddress — converts GPS coordinates to a human-readable address.
 * Falls back to coordinate string if API key is not configured.
 */
export async function fetchAddress(lat: number, lng: number): Promise<AddressResult> {
    const fallback: AddressResult = {
        formatted: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        road: "",
        city: "Unknown",
        state: "",
        country: "India",
        postcode: "",
    };

    if (!OPENCAGE_KEY || OPENCAGE_KEY === "your-opencage-key-here") {
        return fallback;
    }

    try {
        const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_KEY}&language=en&no_annotations=1&limit=1`
        );

        if (!res.ok) return fallback;
        const data = await res.json();
        if (!data.results?.length) return fallback;

        const r = data.results[0];
        const c = r.components;

        return {
            formatted: r.formatted,
            road: c.road || c.pedestrian || c.footway || c.path || "",
            city: c.city || c.town || c.village || c.county || c.municipality || "",
            state: c.state || "",
            country: c.country || "India",
            postcode: c.postcode || "",
        };
    } catch {
        return fallback;
    }
}
