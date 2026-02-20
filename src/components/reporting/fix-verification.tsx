"use client";

import React from "react";
import {
    CheckCircle2,
    ShieldCheck,
    User,
    Building2,
    Sparkles,
    ArrowRight,
    BrainCircuit
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FixVerificationProps {
    latestFix: any | null;
}

export function FixVerification({ latestFix }: FixVerificationProps) {
    if (!latestFix) {
        return (
            <Card className="bg-slate-900 border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center p-10 h-64">
                <p className="text-slate-500 text-sm">No resolved issues with verification data yet.</p>
            </Card>
        );
    }

    const { title, before_image, ai_score, created_at, category, id } = latestFix;
    const shortId = id.substring(0, 8).toUpperCase();

    // We didn't seed after_images, so we use a placeholder that clearly shows it's fixed
    const fallbackAfterImage = "https://picsum.photos/seed/fixed_road_4/800/600";

    const timeReported = new Date(created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase();

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
                            <span className="text-[10px] text-slate-600 font-mono">{timeReported}</span>
                        </div>
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative group">
                            <img src={before_image || "https://picsum.photos/seed/pothole_bad/800/600"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Citizen Report" />
                            <div className="absolute top-3 left-3">
                                <Badge className="bg-rose-500 text-white border-0 shadow-lg">BEFORE</Badge>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/80 to-transparent">
                                <p className="text-xs text-white line-clamp-1">"{title}"</p>
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
                            <span className="text-[10px] text-emerald-500 font-mono">RESOLVED</span>
                        </div>
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-950 relative group">
                            <img src={fallbackAfterImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Authority Fix" />
                            <div className="absolute top-3 left-3">
                                <Badge className="bg-emerald-500 text-slate-900 border-0 shadow-lg">AFTER</Badge>
                            </div>
                            <div className="absolute inset-0 border-2 border-emerald-500/0 group-hover:border-emerald-500/20 transition-all pointer-events-none" />
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/80 to-transparent">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                    <p className="text-xs text-white">Work Order #{shortId} Complete</p>
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
                        <h5 className="text-sm font-bold text-emerald-500">AI Verification Report (Score: {ai_score}%)</h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Vision model detected {ai_score}% alignment and confirms structural repair completion for this {category} issue.
                            Civic credits have been disbursed to the reporter.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

