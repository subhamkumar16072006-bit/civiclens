/**
 * POST /api/issues/[id]/analyze
 * Calls Gemini 1.5 Flash to analyze the issue's before_image.
 * Writes result to audit_ledger and updates issue status + ai_score.
 * Uses Admin client to bypass RLS (this is a server-to-server call).
 */
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function POST(_req: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const adminClient = createAdminClient();

    // 1. Fetch the issue
    const { data: issue, error: fetchError } = await adminClient
        .from('issues')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError || !issue) {
        return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    // 2. Update status to 'ai_analyzing' and log it
    await adminClient.from('issues').update({ status: 'ai_analyzing' }).eq('id', id);
    await adminClient.from('audit_ledger').insert({
        issue_id: id,
        action: 'STATUS_CHANGE',
        prev_status: issue.status,
        new_status: 'ai_analyzing',
        actor_id: null,
        metadata: { triggered_by: 'AI_PIPELINE' },
    });

    // 3. Call Gemini 1.5 Flash
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
        return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    let aiScore = 0;
    let aiSummary = 'No image provided for analysis.';

    if (issue.before_image) {
        try {
            const imageResponse = await fetch(issue.before_image);
            const imageBuffer = await imageResponse.arrayBuffer();
            const base64Image = Buffer.from(imageBuffer).toString('base64');
            const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

            const geminiResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                {
                                    text: `You are a civic issue verification AI. Analyze this image and determine if it matches the reported category: "${issue.category}" and sub-category: "${issue.subcategory || 'N/A'}".

Respond ONLY with a JSON object in this format:
{
  "verified": true/false,
  "confidence_score": <number 0-100>,
  "summary": "<one sentence describing what you see>",
  "severity": "low" | "medium" | "high" | "critical"
}`
                                },
                                {
                                    inline_data: { mime_type: mimeType, data: base64Image }
                                }
                            ]
                        }],
                        generationConfig: { responseMimeType: 'application/json', temperature: 0.1 }
                    }),
                }
            );

            const geminiData = await geminiResponse.json();
            const textContent = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (textContent) {
                const parsed = JSON.parse(textContent);
                aiScore = parsed.confidence_score ?? 0;
                aiSummary = parsed.summary ?? 'Analysis complete.';

                // 4. Write detailed AI result to audit_ledger
                await adminClient.from('audit_ledger').insert({
                    issue_id: id,
                    action: 'AI_ANALYSIS',
                    prev_status: 'ai_analyzing',
                    new_status: 'validated',
                    actor_id: null,
                    metadata: { ...parsed, model: 'gemini-1.5-flash' },
                });
            }
        } catch (err) {
            console.error('[/api/analyze] Gemini error:', err);
            aiSummary = 'AI analysis failed — manual review required.';
        }
    }

    // 5. Update issue with AI results
    await adminClient.from('issues').update({
        status: 'validated',
        ai_score: aiScore,
    }).eq('id', id);

    return NextResponse.json({
        success: true,
        ai_score: aiScore,
        summary: aiSummary,
    });
}
