"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, MapPin, CheckCircle2, ShieldAlert, FileSearch, ArrowRightCircle } from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div style="height:12px;width:12px;background-color:#10b981;border:2px solid white;border-radius:50%;box-shadow:0 0 10px rgba(16,185,129,0.5)"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

export default function PublicIssueTracker() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [issue, setIssue] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchIssue() {
            try {
                const res = await fetch(`/api/issues/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Issue not found");

                // Sort ledger client side to ensure chronological order
                if (data.issue?.audit_ledger) {
                    data.issue.audit_ledger.sort((a: any, b: any) =>
                        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                    );
                }

                setIssue(data.issue);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchIssue();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-500"><Loader2 className="animate-spin w-8 h-8" /></div>;
    if (error || !issue) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-rose-500">{error || "Issue not found"}</div>;

    const IconForAction = (action: string, newStatus: string) => {
        if (action === 'ISSUE_CREATED') return <MapPin className="w-5 h-5" />;
        if (action === 'AI_ANALYSIS') return <FileSearch className="w-5 h-5" />;
        if (newStatus === 'resolved') return <CheckCircle2 className="w-5 h-5" />;
        if (newStatus === 'rejected') return <ShieldAlert className="w-5 h-5" />;
        return <ArrowRightCircle className="w-5 h-5" />;
    };

    const ColorForAction = (action: string, newStatus: string) => {
        if (action === 'ISSUE_CREATED') return "bg-blue-500/20 text-blue-400 border-blue-500/30";
        if (action === 'AI_ANALYSIS') return "bg-purple-500/20 text-purple-400 border-purple-500/30";
        if (newStatus === 'resolved') return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
        if (newStatus === 'rejected') return "bg-rose-500/20 text-rose-400 border-rose-500/30";
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    };

    return (
        <div className="min-h-screen bg-[#050B14] text-slate-300 font-sans selection:bg-emerald-500/30">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-[#050B14]/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => router.push('/')} className="hover:bg-slate-800 text-slate-300">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to App
                    </Button>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Live Tracking</span>
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-20 px-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left Col: Issue Details & Evidence */}
                <div className="space-y-6">
                    <div>
                        <Badge className="bg-slate-800 text-slate-400 border-none mb-3 lowercase tracking-wider">
                            #{issue.id.slice(0, 8)}
                        </Badge>
                        <h1 className="text-3xl font-black text-white leading-tight">{issue.title}</h1>
                        <p className="text-slate-500 mt-2 text-sm">{issue.description || "No description provided."}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Category</p>
                            <p className="font-medium text-slate-300 capitalize">{issue.category}</p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Risk Score</p>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-white">{issue.risk_score || "N/A"}</span>
                                <span className="text-xs text-slate-500">/ 10</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Evidence</h3>
                        <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative group">
                            {issue.before_image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={issue.before_image} alt="Report evidence" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-600">No Image Uploaded</div>
                            )}
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-widest">
                                BEFORE
                            </div>
                        </div>

                        {issue.after_image && (
                            <div className="aspect-video bg-emerald-950/20 rounded-2xl overflow-hidden border border-emerald-900/30 relative group mt-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={issue.after_image} alt="Resolution evidence" className="w-full h-full object-cover" />
                                <div className="absolute top-3 left-3 bg-emerald-500/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-widest">
                                    VERIFIED FIXED
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-48 w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
                        <MapContainer
                            center={[issue.lat, issue.lng]}
                            zoom={16}
                            className="w-full h-full"
                            zoomControl={false}
                            attributionControl={false}
                            dragging={false}
                        >
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                            <Marker position={[issue.lat, issue.lng]} icon={customIcon} />
                        </MapContainer>
                    </div>
                </div>

                {/* Right Col: Transparency Timeline */}
                <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl">
                    <div className="mb-8">
                        <h2 className="text-lg font-black text-white">Transparency Timeline</h2>
                        <p className="text-xs text-slate-500 mt-1">Immutable public audit ledger</p>
                    </div>

                    <div className="relative border-l border-slate-800 ml-5 space-y-8 pb-4">
                        {issue.audit_ledger?.map((log: any, idx: number) => {
                            const isLast = idx === issue.audit_ledger.length - 1;
                            const d = new Date(log.timestamp);
                            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

                            return (
                                <div key={log.id} className="relative pl-8">
                                    {/* Line glowing effect for active */}
                                    {isLast && (
                                        <div className="absolute -left-[1px] top-0 w-[2px] h-full bg-emerald-500/30" />
                                    )}

                                    {/* Node */}
                                    <div className={`absolute -left-[18px] top-0 w-9 h-9 rounded-full border-2 flex items-center justify-center bg-slate-950 ${ColorForAction(log.action, log.new_status)}`}>
                                        {IconForAction(log.action, log.new_status)}
                                    </div>

                                    <div>
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <h4 className="text-sm font-bold text-white capitalize">
                                                {log.new_status.replace('_', ' ')}
                                            </h4>
                                            <span className="text-[10px] font-mono text-slate-500">{dateStr} • {timeStr}</span>
                                        </div>

                                        {log.action === 'ISSUE_CREATED' && (
                                            <p className="text-xs text-slate-400">Reported via CivicLens by Citizen</p>
                                        )}

                                        {log.action === 'AI_ANALYSIS' && log.metadata && (
                                            <div className="mt-2 bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                                                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Gemini AI Assessment</p>
                                                <p className="text-xs text-slate-300 italic">"{log.metadata.summary}"</p>
                                                {log.metadata.risk_reasoning && (
                                                    <p className="text-xs text-slate-400 mt-2 border-t border-purple-500/20 pt-2">Reasoning: {log.metadata.risk_reasoning}</p>
                                                )}
                                            </div>
                                        )}

                                        {log.action === 'STATUS_CHANGE' && log.metadata?.note && (
                                            <p className="text-xs text-slate-400 mt-1">{log.metadata.note}</p>
                                        )}

                                        {log.action === 'STATUS_CHANGE' && log.new_status === 'resolved' && (
                                            <p className="text-xs text-emerald-400 mt-1 font-medium">Issue marked as resolved by municipal team.</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </main>
        </div>
    );
}
