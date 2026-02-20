"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, MapPin } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const PriorityMapInner = dynamic(
    () => import("@/components/dashboard/priority-map-inner"),
    {
        ssr: false,
        loading: () => (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            </div>
        )
    }
);

interface MapData {
    id: string;
    lat: number;
    lng: number;
    status: string;
    category: string;
}

export function CommunityMap() {
    const [mapData, setMapData] = useState<MapData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMapData() {
            if (!isSupabaseConfigured()) { setLoading(false); return; }
            try {
                const res = await fetch("/api/issues?limit=500");
                const data = await res.json();
                if (data.issues) {
                    setMapData(data.issues.map((i: any) => ({
                        id: i.id,
                        lat: i.lat,
                        lng: i.lng,
                        status: i.status,
                        category: i.category
                    })));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchMapData();
    }, []);

    return (
        <div className="flex h-full bg-slate-950 overflow-hidden ml-[260px] relative">
            <div className="absolute top-8 left-8 z-[400] w-72 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl shadow-2xl pointer-events-none">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight">Community Map</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global View</p>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Resolved</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500">{mapData.filter(d => d.status === 'resolved').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Pending</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500">{mapData.filter(d => ['pending', 'ai_analyzing', 'validated'].includes(d.status)).length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Rejected</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500">{mapData.filter(d => d.status === 'rejected').length}</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                </div>
            ) : (
                <div className="w-full h-full z-0">
                    <PriorityMapInner mapData={mapData} />
                </div>
            )}

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none z-[400]" />
        </div>
    );
}
