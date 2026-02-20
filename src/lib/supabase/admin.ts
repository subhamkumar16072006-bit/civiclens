/**
 * Supabase Admin Client (Server-only — uses SERVICE_ROLE_KEY)
 * Bypasses RLS. Use ONLY in trusted server-side code (AI analysis routes, etc.)
 * NEVER import this in any client-side code.
 */
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set.');
    }
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}
