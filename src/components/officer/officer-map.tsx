"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const OfficerMapInner = dynamic(
    () => import("./officer-map-inner"),
    {
        ssr: false,
        loading: () => (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
        )
    }
);

interface OfficerMapProps {
    mapData: Array<{ id: string; lat: number; lng: number; category: string; ai_score: number | null }>;
}

export function OfficerMap({ mapData = [] }: OfficerMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="relative w-full h-[300px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
            {isMounted && <OfficerMapInner mapData={mapData} />}

            <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-sm border border-slate-200 p-3 rounded-lg shadow-sm pointer-events-none">
                <h3 className="text-sm font-bold text-slate-800">Pending Operations</h3>
                <div className="flex items-center gap-2 mt-2">
                    <div className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Action Required</span>
                </div>
            </div>
        </div>
    );
}
