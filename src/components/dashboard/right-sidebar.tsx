"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";

interface Leader {
    id: string;
    username: string;
    civic_credits: number;
    avatar_url: string;
}

interface ActivityItem {
    id: string;
    text: string;
    time: string;
    statusColor: string;
}

interface RightSidebarProps {
    leaders: Leader[];
    activity: ActivityItem[];
}

export function DashboardRightSidebar({ leaders = [], activity = [] }: RightSidebarProps) {
    const { t } = useLanguage();

    return (
        <div className="w-[340px] h-full flex flex-col gap-12 p-8 bg-slate-950/50 border-l border-slate-900 overflow-y-auto">
            {/* Civic Leaders */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">{t('nav.civic_leaders') || 'Civic Leaders'}</h3>
                    <div className="h-4 w-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                        <Radio className="h-2 w-2 text-slate-500" />
                    </div>
                </div>

                <div className="space-y-4">
                    {leaders.map((leader, i) => (
                        <div key={leader.id} className="flex items-center gap-4 group cursor-pointer">
                            <span className="text-[10px] font-bold text-slate-700 font-mono">0{i + 1}</span>
                            <Avatar className="h-12 w-12 border-2 border-slate-800 group-hover:border-emerald-500 transition-colors">
                                <AvatarImage src={leader.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.username}`} />
                                <AvatarFallback>{leader.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-white truncate">{leader.username}</h4>
                                <p className="text-[10px] text-emerald-500 font-bold tracking-wider">{leader.civic_credits} PTS</p>
                            </div>
                        </div>
                    ))}
                    {leaders.length === 0 && (
                        <p className="text-xs text-slate-500 text-center py-4">{t('nav.no_leaders') || 'No leaders yet.'}</p>
                    )}
                </div>

                <Button variant="outline" className="w-full bg-slate-900/50 border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest h-10 hover:text-white hover:border-slate-700">
                    {t('nav.view_all_rankings') || 'VIEW ALL RANKINGS'}
                </Button>
            </section>

            {/* Live Activity */}
            <section className="space-y-6 flex-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">{t('metrics.live_activity') || 'Live Activity'}</h3>
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <Radio className="h-4 w-4 text-slate-700" />
                </div>

                <div className="relative space-y-8 pl-1">
                    {/* Vertical Line */}
                    <div className="absolute left-[3px] top-1 bottom-1 w-[1px] bg-slate-900" />

                    {activity.map((act) => (
                        <div key={act.id} className="relative flex gap-4">
                            <div className={cn(
                                "mt-1.5 h-1.5 w-1.5 rounded-full relative z-10",
                                act.statusColor === "emerald" ? "bg-emerald-500 shadow-[0_0_5px_emerald]" : "bg-slate-800"
                            )} />
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-300 leading-relaxed">{act.text}</p>
                                <p className="text-[10px] text-slate-600 font-mono">{new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    ))}
                    {activity.length === 0 && (
                        <p className="text-xs text-slate-500 text-center py-4 relative z-10 bg-slate-950/50">No recent activity.</p>
                    )}
                </div>
            </section>
        </div>
    );
}
