/**
 * POST /api/issues
 * Creates a new issue, uploads the before_image to Supabase Storage,
 * and returns the created issue row.
 * The audit log entry is auto-created by the DB trigger.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { IssueInsert } from '@/lib/database.types';
import { findDuplicateIssue, verifyImageExif } from '@/lib/issue-utils';

export async function POST(request: NextRequest) {
    const supabase = await createClient();

    // 1. Verify authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('image') as File | null;

        // 2. Perform Duplicate Check (server-side enforcement)
        const latStr = formData.get('lat') as string;
        const lngStr = formData.get('lng') as string;
        const ignoreDuplicate = formData.get('ignore_duplicate') === 'true';

        let before_image_url: string | null = null;

        if (file && file.size > 0 && latStr && lngStr) {
            const lat = parseFloat(latStr);
            const lng = parseFloat(lngStr);
            const fileBuffer = Buffer.from(await file.arrayBuffer());

            // 2a. Perform Anti-Fraud EXIF Check
            const exifResult = await verifyImageExif(fileBuffer, lat, lng);
            if (!exifResult.valid) {
                return NextResponse.json({
                    error: exifResult.error || 'Anti-fraud validation failed for the uploaded image.'
                }, { status: 400 });
            }

            // 2b. Perform Duplicate Check via PostGIS (merge if duplicate)
            if (!ignoreDuplicate) {
                // Call the new RPC 'find_nearby_pending_issues' using the server client
                const { data: nearbyIssues, error: rpcError } = await supabase.rpc(
                    'find_nearby_pending_issues',
                    { search_lat: lat, search_lng: lng, radius_meters: 50.0 }
                );

                if (!rpcError && nearbyIssues && nearbyIssues.length > 0) {
                    // Quick check: does the category match?
                    const category = formData.get('category') as string;
                    const matchingDuplicate = nearbyIssues.find((i: any) => i.category === category);

                    if (matchingDuplicate) {
                        // MERGE FLOW: Increment report_count on the existing issue
                        const newCount = (matchingDuplicate.report_count || 1) + 1;

                        await supabase
                            .from('issues')
                            .update({ report_count: newCount })
                            .eq('id', matchingDuplicate.id);

                        // Acknowledge the contribution in the audit log
                        await supabase.from('audit_ledger').insert({
                            issue_id: matchingDuplicate.id,
                            action: 'STATUS_CHANGE', // Reusing action for simplicity
                            prev_status: matchingDuplicate.status,
                            new_status: matchingDuplicate.status,
                            actor_id: user.id,
                            metadata: { note: 'Merged duplicate report via PostGIS proximity check' },
                        });

                        return NextResponse.json({
                            message: 'Report merged with an existing nearby issue.',
                            issue: { ...matchingDuplicate, report_count: newCount },
                            isDuplicateMerged: true
                        }, { status: 200 }); // Return 200 OK, not an error!
                    }
                }
            }

            // 3. Upload before_image to Supabase Storage (if provided)
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('issue-images')
                .upload(fileName, file, { contentType: file.type });

            if (uploadError) {
                return NextResponse.json({ error: 'Image upload failed', details: uploadError.message }, { status: 500 });
            }

            const { data: urlData } = supabase.storage
                .from('issue-images')
                .getPublicUrl(fileName);

            before_image_url = urlData.publicUrl;
        }

        // 4. Build the issue payload from the form fields
        const issuePayload: IssueInsert = {
            user_id: user.id,
            category: formData.get('category') as string,
            subcategory: formData.get('subcategory') as string | null,
            title: formData.get('title') as string,
            description: formData.get('description') as string | null,
            lat: parseFloat(formData.get('lat') as string || '0'),
            lng: parseFloat(formData.get('lng') as string || '0'),
            before_image: before_image_url,
        };

        if (!issuePayload.category || !issuePayload.title || isNaN(issuePayload.lat) || isNaN(issuePayload.lng)) {
            return NextResponse.json({ error: 'Missing required fields: category, title, lat, lng' }, { status: 400 });
        }

        // 5. Insert to DB — the DB trigger auto-creates the first audit_ledger entry
        const { data: issue, error: insertError } = await supabase
            .from('issues')
            .insert(issuePayload)
            .select()
            .single();

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        // 6. Kick off AI analysis asynchronously (fire-and-forget)
        const analyzeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/issues/${issue.id}/analyze`;
        fetch(analyzeUrl, { method: 'POST' }).catch(console.error);

        return NextResponse.json({ issue }, { status: 201 });

    } catch (error) {
        console.error('[POST /api/issues]', error);
        return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabase
        .from('issues')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (category) query = query.eq('category', category);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ issues: data });
}
