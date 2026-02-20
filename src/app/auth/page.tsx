"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutGrid, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOfficerMode, setIsOfficerMode] = useState(false);
    const router = useRouter();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();

            // signInWithOtp works for BOTH new (signup) and existing (login) users.
            // Supabase sends a 6-digit OTP to the email.
            // The user is only created in the DB *after* OTP is verified.
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    // Don't auto-create session until OTP is verified
                    shouldCreateUser: true,
                },
            });

            if (error) throw error;

            // Redirect to OTP page with email in query string
            router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            {/* Subtle grid background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFmMjkzNyIgb3BhY2l0eT0iMC40IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-sm"
            >
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <LayoutGrid className="h-6 w-6 text-emerald-500" />
                    </div>
                    <span className="text-2xl font-black text-white tracking-tight">CivicLens</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/50">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-black text-white">Welcome</h1>
                        <p className="text-sm text-slate-400 mt-1">
                            Enter your email — we'll send a one-time code to sign you in.
                            No password needed.
                        </p>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex bg-slate-800/50 p-1 rounded-xl mb-6 border border-slate-800/80">
                        <button
                            onClick={() => { setIsOfficerMode(false); setError(null); }}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isOfficerMode ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" : "text-slate-400 hover:text-white"
                                }`}
                        >
                            Citizen
                        </button>
                        <button
                            onClick={() => { setIsOfficerMode(true); setError(null); }}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isOfficerMode ? "bg-blue-500 text-slate-950 shadow-md shadow-blue-500/20" : "text-slate-400 hover:text-white"
                                }`}
                        >
                            Authority
                        </button>
                    </div>

                    <form onSubmit={handleSendOtp} className="space-y-4">
                        {/* Email input */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                            <Input
                                type="email"
                                placeholder={isOfficerMode ? "authority@example.com" : "you@example.com"}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoFocus
                                className={`pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-600 h-11 rounded-xl transition-all ${isOfficerMode
                                    ? "focus-visible:ring-blue-500/30 focus-visible:border-blue-500/50"
                                    : "focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"
                                    }`}
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs"
                            >
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading || !email.trim()}
                            className={`w-full font-bold h-11 rounded-xl gap-2 transition-all ${isOfficerMode
                                ? "bg-blue-500 hover:bg-blue-600 text-slate-950 shadow-lg shadow-blue-500/20"
                                : "bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/20"
                                }`}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Send OTP Code
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-xs text-slate-600 mt-6 leading-relaxed">
                        A 6-digit code will be sent to your email.<br />
                        New users will be registered automatically upon verification.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
