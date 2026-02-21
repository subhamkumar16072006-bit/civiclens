import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();

        // 1. Stats (Total, Resolved, Pending)
        const { data: issues, error: issuesErr } = await supabase
            .from('issues')
            .select('id, status, lat, lng, created_at, category, title, description, translated_title, translated_description, before_image, ai_score')
            .order('created_at', { ascending: false });

        if (issuesErr) throw issuesErr;

        const total = issues.length;
        const resolvedList = issues.filter(i => i.status === 'resolved');
        const resolved = resolvedList.length;
        const pending = total - resolved;

        // 2. Map coordinates
        const mapData = issues.map(i => ({
            id: i.id,
            lat: i.lat,
            lng: i.lng,
            status: i.status,
            category: i.category
        }));

        // 3. Active Fixes
        const activeFixes = issues.filter(i =>
            ['in_progress', 'assigned', 'ai_analyzing', 'validated', 'pending'].includes(i.status)
        );

        // 4. Civic Leaders (Top 5 by credits)
        const { data: leaders } = await supabase
            .from('profiles')
            .select('id, username, civic_credits, avatar_url')
            .order('civic_credits', { ascending: false })
            .limit(5);

        // 5. Recent Activity (Latest 5 issues created or resolved)
        // For simplicity without hitting audit_ledger, we use the issues timeline
        const activity = issues.slice(0, 5).map(i => ({
            id: i.id,
            text: i.status === 'resolved' ? `Resolved: ${i.category} issue in sector` : `New report: ${i.category}`,
            time: i.created_at,
            statusColor: i.status === 'resolved' ? 'emerald' : 'slate'
        }));

        return NextResponse.json({
            stats: { total, resolved, pending },
            mapData,
            activeFixes,
            leaders: leaders || [],
            activity
        });

    } catch (error) {
        console.error('[GET /api/dashboard]', error);
        return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
    }
}
