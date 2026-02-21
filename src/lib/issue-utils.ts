import { SupabaseClient } from '@supabase/supabase-js';
import exifr from 'exifr';

export interface DuplicateCheckResult {
    isDuplicate: boolean;
    existingIssue?: any;
}

export interface ExifCheckResult {
    valid: boolean;
    error?: string;
}

// Distance calculation using Haversine formula
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

/**
 * Parses the image EXIF data to verify it was taken recently and near the reported location.
 */
export async function verifyImageExif(fileBuffer: Buffer, reportedLat: number, reportedLng: number): Promise<ExifCheckResult> {
    try {
        const parsed = await exifr.parse(fileBuffer, { pick: ['latitude', 'longitude', 'DateTimeOriginal'] });

        if (!parsed) {
            // For a strict hackathon demo, we could enforce EXIF must exist.
            // But realistically, many social media apps strip EXIF. 
            // We'll return an error to strictly block fraud.
            return { valid: false, error: "Image metadata (EXIF) is missing. Plase take a fresh photo with Location enabled." };
        }

        const { latitude, longitude, DateTimeOriginal } = parsed;

        if (!latitude || !longitude) {
            return { valid: false, error: "GPS metadata is missing. Plase ensure location is enabled in your camera app." };
        }

        if (!DateTimeOriginal) {
            return { valid: false, error: "Timestamp metadata is missing from the image." };
        }

        // Check if timestamp is within the last 24 hours
        // For strict hackathon demo, could be 1-2 hours.
        const photoTime = new Date(DateTimeOriginal).getTime();
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;

        if (now - photoTime > oneDayMs) {
            return { valid: false, error: "This photo is over 24 hours old. Please capture a live photo to report." };
        }

        // Check distance (e.g., within 1 km tolerance)
        const distanceKm = getDistanceFromLatLonInKm(reportedLat, reportedLng, latitude, longitude);
        if (distanceKm > 1) { // 1 km tolerance
            return { valid: false, error: `Image location is too far (${distanceKm.toFixed(1)}km) from the reported map pin.` };
        }

        return { valid: true };

    } catch (err) {
        console.error("EXIF Verification Error:", err);
        return { valid: false, error: "Failed to read image metadata. Ensure you are uploading an original photo." };
    }
}

/**
 * Searches for potential duplicate issues based on location and image similarity using Gemini.
 */
export async function findDuplicateIssue(
    supabase: SupabaseClient,
    imageBuffer: Buffer,
    mimeType: string,
    lat: number,
    lng: number,
    radius: number = 0.0005 // roughly 50m
): Promise<DuplicateCheckResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn('GEMINI_API_KEY not configured, skipping duplicate check.');
        return { isDuplicate: false };
    }

    try {
        // 1. Find pending issues nearby
        const { data: nearbyIssues, error } = await supabase
            .from('issues')
            .select('id, title, category, status, lat, lng, before_image, created_at')
            .eq('status', 'pending')
            .gte('lat', lat - radius)
            .lte('lat', lat + radius)
            .gte('lng', lng - radius)
            .lte('lng', lng + radius);

        if (error || !nearbyIssues || nearbyIssues.length === 0) {
            return { isDuplicate: false };
        }

        // Filter issues that actually have images
        const validIssues = nearbyIssues.filter(i => i.before_image);
        if (validIssues.length === 0) {
            return { isDuplicate: false };
        }

        // Sort by distance (closest first)
        validIssues.sort((a, b) => {
            const distA = Math.pow(a.lat - lat, 2) + Math.pow(a.lng - lng, 2);
            const distB = Math.pow(b.lat - lat, 2) + Math.pow(b.lng - lng, 2);
            return distA - distB;
        });

        // We'll check the top 3 closest issues to be more robust
        const candidateIssues = validIssues.slice(0, 3);
        const base64UploadedImage = imageBuffer.toString('base64');

        for (const issue of candidateIssues) {
            try {
                // Fetch existing issue's image
                const res = await fetch(issue.before_image);
                if (!res.ok) continue;

                const existingArrayBuffer = await res.arrayBuffer();
                const existingBuffer = Buffer.from(existingArrayBuffer);
                const existingBase64 = existingBuffer.toString('base64');
                const existingMimeType = res.headers.get('content-type') || 'image/jpeg';

                const prompt = `Compare these two photos. 
Image 1 is a recently submitted civic issue.
Image 2 is a historically reported civic issue (Category: ${issue.category}).
Are they showing the EXACT SAME specific physical issue/damage (e.g. same pothole, same trash pile, same broken light) in the same location from a different angle or lighting?
Answer exactly with one word: 'YES' or 'NO'. Do not explain.`;

                const geminiResponse = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [
                                    { text: prompt },
                                    { inline_data: { mime_type: mimeType, data: base64UploadedImage } },
                                    { inline_data: { mime_type: existingMimeType, data: existingBase64 } }
                                ]
                            }],
                            generationConfig: { temperature: 0.1 }
                        }),
                    }
                );

                const geminiData = await geminiResponse.json();
                const textContent = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
                const reply = textContent?.trim().toUpperCase() || "NO";

                if (reply.includes("YES")) {
                    return { isDuplicate: true, existingIssue: issue };
                }
            } catch (err) {
                console.error(`Error comparing with issue ${issue.id}:`, err);
            }
        }

        return { isDuplicate: false };
    } catch (err) {
        console.error('findDuplicateIssue error:', err);
        return { isDuplicate: false };
    }
}
