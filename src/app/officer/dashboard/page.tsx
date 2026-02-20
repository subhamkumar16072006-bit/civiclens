"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { OfficerStatCards } from "@/components/officer/stat-cards";
import { OfficerMap } from "@/components/officer/officer-map";
import { WorkQueueTable } from "@/components/officer/work-queue-table";
import { ShieldCheck, LogOut, Loader2, LayoutGrid } from "lucide-react";

export default function OfficerDashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [issues, setIssues] = useState<any[]>([]);
    const [stats, setStats] = useState({ pending: 0, highPriority: 0, resolvedToday: 0 });

    const fetchOfficerData = async () => {
        setLoading(true);
        try {
            const supabase = createClient();

            // 1. Verify Authentication & Role
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth");
                return;
            }

            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
            if (profile?.role !== 'officer') {
                router.push("/"); // Redirect citizens back to main dashboard
                return;
            }

            // 2. Fetch Issues
            const { data: allIssues, error } = await supabase
                .from('issues')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (allIssues) {
                setIssues(allIssues.filter(i => i.status !== 'resolved' && i.status !== 'rejected'));

                // Calculate Stats
                const pending = allIssues.filter(i => i.status !== 'resolved' && i.status !== 'rejected').length;
                const highPri = allIssues.filter(i => i.status !== 'resolved' && i.ai_score && i.ai_score > 75).length;

                // Extremely basic "Resolved Today" check based on updated_at
                const today = new Date().toISOString().split('T')[0];
                const resolvedToday = allIssues.filter(i => i.status === 'resolved' && i.updated_at.startsWith(today)).length;

                setStats({ pending, highPriority: highPri, resolvedToday });
            }
        } catch (err) {
            console.error("Officer Dashboard Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOfficerData();
    }, [router]);

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/auth");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Officer Top Navbar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                            <ShieldCheck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">CivicLens</span>
                            <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 tracking-widest uppercase align-middle">Authority</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-600 transition-colors"
                    >
                        Sign Out <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Operations Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage, verify, and resolve community reports.</p>
                </div>

                <OfficerStatCards
                    pendingCount={stats.pending}
                    highPriorityCount={stats.highPriority}
                    resolvedTodayCount={stats.resolvedToday}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Work Queue */}
                    <div className="lg:col-span-2">
                        <WorkQueueTable
                            issues={issues}
                            onRefresh={fetchOfficerData}
                        />
                    </div>

                    {/* Right Column: Live Map */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-800">Geospatial Overview</h3>
                        <OfficerMap mapData={issues} />
                        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-xs text-slate-500">
                            <p className="flex items-center gap-2 font-medium mb-1"><LayoutGrid className="h-4 w-4" /> Phase 2 Intelligence</p>
                            The map dynamically clusters active reports to help dispatch maintenance teams efficiently. Click any red pin for details.
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
