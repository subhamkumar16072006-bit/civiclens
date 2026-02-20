"use client";

import React from "react";
import {
    CheckCircle2,
    ShieldCheck,
    User,
    Building2,
    Sparkles,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function FixVerification() {
    return (
        <Card className="bg-slate-900 border-slate-800 overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-slate-800 bg-slate-900/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <ShieldCheck className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold">Fix Verification UI</CardTitle>
                            <p className="text-xs text-slate-400">Comparing citizen report vs. authority resolution</p>
                        </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 flex items-center gap-2">
                        <Sparkles className="h-3 w-3 animate-pulse" />
                        Gemini-Verified
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    {/* Divider Arrow */}
                    <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-slate-950 border border-slate-800 items-center justify-center text-emerald-500 shadow-xl">
                        <ArrowRight className="h-5 w-5" />
                    </div>

                    {/* Citizen Photo */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <User className="h-3 w-3" />
                                Citizen Photo
                            </h4>
                            <span className="text-[10px] text-slate-600 font-mono">OCT 12, 09:42 AM</span>
                        </div>
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative group">
                            <img src="https://picsum.photos/seed/pothole_bad/800/600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Citizen Report" />
                            <div className="absolute top-3 left-3">
                                <Badge className="bg-rose-500 text-white border-0 shadow-lg">BEFORE</Badge>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/80 to-transparent">
                                <p className="text-xs text-white line-clamp-1">"Severe structure failure at 4th Ave..."</p>
                            </div>
                        </div>
                    </div>

                    {/* Authority Photo */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Building2 className="h-3 w-3 text-emerald-500" />
                                Authority Verified
                            </h4>
                            <span className="text-[10px] text-emerald-500 font-mono">OCT 14, 02:15 PM</span>
                        </div>
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-950 relative group">
                            <img src="https://picsum.photos/seed/pothole_fixed/800/600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Authority Fix" />
                            <div className="absolute top-3 left-3">
                                <Badge className="bg-emerald-500 text-slate-900 border-0 shadow-lg">AFTER</Badge>
                            </div>
                            <div className="absolute inset-0 border-2 border-emerald-500/0 group-hover:border-emerald-500/20 transition-all pointer-events-none" />
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/80 to-transparent">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                    <p className="text-xs text-white">Work Order #WO-881 Complete</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <BrainCircuit className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="space-y-1">
                        <h5 className="text-sm font-bold text-emerald-500">AI Verification Report</h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Vision model detected 98.4% coordinate alignment and confirms structural repair completion.
                            Civic credits have been disbursed to the reporter and verifying officers.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

import { BrainCircuit } from "lucide-react";
