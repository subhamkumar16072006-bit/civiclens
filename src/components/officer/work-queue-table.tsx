"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Navigation, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ResolutionModal } from "./resolution-modal";

interface TableIssue {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    ai_score: number | null;
    created_at: string;
    before_image: string | null;
}

interface WorkQueueProps {
    issues: TableIssue[];
    onRefresh: () => void;
}

export function WorkQueueTable({ issues, onRefresh }: WorkQueueProps) {
    const [selectedIssue, setSelectedIssue] = useState<TableIssue | null>(null);

    // Sort: High AI Score priority first, then newest
    const sortedIssues = [...issues].sort((a, b) => {
        const scoreA = a.ai_score || 0;
        const scoreB = b.ai_score || 0;
        if (scoreB !== scoreA) {
            return scoreB - scoreA;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden font-sans">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Prioritized Work Queue</h3>
                    <p className="text-sm text-slate-500 mt-1">Issues sorted by AI-detected severity.</p>
                </div>
                <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 shadow-sm">{issues.length} Pending</Badge>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 rounded-tl-xl w-24">Photo</th>
                            <th className="px-6 py-4">Report Details</th>
                            <th className="px-6 py-4 text-center">AI Severity</th>
                            <th className="px-6 py-4 rounded-tr-xl text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {sortedIssues.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <CheckCircle2 className="h-10 w-10 text-slate-300 mb-3" />
                                        <p className="text-base font-medium text-slate-700">All caught up!</p>
                                        <p className="text-sm">No pending issues in the queue.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            sortedIssues.map((issue) => (
                                <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors">
                                    {/* Thumbnail */}
                                    <td className="px-6 py-4">
                                        <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                            {issue.before_image ? (
                                                <img src={issue.before_image} alt="Issue" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">N/A</div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Details */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none capitalize text-[10px] font-bold tracking-widest px-2 py-0">
                                                {issue.category}
                                            </Badge>
                                            <span className="text-[10px] text-slate-400 font-mono">#{issue.id.slice(0, 8).toUpperCase()}</span>
                                        </div>
                                        <p className="font-bold text-slate-800 text-sm">{issue.title}</p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                            <span className="flex items-center gap-1"><Navigation className="h-3 w-3" /> Location Available</span>
                                            <span>• {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
                                        </div>
                                    </td>

                                    {/* AI Score */}
                                    <td className="px-6 py-4 text-center">
                                        {issue.ai_score ? (
                                            <div className="inline-flex items-center gap-2">
                                                <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold
                                                    ${issue.ai_score > 80 ? 'border-rose-200 bg-rose-50 text-rose-700' :
                                                        issue.ai_score > 50 ? 'border-amber-200 bg-amber-50 text-amber-700' :
                                                            'border-blue-200 bg-blue-50 text-blue-700'}
                                                `}>
                                                    {issue.ai_score}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-xs">-</span>
                                        )}
                                    </td>

                                    {/* Action Button */}
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            size="sm"
                                            onClick={() => setSelectedIssue(issue)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-medium h-9 px-4 rounded-lg"
                                        >
                                            <CheckCircle2 className="h-4 w-4 mr-1.5" />
                                            Verify Resolution
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ResolutionModal
                isOpen={!!selectedIssue}
                onClose={() => setSelectedIssue(null)}
                issue={selectedIssue}
                onVerified={onRefresh}
            />
        </div>
    );
}
