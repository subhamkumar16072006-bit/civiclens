/**
 * Supabase Browser Client
 * Use this in Client Components ('use client').
 */
import { createBrowserClient } from '@supabase/ssr';

/** Returns true only when real Supabase credentials are present. */
export function isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    // Validate: URL must start with https:// and key must look like a JWT
    return url.startsWith('https://') && key.startsWith('eyJ');
}

export function createClient() {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured. Please fill in .env.local with your real NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
}
