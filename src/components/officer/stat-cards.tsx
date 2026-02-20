"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Copyleft as AlertTriangle, Clock, CheckCircle2 } from "lucide-react"; // Using Copyleft as fallback for AlertTriangle if missing, or just AlertCircle

interface StatCardsProps {
    pendingCount: number;
    highPriorityCount: number;
    resolvedTodayCount: number;
}

export function OfficerStatCards({ pendingCount, highPriorityCount, resolvedTodayCount }: StatCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Pending</p>
                        <h3 className="text-4xl font-black text-slate-900">{pendingCount}</h3>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <Clock className="h-7 w-7 text-blue-600" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white border-rose-100 shadow-sm ring-1 ring-rose-500/10">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-1">High Priority (AI)</p>
                        <h3 className="text-4xl font-black text-rose-700">{highPriorityCount}</h3>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                        <AlertTriangle className="h-7 w-7 text-rose-600" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white border-emerald-100 shadow-sm ring-1 ring-emerald-500/10">
                <CardContent className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-1">Resolved Today</p>
                        <h3 className="text-4xl font-black text-emerald-700">{resolvedTodayCount}</h3>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
