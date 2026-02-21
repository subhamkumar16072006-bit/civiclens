import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase env vars");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function createHindiIssue() {
    console.log("Creating Hindi issue...");
    const { data: issue, error } = await supabase.from('issues').insert({
        user_id: 'a06ecb6d-aebf-410e-af4c-0bcbd00e3943', // Using an existing test user
        category: 'sanitation',
        title: 'सड़क पर कचरे का ढेर',
        description: 'सड़क के किनारे पिछले 3 दिनों से कचरे का ढेर लगा है। इससे बहुत बदबू आ रही है और बीमारियां फैलने का डर है। कृपया इसे जल्द से जल्द साफ करवाएं।',
        lat: 28.6139,
        lng: 77.2090,
        status: 'pending'
    }).select().single();

    if (error) {
        console.error("Failed to create issue:", error);
        return;
    }

    console.log("Created issue:", issue.id);
    console.log("Triggering AI Analysis Pipeline...");

    try {
        const analyzeUrl = `http://localhost:3000/api/issues/${issue.id}/analyze`;
        const res = await fetch(analyzeUrl, { method: 'POST' });
        const data = await res.json();
        console.log("AI Analysis Result:", data);

        // Fetch back from DB to see translation
        const { data: updatedIssue } = await supabase.from('issues').select('*').eq('id', issue.id).single();
        console.log("Translated Title:", updatedIssue.translated_title);
        console.log("Translated Description:", updatedIssue.translated_description);

    } catch (e) {
        console.error("Error triggering analyze:", e);
    }
}

createHindiIssue();
