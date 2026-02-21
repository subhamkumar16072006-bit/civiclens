"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useLanguage } from "@/components/providers/language-provider";

interface Report {
    id: string;
    title: string;
    translated_title?: string | null;
    category: string;
    status: string;
    created_at: string;
    lat: number;
    lng: number;
    risk_score: number | null;
    risk_reasoning: string | null;
}

export function ReportsTable() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        async function fetchReports() {
            if (!isSupabaseConfigured()) { setLoading(false); return; }
            try {
                // The API route currently doesn't sort by risk_score, so we'll fetch them
                // and sort them client-side for now, or preferably fix the API route.
                // Actually, the frontend calls `/api/issues`, let's check if we can pass a sort param, 
                // but since we are modifying just this component, sorting client-side is safest if the API doesn't support it.
                const res = await fetch("/api/issues?limit=50");
                const data = await res.json();

                let fetchedIssues: Report[] = data.issues ?? [];

                // Sort by risk_score DESC, then created_at DESC
                fetchedIssues.sort((a, b) => {
                    const scoreA = a.risk_score ?? 0;
                    const scoreB = b.risk_score ?? 0;
                    if (scoreB !== scoreA) {
                        return scoreB - scoreA;
                    }
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });

                setReports(fetchedIssues.slice(0, 15)); // Show top 15 after sorting
            } catch {
                setReports([]);
            } finally {
                setLoading(false);
            }
        }
        fetchReports();
    }, [t]);

    const statusLabel = (status: string) => {
        const map: Record<string, string> = {
            pending: t('status.pending'),
            ai_analyzing: t('status.analyzing'),
            validated: t('status.validated'),
            assigned: t('status.assigned'),
            in_progress: t('status.in_progress'),
            resolved: t('status.resolved'),
            rejected: t('status.rejected'),
        };
        return map[status] ?? status.toUpperCase();
    };

    const statusClass = (status: string) => {
        if (status === "resolved") return "bg-emerald-500/20 text-emerald-400";
        if (status === "pending" || status === "ai_analyzing") return "bg-amber-500/20 text-amber-400";
        if (status === "rejected") return "bg-rose-500/20 text-rose-400";
        if (status === "in_progress" || status === "assigned") return "bg-blue-500/20 text-blue-400";
        return "bg-slate-800 text-slate-400";
    };

    const formatTime = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    };

    const shortId = (id: string) => `#${id.slice(0, 8).toUpperCase()}`;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">
                    {t('table.title')}
                </h3>
                <Button
                    variant="ghost"
                    className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:text-emerald-400"
                    onClick={() => window.location.reload()}
                >
                    {t('table.refresh')}
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
                </div>
            ) : reports.length === 0 ? (
                <div className="text-center py-12 text-slate-600 text-sm">
                    {t('table.no_reports')}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800/50">
                                <th className="pb-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Report ID</th>
                                <th className="pb-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Description</th>
                                <th className="pb-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Category</th>
                                <th className="pb-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Status</th>
                                <th className="pb-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {reports.map((report) => {
                                const displayTitle = report.translated_title || report.title;

                                return (
                                    <tr key={report.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="py-5 text-sm font-mono text-slate-500">{shortId(report.id)}</td>
                                        <td className="py-5 text-sm font-bold text-white tracking-tight max-w-[260px] truncate pr-4">
                                            <div className="flex flex-col gap-1 cursor-help" title={report.risk_reasoning || 'No AI reasoning available'}>
                                                <span>{displayTitle}</span>
                                                {report.risk_reasoning && (
                                                    <span className="text-[10px] text-slate-500 font-normal truncate max-w-[220px]">
                                                        {report.risk_reasoning}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            {report.risk_score ? (
                                                <Badge className={cn(
                                                    "text-[10px] font-black px-2 py-0.5 border-0 rounded-md",
                                                    report.risk_score >= 8 ? "bg-rose-500 text-white" :
                                                        report.risk_score >= 5 ? "bg-amber-500 text-white" :
                                                            "bg-emerald-500 text-white"
                                                )}>
                                                    {report.risk_score}/10
                                                </Badge>
                                            ) : (
                                                <span className="text-[10px] text-slate-600">--</span>
                                            )}
                                        </td>
                                        <td className="py-5 text-xs text-slate-400 capitalize">{report.category}</td>
                                        <td className="py-5">
                                            <Badge className={cn(
                                                "text-[10px] font-black px-3 py-0.5 border-0 rounded-md",
                                                statusClass(report.status)
                                            )}>
                                                {statusLabel(report.status)}
                                            </Badge>
                                        </td>
                                        <td className="py-5 text-sm font-mono text-slate-500 text-right">
                                            {formatTime(report.created_at)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
