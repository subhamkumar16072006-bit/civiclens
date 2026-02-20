"use client";

import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, BrainCircuit, CheckCircle2 } from "lucide-react";

interface DocumentIssue {
    id: string;
    title: string;
    before_image: string | null;
}

interface ResolutionModalProps {
    isOpen: boolean;
    onClose: () => void;
    issue: DocumentIssue | null;
    onVerified: () => void; // Callback to refresh table after success
}

export function ResolutionModal({ isOpen, onClose, issue, onVerified }: ResolutionModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "uploading" | "verifying" | "success" | "rejected" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset state when modal opens/closes
    React.useEffect(() => {
        if (!isOpen) {
            setFile(null);
            setPreview(null);
            setStatus("idle");
            setErrorMsg(null);
        }
    }, [isOpen]);

    if (!issue) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setStatus("idle");
            setErrorMsg(null);
        }
    };

    const handleVerify = async () => {
        if (!file) {
            setErrorMsg("Please upload an 'After' photo first.");
            return;
        }

        setStatus("uploading");
        setErrorMsg(null);

        try {
            // 1. Upload After image to Supabase
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();

            const fileExt = file.name.split('.').pop();
            const fileName = `after_${issue.id}_${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('issue-images')
                .upload(fileName, file);

            if (uploadError) throw new Error("Failed to upload image. Did you run the setup-storage.sql script?");

            const { data: urlData } = supabase.storage
                .from('issue-images')
                .getPublicUrl(fileName);

            const afterImageUrl = urlData.publicUrl;

            // 2. Call Gemini API for Verification
            setStatus("verifying");

            const verifyRes = await fetch(`/api/issues/${issue.id}/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ after_image: afterImageUrl })
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
                throw new Error(verifyData.error || "Verification API failed");
            }

            if (verifyData.verified) {
                setStatus("success");
                setTimeout(() => {
                    onVerified();
                    onClose();
                }, 2000);
            } else {
                setStatus("rejected");
                setErrorMsg("Gemini AI determined the issue is NOT fixed in this photo.");
            }

        } catch (err: any) {
            console.error(err);
            setStatus("error");
            setErrorMsg(err.message || "An unexpected error occurred.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-white border-slate-200 shadow-2xl p-0 overflow-hidden font-sans rounded-2xl">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                            Verify Resolution
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-sm">
                            Upload a photo of the completed work for #{issue.id.slice(0, 8).toUpperCase()} - {issue.title}. Gemini 1.5 Flash will verify the fix.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    {status === "success" ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="h-20 w-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10 text-emerald-600 animate-bounce" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Verification Passed!</h3>
                                <p className="text-sm text-slate-500 mt-2 max-w-sm">Gemini AI confirmed the repair. The reporter has been awarded Civic Credits.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Comparison View */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Before (Reported)</p>
                                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                        {issue.before_image ? (
                                            <img src={issue.before_image} alt="Before" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Image</div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">After (Upload)</p>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`aspect-[4/3] rounded-xl overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-colors ${preview ? 'border-0' : 'border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300'
                                            }`}
                                    >
                                        {preview ? (
                                            <img src={preview} alt="After" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <UploadCloud className="h-8 w-8 text-blue-400 mb-2" />
                                                <span className="text-xs font-medium text-blue-600">Click to upload photo</span>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/jpeg,image/png,image/webp,image/heic"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            {/* Status Messages */}
                            {status === "uploading" && (
                                <p className="text-xs text-blue-600 font-medium flex items-center gap-2 bg-blue-50 p-3 rounded-lg"><Loader2 className="h-4 w-4 animate-spin" /> Uploading image sequence...</p>
                            )}
                            {status === "verifying" && (
                                <p className="text-xs text-indigo-600 font-medium flex items-center gap-2 bg-indigo-50 p-3 rounded-lg"><BrainCircuit className="h-4 w-4 animate-pulse" /> Gemini Vision 1.5 Flash analyzing structures...</p>
                            )}
                            {status === "rejected" && (
                                <p className="text-xs text-rose-600 font-medium bg-rose-50 p-3 rounded-lg border border-rose-100">{errorMsg}</p>
                            )}
                            {status === "error" && (
                                <p className="text-xs text-rose-600 font-medium bg-rose-50 p-3 rounded-lg border border-rose-100">{errorMsg}</p>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <Button variant="outline" onClick={onClose} disabled={status === "uploading" || status === "verifying"}>Cancel</Button>
                                <Button
                                    onClick={handleVerify}
                                    disabled={!file || status === "uploading" || status === "verifying"}
                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                                >
                                    {(status === "uploading" || status === "verifying") ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify with AI"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
