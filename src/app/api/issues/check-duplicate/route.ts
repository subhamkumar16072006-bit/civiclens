import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { findDuplicateIssue } from '@/lib/issue-utils';

export async function POST(request: NextRequest) {
    const supabase = await createClient();

    // 1. Verify authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const latStr = formData.get('lat') as string;
        const lngStr = formData.get('lng') as string;
        const file = formData.get('image') as File | null;

        if (!latStr || !lngStr || !file || file.size === 0) {
            return NextResponse.json({ isDuplicate: false });
        }

        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        // ~50 meters is roughly 0.00045 degrees in latitude
        const RADIUS = 0.0005;

        // 2. Find pending issues nearby
        const { data: nearbyIssues, error } = await supabase
            .from('issues')
            .select('id, title, category, status, lat, lng, before_image, created_at')
            .eq('status', 'pending')
            .gte('lat', lat - RADIUS)
            .lte('lat', lat + RADIUS)
            .gte('lng', lng - RADIUS)
            .lte('lng', lng + RADIUS);

        if (error || !nearbyIssues || nearbyIssues.length === 0) {
            return NextResponse.json({ isDuplicate: false });
        }

        // Filter valid issues with images
        const validIssues = nearbyIssues.filter(i => i.before_image);
        if (validIssues.length === 0) {
            return NextResponse.json({ isDuplicate: false });
        }

        // Sort by distance (closest first)
        validIssues.sort((a, b) => {
            const distA = Math.pow(a.lat - lat, 2) + Math.pow(a.lng - lng, 2);
            const distB = Math.pow(b.lat - lat, 2) + Math.pow(b.lng - lng, 2);
            return distA - distB;
        });

        const closestIssue = validIssues[0];

        // 3. Convert uploaded file to buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // 4. Use shared utility to find duplicate
        const duplicateResult = await findDuplicateIssue(
            supabase,
            fileBuffer,
            file.type,
            lat,
            lng
        );

        if (duplicateResult.isDuplicate) {
            return NextResponse.json({
                isDuplicate: true,
                existingIssue: duplicateResult.existingIssue
            });
        }

        return NextResponse.json({ isDuplicate: false });

    } catch (err: any) {
        console.error('[POST /api/issues/check-duplicate]', err);
        // Fail open: if AI check fails, don't block the user from submitting
        return NextResponse.json({ isDuplicate: false });
    }
}
