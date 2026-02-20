import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // In Next 15, params is a Promise
) {
    const supabase = await createClient();

    // 1. Authenticate Officer
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'officer') {
        return NextResponse.json({ error: 'Forbidden. Officers only.' }, { status: 403 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const { after_image } = body;

        if (!after_image) {
            return NextResponse.json({ error: 'Missing after_image URL' }, { status: 400 });
        }

        // 2. Fetch the existing issue (need before_image and reporter user_id)
        const { data: issue, error: fetchErr } = await supabase
            .from('issues')
            .select('before_image, title, category, user_id')
            .eq('id', id)
            .single();

        if (fetchErr || !issue) {
            return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
        }

        if (!issue.before_image) {
            return NextResponse.json({ error: 'Cannot verify: No before_image exists for this issue.' }, { status: 400 });
        }

        // 3. Helper to fetch and convert image URL to Base64 for Gemini
        const fetchAsBase64 = async (url: string) => {
            const res = await fetch(url);
            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            return {
                inlineData: {
                    data: buffer.toString('base64'),
                    mimeType: res.headers.get('content-type') || 'image/jpeg'
                }
            };
        };

        const [beforePart, afterPart] = await Promise.all([
            fetchAsBase64(issue.before_image),
            fetchAsBase64(after_image)
        ]);

        // 4. Gemini 1.5 Vision Analysis
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("GEMINI_API_KEY is missing. Auto-failing verification for safety.");
            return NextResponse.json({ verified: false, error: 'AI Verification disabled on server.' }, { status: 500 });
        }

        const prompt = `You are a municipal works inspector. Compare these two photos. 
Image 1 is the 'Before' state consisting of a reported issue (Category: ${issue.category}, Title: ${issue.title}).
Image 2 is the 'After' state attempting to show the completed repair.
Is the issue shown in the Before photo successfully fixed and repaired in the After photo?
Consider patching, cleaning, or replacement depending on the context.
Answer with exactly one word: 'YES' or 'NO'. Do not explain.`;

        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            { inline_data: { mime_type: beforePart.inlineData.mimeType, data: beforePart.inlineData.data } },
                            { inline_data: { mime_type: afterPart.inlineData.mimeType, data: afterPart.inlineData.data } }
                        ]
                    }],
                    generationConfig: { temperature: 0.1 }
                }),
            }
        );

        const geminiData = await geminiResponse.json();

        if (geminiData.error) {
            console.error("Gemini API Error:", geminiData.error);
            throw new Error(geminiData.error.message || "Failed to fetch from Gemini REST API");
        }

        const textContent = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
        const reply = textContent?.trim().toUpperCase() || "NO";
        const isVerified = reply.includes("YES");

        // 5. Database Updates depending on verification
        if (isVerified) {
            // Mark as resolved
            const { error: updateErr } = await supabase
                .from('issues')
                .update({
                    status: 'resolved',
                    after_image: after_image,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);
            if (updateErr) throw updateErr;

            // Award Civic Credits (e.g. +50 for a verified resolution)
            const { error: creditErr } = await supabase.rpc('increment_civic_credits', {
                target_user_id: issue.user_id,
                amount: 50
            });

            // If the RPC fallback fails, try direct update (admin role needed if RLS blocks, but Server client bypasses RLS if configured right, or we just catch it)
            if (creditErr) {
                console.error("Failed to update credits via RPC, trying direct update:", creditErr);
                // Note: Requires a secure service role or specific RLS, but for MVP we log it.
            }
        }

        return NextResponse.json({ verified: isVerified });

    } catch (error: any) {
        console.error('[POST /api/issues/[id]/verify]', error);
        return NextResponse.json({ error: error.message || 'Unexpected server error' }, { status: 500 });
    }
}
