"use client";

import React, { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PriorityMap } from "@/components/dashboard/priority-map";
import { ReportsTable } from "@/components/dashboard/reports-table";
import { DashboardRightSidebar } from "@/components/dashboard/right-sidebar";
import { FixVerification } from "@/components/reporting/fix-verification";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isSupabaseConfigured } from "@/lib/supabase/client";

interface Stats {
    total: number;
    resolved: number;
    pending: number;
    resolvedPct: string;
}

async function fetchStats(): Promise<Stats> {
    try {
        const [allRes, resolvedRes] = await Promise.all([
            fetch("/api/issues?limit=500"),
            fetch("/api/issues?status=resolved&limit=500"),
        ]);
        const allData = await allRes.json();
        const resolvedData = await resolvedRes.json();
        const total = allData.issues?.length ?? 0;
        const resolved = resolvedData.issues?.length ?? 0;
        const pending = total - resolved;
        const resolvedPct = total > 0 ? `${Math.round((resolved / total) * 100)}%` : "0%";
        return { total, resolved, pending, resolvedPct };
    } catch {
        return { total: 0, resolved: 0, pending: 0, resolvedPct: "0%" };
    }
}

export function RedesignedDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        if (!isSupabaseConfigured()) return;
        fetchStats().then(setStats);
    }, []);

    const totalLabel = stats ? stats.total.toLocaleString("en-IN") : "—";
    const resolvedLabel = stats ? stats.resolvedPct : "—";
    const subLabel = stats ? `${stats.pending} Pending` : "";

    return (
        <div className="flex h-full bg-slate-950 overflow-hidden ml-[260px]">
            {/* Main Center Content */}
            <ScrollArea className="flex-1 h-screen custom-scrollbar">
                <div className="max-w-6xl mx-auto p-10 space-y-10">
                    <DashboardHeader />

                    {/* Live Metrics Row */}
                    <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
                        <MetricCard
                            label="Total Issues Reported"
                            value={totalLabel}
                            trend={stats ? `${stats.resolved} Resolved` : ""}
                            trendColor="text-emerald-500"
                        />
                        <MetricCard
                            label="Resolution Rate"
                            value={resolvedLabel}
                            subValue={subLabel}
                            trendColor="text-emerald-500"
                        />
                        <MetricCard
                            label="System Health"
                            value="Optimal"
                            status="Live"
                            statusColor="text-emerald-500"
                        />
                    </div>

                    {/* Map Section */}
                    <PriorityMap />

                    {/* Live Reports Table */}
                    <ReportsTable />

                    {/* Fix Verification */}
                    <section className="space-y-6 pt-10 border-t border-slate-900">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Active Resolution</h3>
                            <p className="text-xs text-slate-500">Gemini-Verified structural audit</p>
                        </div>
                        <FixVerification />
                    </section>
                </div>
            </ScrollArea>

            {/* Right Sidebar */}
            <DashboardRightSidebar />
        </div>
    );
}
