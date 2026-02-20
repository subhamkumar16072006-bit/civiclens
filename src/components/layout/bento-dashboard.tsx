"use client";

import React from "react";
import {
    TrendingUp,
    ShieldCheck,
    Map as MapIcon,
    Users,
    Zap,
    ArrowUpRight,
    Leaf,
    CheckCircle2,
    ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function BentoDashboard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-6 md:grid-rows-3 gap-6 h-full p-8 ml-20 bg-background text-foreground overflow-y-auto">
            {/* Real-time Safety Heatmap - Large Card */}
            <Card className="md:col-span-3 md:row-span-2 bg-slate-900 border-slate-800 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50" />
                <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <MapIcon className="text-emerald-500" />
                                Real-time Safety Heatmap
                            </CardTitle>
                            <CardDescription className="text-slate-400">Live intelligence feed from 124 active sensors and community reports</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse">
                            LIVE
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center relative z-10">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        {/* Mock Map Texture */}
                        <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-74.006,40.7128,12,0/800x600?access_token=pk.placeholder')] bg-cover grayscale" />
                    </div>
                    <div className="space-y-4 text-center">
                        <div className="inline-block p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <Zap className="h-12 w-12 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-semibold">Active Intelligence View</h3>
                        <p className="text-slate-400 max-w-sm">
                            Click to drill down into specific zones or historical safety trends.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Your Impact Card */}
            <Card className="md:col-span-1 md:row-span-1 bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-colors">
                <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <TrendingUp className="text-emerald-500 h-5 w-5" />
                        Your Impact
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-end justify-between">
                        <div className="space-y-1">
                            <p className="text-sm text-slate-400">Safety Index improved</p>
                            <h4 className="text-3xl font-bold text-white">+14.2%</h4>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <ArrowUpRight className="text-emerald-500" />
                        </div>
                    </div>
                    <div className="pt-4 border-t border-slate-800 flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                            <Leaf className="h-3 w-3" />
                            1.2t CO2 Offset
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
                            <ShieldCheck className="h-3 w-3" />
                            42 Reports Verified
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Community Wins */}
            <Card className="md:col-span-1 md:row-span-2 bg-slate-900 border-slate-800 overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-500 h-5 w-5" />
                        Community Wins
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                    <div className="space-y-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="px-6 py-3 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors cursor-pointer group">
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mt-0.5 shrink-0">
                                        <Zap className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-200 line-clamp-1">Downtown Pothole Sealed</p>
                                        <p className="text-xs text-slate-500">Verified by AI in 14 mins</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-700 ml-auto group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4">
                        <Button variant="ghost" className="w-full text-xs text-slate-400 hover:text-white">View All Resolutions</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Top Contributors Leaderboard */}
            <Card className="md:col-span-2 md:row-span-1 bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Users className="text-emerald-500 h-5 w-5" />
                        Top Contributors
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {[
                            { name: "Alex R.", credits: "14.2k", rank: 1, img: "AR" },
                            { name: "Sarah K.", credits: "12.8k", rank: 2, img: "SK" },
                            { name: "Jordan M.", credits: "11.5k", rank: 3, img: "JM" },
                            { name: "Priya V.", credits: "9.2k", rank: 4, img: "PV" },
                        ].map((u) => (
                            <div key={u.rank} className="flex flex-col items-center gap-2 min-w-[100px] shrink-0 p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                                <div className="relative">
                                    <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-500 border border-emerald-500/30">
                                        {u.img}
                                    </div>
                                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-slate-900 font-bold">
                                        #{u.rank}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-white">{u.name}</p>
                                    <p className="text-xs text-emerald-500">{u.credits}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Metrics Card */}
            <Card className="md:col-span-1 md:row-span-1 bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Total Credits Earned</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-1">
                        <h4 className="text-4xl font-black text-white tracking-tight">1,250</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">COMMUNITY HERO</span>
                        </div>
                        <div className="mt-4 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-emerald-500"
                            />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 italic">Next Rank: Urban Guardian (1,500 pts)</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
