"use client";

import React from "react";
import { Plus, Minus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PriorityMap() {
    return (
        <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 group">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-74.006,40.7128,14,0/1200x800?access_token=pk.placeholder')] bg-cover opacity-40 brightness-50" />

            {/* Priority Heatmap Overlay */}
            <div className="absolute top-8 left-8 z-10 w-64 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-5 rounded-2xl shadow-2xl">
                <h3 className="text-lg font-bold text-white tracking-tight">Priority Heatmap</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 mb-4">Density Analysis • Central</p>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Stable</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Critical</span>
                    </div>
                </div>
            </div>

            {/* Mock Pins */}
            <div className="absolute top-[40%] left-[30%]">
                <div className="relative">
                    <div className="absolute inset-x-0 inset-y-0 bg-emerald-500/20 rounded-full animate-ping" />
                    <div className="h-4 w-4 rounded-full bg-emerald-500 border-4 border-slate-950 relative z-10 shadow-lg shadow-emerald-500/40" />
                </div>
            </div>
            <div className="absolute top-[60%] left-[45%]">
                <div className="relative">
                    <div className="absolute inset-x-0 inset-y-0 bg-amber-500/20 rounded-full animate-ping" />
                    <div className="h-4 w-4 rounded-full bg-amber-500 border-4 border-slate-950 relative z-10 shadow-lg shadow-amber-500/40" />
                </div>
            </div>
            <div className="absolute top-[35%] left-[65%]">
                <div className="relative">
                    <div className="absolute inset-x-0 inset-y-0 bg-rose-500/20 rounded-full animate-ping" />
                    <div className="h-4 w-4 rounded-full bg-rose-500 border-4 border-slate-950 relative z-10 shadow-lg shadow-rose-500/40" />
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 right-8 z-10 flex items-center gap-4">
                <div className="flex flex-row bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-white hover:bg-emerald-500/20">
                        <Plus className="h-4 w-4" />
                    </Button>
                    <div className="w-[1px] bg-slate-700/50" />
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-white hover:bg-emerald-500/20">
                        <Minus className="h-4 w-4" />
                    </Button>
                </div>

                <Button className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 text-white font-bold text-[10px] tracking-widest h-10 px-6 rounded-xl shadow-2xl hover:bg-emerald-500/20">
                    TIMELINE
                </Button>
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
        </div>
    );
}
