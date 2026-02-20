"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
    label: string;
    value: string;
    subValue?: string;
    trend?: string;
    trendColor?: string;
    status?: string;
    statusColor?: string;
}

export function MetricCard({ label, value, subValue, trend, trendColor, status, statusColor }: MetricCardProps) {
    return (
        <Card className="bg-slate-900 border-slate-800 p-6 flex-1 min-w-[200px]">
            <CardContent className="p-0 space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</h4>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-black text-white tracking-tight">{value}</h2>
                    {trend && <span className={cn("text-xs font-bold", trendColor)}>{trend}</span>}
                </div>
                <div className="flex items-center justify-between">
                    {subValue && <p className="text-xs text-slate-400 font-medium">{subValue}</p>}
                    {status && (
                        <div className="flex items-center gap-2">
                            <div className={cn("h-2 w-2 rounded-full animate-pulse", statusColor)} />
                            <span className={cn("text-xs font-bold uppercase tracking-wider", statusColor)}>{status}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
