"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MessageSquare, ExternalLink, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface MyIssue {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    created_at: string;
    ai_score: number | null;
    before_image: string | null;
}

export function MyContributions() {
    const [issues, setIssues] = useState<MyIssue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMyIssues = async () => {
        setLoading(true);
        setError(null);
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError("Please sign in to view your contributions.");
                setLoading(false);
                return;
            }

            const { data, error: fetchErr } = await supabase
                .from('issues')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (fetchErr) throw fetchErr;
            setIssues(data as MyIssue[]);
        } catch (err: any) {
            setError(err.message || "Failed to load contributions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyIssues();
    }, []);

    const statusLabel = (status: string) => {
        const map: Record<string, string> = {
            pending: "Pending Review",
            ai_analyzing: "AI Analyzing",
            validated: "Validated",
            assigned: "Assigned to Agency",
            in_progress: "In Progress",
            resolved: "Resolved",
            rejected: "Rejected",
        };
        return map[status] ?? status;
    };

    const statusClass = (status: string) => {
        if (status === "resolved") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
        if (status === "pending" || status === "ai_analyzing" || status === "validated") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
        if (status === "rejected") return "bg-rose-500/20 text-rose-400 border-rose-500/30";
        if (status === "in_progress" || status === "assigned") return "bg-blue-500/20 text-blue-400 border-blue-500/30";
        return "bg-slate-800 text-slate-400 border-slate-700";
    };

    return (
        <div className="flex h-full bg-slate-950 overflow-hidden ml-[260px]">
            <ScrollArea className="flex-1 h-screen custom-scrollbar">
                <div className="max-w-5xl mx-auto p-10 space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight">My Contributions</h1>
                            <p className="text-sm text-slate-400 mt-1">Track the status of the issues you've reported</p>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Reports</p>
                                <p className="text-2xl font-black text-white">{issues.length}</p>
                            </div>
                            <button onClick={fetchMyIssues} disabled={loading} className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors">
                                <RefreshCw className={cn("h-5 w-5 text-emerald-500", loading && "animate-spin")} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {loading && issues.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center">
                            <p className="text-rose-400">{error}</p>
                        </div>
                    ) : issues.length === 0 ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
                            <div className="mx-auto h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center">
                                <MessageSquare className="h-8 w-8 text-slate-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white">No contributions yet</h3>
                            <p className="text-sm text-slate-400 max-w-sm mx-auto">
                                You haven't reported any issues. Click "New Report" in the sidebar to create your first report.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {issues.map((issue) => (
                                <div key={issue.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors flex flex-col md:flex-row gap-6">
                                    {/* Image */}
                                    {issue.before_image ? (
                                        <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                                            <img src={issue.before_image} alt="Report" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-full md:w-48 h-32 rounded-xl bg-slate-950/50 border border-slate-800 border-dashed flex items-center justify-center shrink-0">
                                            <span className="text-xs text-slate-600">No image</span>
                                        </div>
                                    )}

                                    {/* Details */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between gap-4">
                                                <h3 className="text-lg font-bold text-white truncate">{issue.title}</h3>
                                                <Badge className={cn("px-3 py-1 border whitespace-nowrap", statusClass(issue.status))}>
                                                    {statusLabel(issue.status)}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-3 mt-2">
                                                <Badge variant="outline" className="bg-slate-950 border-slate-800 text-slate-400 text-[10px] capitalize">
                                                    {issue.category}
                                                </Badge>
                                                <span className="text-xs text-slate-500 font-mono">
                                                    ID: {issue.id.substring(0, 8).toUpperCase()}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    • {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
                                                </span>
                                            </div>

                                            <p className="text-sm text-slate-400 mt-3 line-clamp-2">
                                                {issue.description || "No description provided."}
                                            </p>
                                        </div>

                                        {issue.ai_score && (
                                            <div className="mt-4 flex items-center gap-2">
                                                <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-500 rounded-full"
                                                        style={{ width: `${Math.max(0, Math.min(100, issue.ai_score))}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-bold text-emerald-500 tracking-wider">
                                                    AI SCORE {issue.ai_score}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
