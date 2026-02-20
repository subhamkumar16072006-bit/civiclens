/**
 * POST /api/issues
 * Creates a new issue, uploads the before_image to Supabase Storage,
 * and returns the created issue row.
 * The audit log entry is auto-created by the DB trigger.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { IssueInsert } from '@/lib/database.types';

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

        // 2. Upload before_image to Supabase Storage (if provided)
        let before_image_url: string | null = null;
        if (file && file.size > 0) {
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

        // 3. Build the issue payload from the form fields
        const issuePayload: IssueInsert = {
            user_id: user.id,
            category: formData.get('category') as string,
            subcategory: formData.get('subcategory') as string | null,
            title: formData.get('title') as string,
            description: formData.get('description') as string | null,
            lat: parseFloat(formData.get('lat') as string),
            lng: parseFloat(formData.get('lng') as string),
            before_image: before_image_url,
        };

        if (!issuePayload.category || !issuePayload.title || isNaN(issuePayload.lat) || isNaN(issuePayload.lng)) {
            return NextResponse.json({ error: 'Missing required fields: category, title, lat, lng' }, { status: 400 });
        }

        // 4. Insert to DB — the DB trigger auto-creates the first audit_ledger entry
        const { data: issue, error: insertError } = await supabase
            .from('issues')
            .insert(issuePayload)
            .select()
            .single();

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        // 5. Kick off AI analysis asynchronously (fire-and-forget)
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
