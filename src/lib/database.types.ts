/**
 * CivicLens — Database Types
 * These types exactly mirror the Supabase schema from Phase 1 SQL.
 */

export type IssueStatus =
    | 'pending'
    | 'ai_analyzing'
    | 'validated'
    | 'assigned'
    | 'in_progress'
    | 'resolved'
    | 'rejected';

export type AuditAction =
    | 'ISSUE_CREATED'
    | 'STATUS_CHANGE'
    | 'AI_ANALYSIS'
    | 'EVIDENCE_UPLOADED';

// ── Table Row Types ──────────────────────────────────────────

export interface Profile {
    id: string;
    username: string;
    civic_credits: number;
    avatar_url: string | null;
    created_at: string;
}

export interface Issue {
    id: string;
    user_id: string;
    category: string;
    subcategory: string | null;
    title: string;
    description: string | null;
    lat: number;
    lng: number;
    status: IssueStatus;
    before_image: string | null;
    after_image: string | null;
    ai_score: number | null;
    created_at: string;
    updated_at: string;
}

export interface AuditLedgerEntry {
    id: string;
    issue_id: string;
    action: AuditAction;
    prev_status: IssueStatus | null;
    new_status: IssueStatus;
    actor_id: string | null;
    metadata: Record<string, unknown> | null;
    timestamp: string;
}

// ── Insert Types (fields that auto-generate are optional) ────

export type ProfileInsert = Omit<Profile, 'civic_credits' | 'created_at'> & {
    civic_credits?: number;
};

export type IssueInsert = Omit<Issue,
    'id' | 'status' | 'ai_score' | 'after_image' | 'created_at' | 'updated_at'
> & {
    status?: IssueStatus;
};

export type AuditLedgerInsert = Omit<AuditLedgerEntry, 'id' | 'timestamp'> & {
    timestamp?: string;
};

// ── Enriched / Joined Types ──────────────────────────────────

/** Issue row joined with the reporter's profile data */
export interface IssueWithProfile extends Issue {
    profiles: Pick<Profile, 'username' | 'avatar_url'>;
}

/** Full audit trail for a single issue */
export interface IssueAuditTrail extends Issue {
    audit_ledger: AuditLedgerEntry[];
}
