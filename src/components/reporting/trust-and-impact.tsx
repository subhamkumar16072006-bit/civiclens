"use client";

import React from "react";
import {
    CheckCircle2,
    Clock,
    BrainCircuit,
    Users,
    ArrowRight,
    Trophy,
    History,
    Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const timelineEntries = [
    { id: 1, label: "Report Received", status: "complete", date: "10:14 AM", icon: CheckCircle2 },
    { id: 2, label: "AI Analyzing...", status: "active", date: "Processing", icon: BrainCircuit },
    { id: 3, label: "Community Validated", status: "pending", date: "TBD", icon: Users },
    { id: 4, label: "Assigned to Dept", status: "pending", date: "TBD", icon: History },
];

export function TrustAndImpact() {
    return (
        <div className="w-[300px] h-full bg-slate-900/50 border-l border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
            {/* Transparency Timeline */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transparency Phase</h3>
                    <Badge variant="outline" className="text-[9px] text-emerald-500 border-emerald-500/30">ID: #CX-9021</Badge>
                </div>

                <div className="relative space-y-6 pl-1">
                    {/* Vertical Line */}
                    <div className="absolute left-3 top-2 bottom-2 w-[1px] bg-slate-800" />

                    {timelineEntries.map((entry, i) => (
                        <div key={entry.id} className="relative flex gap-3 group">
                            <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 ${entry.status === 'complete' ? 'bg-emerald-500 text-slate-900' :
                                entry.status === 'active' ? 'bg-emerald-500/20 text-emerald-500 ring-4 ring-emerald-500/5' :
                                    'bg-slate-800 text-slate-500'
                                }`}>
                                <entry.icon className={`h-3 w-3 ${entry.status === 'active' ? 'animate-pulse' : ''}`} />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className={`text-xs font-bold ${entry.status !== 'pending' ? 'text-white' : 'text-slate-500'}`}>
                                        {entry.label}
                                    </p>
                                    <span className="text-[9px] text-slate-500 font-mono">{entry.date}</span>
                                </div>
                                {entry.status === 'active' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-1 text-[10px] text-slate-400 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50"
                                    >
                                        Comparing with 4 historical reports... Duplicate probability: 12%
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Civic Credits Card - Gamified */}
            <Card className="bg-gradient-to-br from-indigo-500/10 via-slate-900 to-emerald-500/10 border-slate-700/50 overflow-hidden relative group">
                <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
                <CardHeader className="pb-1 pt-4 px-4">
                    <CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Trophy className="h-3 w-3 text-amber-500" />
                        Community Status
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4 pt-0">
                    <div>
                        <div className="flex items-baseline justify-between mb-1">
                            <h4 className="text-xl font-black text-white tracking-tight">1,250</h4>
                            <Badge className="bg-emerald-500 text-slate-900 font-bold px-2 py-0 text-[10px]">HERO</Badge>
                        </div>
                        <p className="text-[10px] text-slate-400">Lifetime Civic Credits</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400">Progress to next tier</span>
                            <span className="text-emerald-500 font-bold">84%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "84%" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                            />
                        </div>
                    </div>

                    <Button variant="outline" className="w-full bg-slate-800/50 border-slate-700 text-white text-[10px] h-8 hover:bg-emerald-500 hover:text-slate-900 transition-all group">
                        View Rewards Store
                        <ArrowRight className="ml-1.5 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </CardContent>
            </Card>

            {/* Active Impact */}
            <div className="mt-auto space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Global Impact</h3>
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-800/30 border border-slate-800">
                        <Zap className="h-3.5 w-3.5 text-amber-500 mb-1.5" />
                        <p className="text-base font-bold text-white leading-none">4.2k</p>
                        <p className="text-[9px] text-slate-500 mt-1 uppercase">Issues Fixed</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/30 border border-slate-800">
                        <Users className="h-3.5 w-3.5 text-emerald-500 mb-1.5" />
                        <p className="text-base font-bold text-white leading-none">12M</p>
                        <p className="text-[9px] text-slate-500 mt-1 uppercase">Civic Points</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
