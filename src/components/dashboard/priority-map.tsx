"use client";

import React, { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

const PriorityMapInner = dynamic<{ mapData: Array<{ id: string; lat: number; lng: number; status: string; category: string }> }>(
    () => import("./priority-map-inner"),
    {
        ssr: false,
        loading: () => (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900 border border-slate-800">
                <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            </div>
        )
    }
);

interface PriorityMapProps {
    mapData: Array<{ id: string; lat: number; lng: number; status: string; category: string }>;
}

export function PriorityMap({ mapData = [] }: PriorityMapProps) {
    const [isMounted, setIsMounted] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 group shadow-2xl">
            {isMounted && <PriorityMapInner mapData={mapData} />}

            {/* Priority Heatmap Overlay (UI Layer over map) */}
            <div className="absolute top-8 left-8 z-[400] w-64 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-5 rounded-2xl shadow-2xl pointer-events-none hidden md:block">
                <h3 className="text-lg font-bold text-white tracking-tight">{t('map.title')}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 mb-4">{t('map.location')}</p>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t('metrics.resolved')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t('metrics.pending')}</span>
                    </div>
                </div>
            </div>

            {/* Grid Overlay for futuristic look */}
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none z-[400]" />
        </div>
    );
}
