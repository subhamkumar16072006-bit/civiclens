"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";

const leaders = [
    { id: 1, name: "Sarah J.", points: "4.2K PTS", img: "https://github.com/shadcn.png" },
    { id: 2, name: "David K.", points: "3.8K PTS", img: "https://github.com/shadcn.png" },
];

const activities = [
    { id: 1, text: "New report verified in Sector 7", time: "2m ago", status: "emerald" },
    { id: 2, text: "Maintenance team deployed to Oak St.", time: "15m ago", status: "slate" },
    { id: 3, text: "System sync completed", time: "42m ago", status: "slate" },
];

export function DashboardRightSidebar() {
    return (
        <div className="w-[340px] h-full flex flex-col gap-12 p-8 bg-slate-950/50 border-l border-slate-900 overflow-y-auto">
            {/* Civic Leaders */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Civic Leaders</h3>
                    <div className="h-4 w-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                        <Radio className="h-2 w-2 text-slate-500" />
                    </div>
                </div>

                <div className="space-y-4">
                    {leaders.map((leader, i) => (
                        <div key={leader.id} className="flex items-center gap-4 group cursor-pointer">
                            <span className="text-[10px] font-bold text-slate-700 font-mono">0{i + 1}</span>
                            <Avatar className="h-12 w-12 border-2 border-slate-800 group-hover:border-emerald-500 transition-colors">
                                <AvatarImage src={leader.img} />
                                <AvatarFallback>{leader.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="text-sm font-bold text-white">{leader.name}</h4>
                                <p className="text-[10px] text-emerald-500 font-bold tracking-wider">{leader.points}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <Button variant="outline" className="w-full bg-slate-900/50 border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest h-10 hover:text-white hover:border-slate-700">
                    VIEW ALL RANKINGS
                </Button>
            </section>

            {/* Live Activity */}
            <section className="space-y-6 flex-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Live Activity</h3>
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <Radio className="h-4 w-4 text-slate-700" />
                </div>

                <div className="relative space-y-8 pl-1">
                    {/* Vertical Line */}
                    <div className="absolute left-[3px] top-1 bottom-1 w-[1px] bg-slate-900" />

                    {activities.map((activity) => (
                        <div key={activity.id} className="relative flex gap-4">
                            <div className={cn(
                                "mt-1.5 h-1.5 w-1.5 rounded-full relative z-10",
                                activity.status === "emerald" ? "bg-emerald-500 shadow-[0_0_5px_emerald]" : "bg-slate-800"
                            )} />
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-300 leading-relaxed">{activity.text}</p>
                                <p className="text-[10px] text-slate-600 font-mono">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
