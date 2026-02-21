"use client";

import React, { useState, useRef, useCallback } from "react";
import {
    Construction, Trash2, Zap, ShieldAlert, TreePine,
    Upload, ChevronRight, ChevronLeft, X, PlusCircle,
    AlertTriangle, Loader2, CheckCircle2, MapPin, Navigation
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/hooks/use-auth";
import { MapComponent, type MapSelection } from "@/components/reporting/map-component";

const categories = [
    { id: "roads", label: "Roads", icon: Construction, color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: "waste", label: "Waste", icon: Trash2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: "utilities", label: "Utilities", icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "safety", label: "Safety", icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10" },
    { id: "environment", label: "Environment", icon: TreePine, color: "text-green-500", bg: "bg-green-500/10" },
];

type SubmitState = "idle" | "loading" | "success" | "error";

export function ReportingEngine() {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [address, setAddress] = useState<string>("");
    const [geoLoading, setGeoLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
    const [submitState, setSubmitState] = useState<SubmitState>("idle");
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [createdIssueId, setCreatedIssueId] = useState<string | null>(null);
    const [duplicateIgnored, setDuplicateIgnored] = useState(false);
    const [duplicateData, setDuplicateData] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getLocation = () => {
        if (!navigator.geolocation) return;
        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords: c }) => {
                setCoords({ lat: c.latitude, lng: c.longitude });
                setGeoLoading(false);
            },
            () => {
                // Fallback mock coords for demo
                setCoords({ lat: 28.6139, lng: 77.2090 });
                setGeoLoading(false);
            }
        );
    };

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const newFiles = files.slice(0, 3 - images.length);
        setImages(prev => [...prev, ...newFiles]);
        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = ev => setPreviews(prev => [...prev, ev.target?.result as string]);
            reader.readAsDataURL(file);
        });
    }, [images]);

    const removeImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
        setPreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const nextStep = () => {
        if (step === 1 && !selectedCategory) return;
        setStep(s => Math.min(s + 1, 3));
    };
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleLocationSelect = useCallback((sel: MapSelection) => {
        setCoords({ lat: sel.lat, lng: sel.lng });
        setAddress(sel.formatted || sel.address || "");
    }, []);

    const handleSubmit = async () => {
        if (!user) { setSubmitError("You must be signed in to report."); return; }
        if (!selectedCategory || !title.trim() || !coords) {
            setSubmitError("Category, title, and location are required."); return;
        }

        setSubmitState("loading");
        setSubmitError(null);

        if (!duplicateIgnored) {
            const dupFormData = new FormData();
            dupFormData.append("lat", String(coords.lat));
            dupFormData.append("lng", String(coords.lng));
            if (images[0]) dupFormData.append("image", images[0]);

            try {
                const dupRes = await fetch("/api/issues/check-duplicate", { method: "POST", body: dupFormData });
                const dupData = await dupRes.json();

                if (dupData.isDuplicate && dupData.existingIssue) {
                    setDuplicateData(dupData.existingIssue);
                    setShowDuplicateDialog(true);
                    setSubmitState("idle");
                    return;
                }
            } catch (err) {
                console.error("Duplicate check failed, logging and proceeding.", err);
            }
        }

        const formData = new FormData();
        formData.append("category", selectedCategory);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("lat", String(coords.lat));
        formData.append("lng", String(coords.lng));
        if (address) formData.append("address", address);
        if (images[0]) formData.append("image", images[0]);
        if (duplicateIgnored) formData.append("ignore_duplicate", "true");

        try {
            const res = await fetch("/api/issues", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Submission failed");

            // Handle successful merge or new issue
            if (data.isDuplicateMerged) {
                setCreatedIssueId(data.issue?.id ?? "MERGED");
                setSubmitState("success"); // We can use the same success screen or add a property, let's just use success
            } else {
                setCreatedIssueId(data.issue?.id ?? null);
                setSubmitState("success");
            }
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Unknown error");
            setSubmitState("error");
        }
    };

    // Success state
    if (submitState === "success") {
        const isMerged = createdIssueId === "MERGED";
        return (
            <div className="flex flex-col h-full bg-slate-900 border-x border-slate-800 items-center justify-center p-8 text-center gap-6">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                    <div className={cn("h-20 w-20 rounded-full flex items-center justify-center mx-auto border",
                        isMerged ? "bg-amber-500/20 border-amber-500/30" : "bg-emerald-500/20 border-emerald-500/30"
                    )}>
                        {isMerged ? (
                            <AlertTriangle className="h-10 w-10 text-amber-500" />
                        ) : (
                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        )}
                    </div>
                </motion.div>
                <div>
                    <h2 className="text-xl font-black text-white">
                        {isMerged ? "Report Merged!" : "Report Submitted!"}
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                        {isMerged
                            ? "This reported issue was already in our system. We have merged your report to boost its priority!"
                            : "Gemini AI is analyzing your evidence now."}
                    </p>
                    {createdIssueId && !isMerged && <p className="text-xs text-slate-600 font-mono mt-3">ID: {createdIssueId}</p>}
                    {isMerged && <Badge className="mt-3 bg-amber-500/20 text-amber-500 hover:bg-amber-500/30">Priority Increased</Badge>}
                </div>
                <div className="flex flex-col gap-3 w-full max-w-xs mx-auto mt-4">
                    {createdIssueId && !isMerged && (
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full"
                            onClick={() => window.open(`/issues/${createdIssueId}`, '_blank')}
                        >
                            Track Your Issue
                        </Button>
                    )}
                    <Button
                        className={cn("text-slate-950 font-bold",
                            isMerged ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600"
                        )}
                        onClick={() => {
                            setStep(1); setSelectedCategory(null); setTitle(""); setDescription("");
                            setCoords(null); setImages([]); setPreviews([]); setSubmitState("idle");
                            setCreatedIssueId(null); setAddress(""); setDuplicateIgnored(false); setDuplicateData(null);
                        }}
                    >
                        Submit Another
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-900 border-x border-slate-800 p-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-white leading-tight">Reporting Engine</h2>
                    <p className="text-xs text-slate-400">
                        Step {step} of 3 • {step === 1 ? "Categorize" : step === 2 ? "Locate" : "Evidence"}
                    </p>
                </div>
                <div className="flex gap-1.5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={cn("h-1 w-6 rounded-full transition-all duration-300", i <= step ? "bg-emerald-500" : "bg-slate-800")} />
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="wait">
                    {/* ── STEP 1: Category + Title ── */}
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Select Category</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {categories.map((cat) => (
                                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-300 group relative overflow-hidden",
                                            selectedCategory === cat.id
                                                ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/50"
                                                : "border-slate-800 bg-slate-800/20 hover:border-slate-700"
                                        )}>
                                        <cat.icon className={cn("h-7 w-7 mb-2 transition-transform duration-300 group-hover:scale-110", cat.color)} />
                                        <span className="text-xs font-medium text-slate-200">{cat.label}</span>
                                        {selectedCategory === cat.id && <motion.div layoutId="activeCat" className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500" />}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-3 pt-2">
                                <Input
                                    type="text"
                                    placeholder="Report title (e.g. Deep pothole on Main St.)"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 h-10 text-sm"
                                />
                                <textarea
                                    placeholder="Optional description..."
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 resize-none"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 2: Interactive Map ── */}
                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Pin Location</h3>

                            {/* Real interactive Leaflet map */}
                            <MapComponent onLocationSelect={handleLocationSelect} />

                            {/* Address result */}
                            {address && (
                                <motion.div
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3"
                                >
                                    <MapPin className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-emerald-400">Pinned Location</p>
                                        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{address}</p>
                                        {coords && (
                                            <p className="text-[10px] text-slate-500 font-mono mt-1">
                                                {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {!address && (
                                <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
                                    <Navigation className="h-3 w-3" />
                                    Click anywhere on the map to pin the issue location
                                </p>
                            )}
                        </motion.div>
                    )}

                    {/* ── STEP 3: Evidence Upload ── */}
                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Evidence Upload</h3>

                            <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFileChange} />

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer group"
                            >
                                <div className="h-14 w-14 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                    <Upload className="h-7 w-7 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-sm">Drag & drop or click</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">PNG, JPG up to 10MB</p>
                                </div>
                            </div>

                            {previews.length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                    {previews.map((src, i) => (
                                        <div key={i} className="aspect-square rounded-xl bg-slate-800 border border-slate-700 relative group overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={src} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt="Preview" />
                                            <Button variant="ghost" size="icon" onClick={() => removeImage(i)}
                                                className="h-6 w-6 absolute top-1 right-1 rounded-full bg-slate-900/80 hover:bg-rose-500 text-white border border-slate-700">
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                    {previews.length < 3 && (
                                        <div onClick={() => fileInputRef.current?.click()}
                                            className="aspect-square rounded-xl border border-slate-800 border-dashed flex items-center justify-center text-slate-600 hover:text-slate-400 hover:border-slate-600 cursor-pointer transition-colors">
                                            <PlusCircle className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {submitError && (
                                <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">{submitError}</p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-6 border-t border-slate-800 flex gap-3">
                {step > 1 && (
                    <Button variant="outline" className="flex-1 border-slate-700 text-slate-300 gap-1" onClick={prevStep}>
                        <ChevronLeft className="h-4 w-4" />Back
                    </Button>
                )}
                {step < 3 ? (
                    <Button
                        className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                        onClick={nextStep}
                        disabled={step === 1 && (!selectedCategory || !title.trim())}
                    >
                        Continue <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                ) : (
                    <Button
                        className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                        onClick={handleSubmit}
                        disabled={submitState === "loading"}
                    >
                        {submitState === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Submit Report <ChevronRight className="h-4 w-4 ml-1" /></>}
                    </Button>
                )}
            </div>

            {/* AI Duplicate Detection Dialog */}
            <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
                    <DialogHeader>
                        <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 border border-amber-500/30">
                            <AlertTriangle className="h-6 w-6 text-amber-500" />
                        </div>
                        <DialogTitle className="text-xl font-bold">Potential Duplicate Detected</DialogTitle>
                        <DialogDescription className="text-slate-400 pt-2">
                            Gemini AI image analysis detected a visually identical pending report exactly {duplicateData ? 'at this location' : 'nearby'}.
                        </DialogDescription>
                    </DialogHeader>

                    {duplicateData && (
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 my-2">
                            <div className="flex justify-between items-center mb-2">
                                <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">PENDING REPORT</Badge>
                                <span className="text-[10px] text-slate-500 font-mono">ID: {duplicateData.id?.split('-')[0]}</span>
                            </div>
                            <p className="text-sm font-medium">"{duplicateData.title}"</p>
                        </div>
                    )}

                    <DialogFooter className="flex gap-2 sm:justify-start">
                        <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => {
                            // "Upvote Existing" - In a full system this would increment an upvote counter on duplicateData.id
                            // For this MVP demo, we simply acknowledge it and reset the form to avoid cluttering DB.
                            setShowDuplicateDialog(false);
                            setStep(1); setSelectedCategory(null); setTitle(""); setDescription("");
                            setCoords(null); setImages([]); setPreviews([]); setSubmitState("idle");
                            setCreatedIssueId(null); setAddress(""); setDuplicateIgnored(false); setDuplicateData(null);
                        }}>
                            Upvote Existing Issue
                        </Button>
                        <Button variant="ghost" className="flex-1 text-slate-400 hover:text-white" onClick={() => {
                            setShowDuplicateDialog(false);
                            setDuplicateIgnored(true);
                            setTimeout(handleSubmit, 100);
                        }}>
                            Submit New Anyway
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
