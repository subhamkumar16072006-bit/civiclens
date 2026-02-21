/**
 * GET  /api/issues/[id]   — fetch a single issue with its full audit trail
 * PATCH /api/issues/[id]  — update status (admin/system use)
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { IssueStatus } from '@/lib/database.types';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: issue, error } = await supabase
        .from('issues')
        .select(`
      *,
      profiles(username, avatar_url),
      audit_ledger(
          *,
          profiles(username, avatar_url)
      )
    `)
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ issue });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Only authenticated users can patch
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as {
        status: IssueStatus;
        after_image?: string;
        ai_score?: number;
        metadata?: Record<string, unknown>;
    };

    // Fetch current issue to capture prev_status for the audit log
    const { data: currentIssue, error: fetchError } = await adminClient
        .from('issues')
        .select('status')
        .eq('id', id)
        .single();

    if (fetchError) {
        return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    const prevStatus = currentIssue.status as IssueStatus;

    // Update the issue
    const updatePayload: Record<string, unknown> = { status: body.status };
    if (body.after_image) updatePayload.after_image = body.after_image;
    if (body.ai_score !== undefined) updatePayload.ai_score = body.ai_score;

    const { data: updated, error: updateError } = await adminClient
        .from('issues')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Append immutable audit log entry
    const { error: ledgerError } = await adminClient
        .from('audit_ledger')
        .insert({
            issue_id: id,
            action: 'STATUS_CHANGE',
            prev_status: prevStatus,
            new_status: body.status,
            actor_id: user.id,
            metadata: body.metadata ?? null,
        });

    if (ledgerError) {
        console.error('[PATCH /api/issues/:id] Ledger write failed:', ledgerError);
    }

    return NextResponse.json({ issue: updated });
}
