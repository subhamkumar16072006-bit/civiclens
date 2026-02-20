/**
 * Reusable hook: useIssues
 * Fetches a list of issues from /api/issues with optional filters.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { IssueWithProfile } from '@/lib/database.types';

interface UseIssuesOptions {
    category?: string;
    status?: string;
    limit?: number;
}

export function useIssues(options: UseIssuesOptions = {}) {
    const [issues, setIssues] = useState<IssueWithProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchIssues = useCallback(async () => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (options.category) params.set('category', options.category);
        if (options.status) params.set('status', options.status);
        if (options.limit) params.set('limit', String(options.limit));

        try {
            const res = await fetch(`/api/issues?${params.toString()}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to fetch issues');
            setIssues(data.issues ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [options.category, options.status, options.limit]);

    useEffect(() => {
        fetchIssues();
    }, [fetchIssues]);

    return { issues, loading, error, refetch: fetchIssues };
}
