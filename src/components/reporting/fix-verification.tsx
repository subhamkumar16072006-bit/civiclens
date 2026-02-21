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
import { useLanguage } from "@/components/providers/language-provider";

interface FixVerificationProps {
    activeFixes: any[];
}

export function FixVerification({ activeFixes }: FixVerificationProps) {
    const { t } = useLanguage();

    if (!activeFixes || activeFixes.length === 0) {
        return (
            <Card className="bg-slate-900 border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center p-10 h-64">
                <p className="text-slate-500 text-sm">{t('active.no_active_fixes')}</p>
            </Card>
        );
    }

    // We didn't seed after_images, so we use a placeholder that clearly shows it's fixed
    const fallbackAfterImage = "https://picsum.photos/seed/fixed_road_4/800/600";

    const getStatusLabel = (status: string) => {
        const map: Record<string, string> = {
            pending: t('status.pending'),
            ai_analyzing: t('status.analyzing'),
            validated: t('status.validated'),
            assigned: t('status.assigned'),
            in_progress: t('status.in_progress'),
            resolved: t('status.resolved'),
            rejected: t('status.rejected'),
        };
        return map[status.toLowerCase()] || status.replace('_', ' ').toUpperCase();
    };

    return (
        <div className="space-y-6">
            {activeFixes.map((fix) => {
                const { title, translated_title, before_image, ai_score, created_at, category, id, status } = fix;
                const shortId = id.substring(0, 8).toUpperCase();
                const timeReported = new Date(created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase();
                const isPending = status !== 'resolved';
                const displayTitle = translated_title || title;

                return (
                    <Card key={id} className="bg-slate-900 border-slate-800 overflow-hidden shadow-2xl">
                        <CardHeader className="border-b border-slate-800 bg-slate-900/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                        <ShieldCheck className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">{t('active.tracker_title')}</CardTitle>
                                        <p className="text-xs text-slate-400">{t('active.tracker_sub')}</p>
                                    </div>
                                </div>
                                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1 flex items-center gap-2">
                                    <Sparkles className="h-3 w-3 animate-pulse" />
                                    {getStatusLabel(status)}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                                {/* Divider Arrow */}
                                <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-slate-950 border border-slate-800 items-center justify-center text-amber-500 shadow-xl">
                                    <ArrowRight className="h-5 w-5" />
                                </div>

                                {/* Citizen Photo */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <User className="h-3 w-3" />
                                            {t('active.citizen_photo')}
                                        </h4>
                                        <span className="text-[10px] text-slate-600 font-mono">{timeReported}</span>
                                    </div>
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative group">
                                        <img src={before_image || "https://picsum.photos/seed/pothole_bad/800/600"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Citizen Report" />
                                        <div className="absolute top-3 left-3">
                                            <Badge className="bg-rose-500 text-white border-0 shadow-lg">REPORTED</Badge>
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/80 to-transparent">
                                            <p className="text-xs text-white line-clamp-1">"{displayTitle}"</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Authority Photo - Pending State */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Building2 className="h-3 w-3 text-amber-500" />
                                            {t('active.authority_action')}
                                        </h4>
                                        <span className="text-[10px] text-amber-500 font-mono">{t('active.pending_fix')}</span>
                                    </div>
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-950 relative group flex items-center justify-center">
                                        <div className="text-center space-y-4">
                                            <div className="h-12 w-12 rounded-full border border-dashed border-amber-500/50 flex items-center justify-center mx-auto text-amber-500/50 animate-pulse">
                                                <BrainCircuit className="h-6 w-6" />
                                            </div>
                                            <p className="text-xs text-slate-500">{t('active.awaiting_verification')}</p>
                                        </div>
                                        {/* Status Badge */}
                                        <div className="absolute top-3 left-3">
                                            <Badge className="bg-amber-500 text-slate-900 border-0 shadow-lg capitalize">{getStatusLabel(status)}</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                                <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                                    <BrainCircuit className="h-4 w-4 text-amber-500" />
                                </div>
                                <div className="space-y-1">
                                    <h5 className="text-sm font-bold text-amber-500">{t('active.ai_priority_score')}: {ai_score || 'N/A'}/10</h5>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        {t('active.issue_description', { category: category, status: getStatusLabel(status) })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

