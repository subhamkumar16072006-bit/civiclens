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
import { useLanguage } from "@/components/providers/language-provider";

interface DashboardData {
    stats: { total: number; resolved: number; pending: number; resolvedPct: string };
    mapData: Array<{ id: string; lat: number; lng: number; status: string; category: string }>;
    activeFixes: any[];
    leaders: Array<{ id: string; username: string; civic_credits: number; avatar_url: string }>;
    activity: Array<{ id: string; text: string; time: string; statusColor: string }>;
}

export function RedesignedDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        if (!isSupabaseConfigured()) return;
        fetch("/api/dashboard")
            .then(res => res.json())
            .then(d => {
                // Quick calculation for resolvedPct
                const pct = d.stats.total > 0 ? `${Math.round((d.stats.resolved / d.stats.total) * 100)}%` : "0%";
                setData({ ...d, stats: { ...d.stats, resolvedPct: pct } });
            })
            .catch(console.error);
    }, []);

    const totalLabel = data ? data.stats.total.toLocaleString("en-IN") : "—";
    const resolvedLabel = data ? data.stats.resolvedPct : "—";
    const subLabel = data ? t('header.welcome_user', { name: `${data.stats.pending} ${t('metrics.pending')}` }).replace(t('header.welcome_user', { name: '' }).trim(), '').trim() : "";
    // Wait, the above subLabel logic is messy. Let's just do:
    const pendingSubLabel = data ? `${data.stats.pending} ${t('metrics.pending')}` : "";

    return (
        <div className="flex h-full bg-slate-950 overflow-hidden ml-[260px]">
            {/* Main Center Content */}
            <ScrollArea className="flex-1 h-screen custom-scrollbar">
                <div className="max-w-6xl mx-auto p-10 space-y-10">
                    <DashboardHeader />

                    {/* Live Metrics Row */}
                    <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
                        <MetricCard
                            label={t('metrics.total_reported')}
                            value={totalLabel}
                            trend={data ? `${data.stats.resolved} ${t('metrics.resolved')}` : ""}
                            trendColor="text-emerald-500"
                        />
                        <MetricCard
                            label={t('metrics.resolution_rate')}
                            value={resolvedLabel}
                            subValue={pendingSubLabel}
                            trendColor="text-emerald-500"
                        />
                        <MetricCard
                            label={t('metrics.system_health')}
                            value={t('metrics.optimal')}
                            status={t('metrics.live')}
                            statusColor="text-emerald-500"
                        />
                    </div>

                    {/* Map Section */}
                    <PriorityMap mapData={data?.mapData || []} />

                    {/* Live Reports Table */}
                    <ReportsTable />

                    {/* Fix Verification */}
                    <section className="space-y-6 pt-10 border-t border-slate-900">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">{t('active.section_title')}</h3>
                            <p className="text-xs text-slate-500">{t('active.section_sub')}</p>
                        </div>
                        <FixVerification activeFixes={data?.activeFixes || []} />
                    </section>
                </div>
            </ScrollArea>

            {/* Right Sidebar */}
            <DashboardRightSidebar leaders={data?.leaders || []} activity={data?.activity || []} />
        </div>
    );
}
