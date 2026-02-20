/**
 * Reusable hook: useAuth
 * Manages Supabase Auth state in Client Components.
 * Returns { user: null, loading: false } gracefully when Supabase is not configured.
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabaseRef = useRef<SupabaseClient | null>(null);

    useEffect(() => {
        // If Supabase is not yet configured, skip gracefully
        if (!isSupabaseConfigured()) {
            setLoading(false);
            return;
        }

        // Create client only in the browser, inside useEffect
        if (!supabaseRef.current) {
            try {
                supabaseRef.current = createClient();
            } catch {
                setLoading(false);
                return;
            }
        }

        const supabase = supabaseRef.current;

        // Get initial session
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
            setLoading(false);
        });

        // Subscribe to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabaseRef.current?.auth.signOut();
    };

    return { user, loading, signOut };
}
