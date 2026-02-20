"use client";

import React, { useState } from "react";
import {
    Map as MapIcon,
    MapPin,
    AlertCircle,
    Copy,
    ThumbsUp,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const mockClusters = [
    { id: 1, lat: "40.7128", long: "-74.0060", count: 4, type: "Roads" },
    { id: 2, lat: "40.7200", long: "-74.0100", count: 12, type: "Waste" },
    { id: 3, lat: "40.7150", long: "-73.9980", count: 2, type: "Safety" },
];

export function LiveIntelligenceFeed() {
    const [showSimilarityAlert, setShowSimilarityAlert] = useState(false);

    return (
        <div className="flex-1 h-full relative bg-slate-950 overflow-hidden">
            {/* Legend / Overlay */}
            <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-2xl">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">Live Feed Filters</h3>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 cursor-pointer hover:bg-amber-500/20">Roads</Badge>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 cursor-pointer hover:bg-emerald-500/20">Waste</Badge>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 cursor-pointer hover:bg-blue-500/20">Utilities</Badge>
                        <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 cursor-pointer hover:bg-rose-500/20">Safety</Badge>
                    </div>
                </div>
            </div>

            {/* Map Content */}
            <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
                {/* Mock Map Texture - Larger */}
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-74.006,40.7128,14,0/1200x800?access_token=pk.placeholder')] bg-cover opacity-40" />

                {/* Mock Clusters */}
                {mockClusters.map((cluster) => (
                    <motion.div
                        key={cluster.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        className="absolute cursor-pointer"
                        style={{ top: `${20 + cluster.id * 15}%`, left: `${30 + cluster.id * 10}%` }}
                        onClick={() => setShowSimilarityAlert(true)}
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-emerald-500/30 rounded-full animate-ping pointer-events-none" />
                            <div className="h-10 w-10 rounded-full bg-slate-900 border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-500 shadow-lg shadow-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                {cluster.count}
                            </div>
                            <Badge className="absolute -bottom-2 -right-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border-slate-700">
                                {cluster.type}
                            </Badge>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Similarity Alert Popup */}
            <AnimatePresence>
                {showSimilarityAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6"
                    >
                        <Card className="bg-slate-900/95 backdrop-blur-xl border-emerald-500/50 shadow-2xl overflow-hidden ring-1 ring-emerald-500/20">
                            <div className="bg-emerald-500 h-1.5 w-full" />
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/30">
                                        <AlertCircle className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                            Similarity Detected
                                            <Badge className="bg-emerald-500 text-slate-900">84% Match</Badge>
                                        </h4>
                                        <p className="text-sm text-slate-400">
                                            A pothole was reported here 2 hours ago. <strong>"Deep pothole at main crossing"</strong>.
                                        </p>
                                        <div className="flex gap-2 pt-2">
                                            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1" onClick={() => setShowSimilarityAlert(false)}>
                                                <ThumbsUp className="h-4 w-4 mr-2" />
                                                Upvote Existing
                                            </Button>
                                            <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 flex-1 hover:bg-slate-800" onClick={() => setShowSimilarityAlert(false)}>
                                                <Copy className="h-4 w-4 mr-2" />
                                                New Report
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-6 right-6">
                <Button variant="ghost" className="bg-slate-900/50 backdrop-blur-md border border-slate-700 text-slate-400 hover:text-white rounded-full px-4">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    2 New Feed Updates
                </Button>
            </div>
        </div>
    );
}
