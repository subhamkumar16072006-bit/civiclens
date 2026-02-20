"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";

interface Report {
    id: string;
    title: string;
    category: string;
    status: string;
    created_at: string;
    lat: number;
    lng: number;
}

export function ReportsTable() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReports() {
            if (!isSupabaseConfigured()) { setLoading(false); return; }
            try {
                const res = await fetch("/api/issues?limit=10");
                const data = await res.json();
                setReports(data.issues ?? []);
            } catch {
                setReports([]);
            } finally {
                setLoading(false);
            }
        }
        fetchReports();
    }, []);

    const statusLabel = (status: string) => {
        const map: Record<string, string> = {
            pending: "PENDING",
            ai_analyzing: "ANALYZING",
            validated: "VALIDATED",
            assigned: "ASSIGNED",
            in_progress: "IN PROGRESS",
            resolved: "RESOLVED",
            rejected: "REJECTED",
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
                    Active Sector Reports
                </h3>
                <Button
                    variant="ghost"
                    className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:text-emerald-400"
                    onClick={() => window.location.reload()}
                >
                    REFRESH
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
                </div>
            ) : reports.length === 0 ? (
                <div className="text-center py-12 text-slate-600 text-sm">
                    No reports found. Submit your first issue!
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
                            {reports.map((report) => (
                                <tr key={report.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-5 text-sm font-mono text-slate-500">{shortId(report.id)}</td>
                                    <td className="py-5 text-sm font-bold text-white tracking-tight max-w-[260px] truncate pr-4">
                                        {report.title}
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
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
