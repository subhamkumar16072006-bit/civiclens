"use client";

import React from "react";
import { Search, Bell, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
    return (
        <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-black text-white tracking-tight">Community Dashboard</h1>

            <div className="flex items-center gap-6">
                {/* Search */}
                <div className="relative w-64 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                    <Input
                        className="pl-10 bg-slate-900/50 border-slate-800 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50 text-xs text-white"
                        placeholder="Search sectors..."
                    />
                </div>

                {/* Weather/Info */}
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
                    <Sun className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-bold text-white tracking-wide">72°F Metro City</span>
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white relative group">
                    <Bell className="h-5 w-5" />
                    <div className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-emerald-500 border-2 border-slate-950 group-hover:animate-ping" />
                </Button>
            </div>
        </div>
    );
}
