"use client";

export const dynamic = "force-dynamic";

import React, { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Loader2, CheckCircle2, AlertCircle, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Inner component — uses useSearchParams, must be inside <Suspense>
function VerifyEmailContent() {
    const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [error, setError] = useState<string | null>(null);
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";

    // Auto-focus first box on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const verifyOtp = useCallback(async (token: string) => {
        if (!email) {
            setError("Email missing. Please go back and try again.");
            setStatus("error");
            return;
        }

        setStatus("loading");
        setError(null);

        try {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();

            // type: 'email' works for both new signup OTP and login OTP
            const { error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: "email",
            });

            if (error) throw error;

            setStatus("success");
            setTimeout(() => {
                router.push("/");
                router.refresh();
            }, 1200);
        } catch (err: unknown) {
            setStatus("error");
            setError(err instanceof Error ? err.message : "Invalid code. Please try again.");
            // Clear inputs and refocus
            setDigits(["", "", "", "", "", ""]);
            setTimeout(() => inputRefs.current[0]?.focus(), 50);
        }
    }, [email, router]);

    const handleChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const newDigits = [...digits];
        newDigits[index] = digit;
        setDigits(newDigits);
        setError(null);

        // Auto-advance
        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all 6 filled
        if (digit && index === 5) {
            const token = newDigits.slice(0, 5).join("") + digit;
            if (token.length === 6) verifyOtp(token);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            const newDigits = [...digits];
            newDigits[index - 1] = "";
            setDigits(newDigits);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pasted) return;
        const newDigits = Array(6).fill("").map((_, i) => pasted[i] ?? "");
        setDigits(newDigits);
        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
        if (pasted.length === 6) verifyOtp(pasted);
    };

    const handleResend = async () => {
        setResending(true);
        setResent(false);
        setError(null);
        try {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();
            await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
            setResent(true);
            setDigits(["", "", "", "", "", ""]);
            setTimeout(() => inputRefs.current[0]?.focus(), 50);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to resend.");
        } finally {
            setResending(false);
        }
    };

    const isComplete = digits.every(d => d !== "");

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
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
                    {status === "success" ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center space-y-4 py-4"
                        >
                            <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                            </div>
                            <h2 className="text-xl font-black text-white">Verified!</h2>
                            <p className="text-sm text-slate-400">Taking you to the dashboard…</p>
                            <Loader2 className="h-4 w-4 text-emerald-500 animate-spin mx-auto" />
                        </motion.div>
                    ) : (
                        <>
                            {/* Email pill */}
                            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mb-8">
                                <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Code sent to</p>
                                    <p className="text-sm text-white font-medium truncate">{email || "your email"}</p>
                                </div>
                            </div>

                            <h1 className="text-xl font-black text-white mb-1">Enter 6-digit code</h1>
                            <p className="text-xs text-slate-500 mb-8">
                                Check your inbox. The code expires in 10 minutes.
                            </p>

                            {/* OTP boxes */}
                            <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
                                {digits.map((digit, i) => (
                                    <motion.input
                                        key={i}
                                        ref={el => { inputRefs.current[i] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleChange(i, e.target.value)}
                                        onKeyDown={e => handleKeyDown(i, e)}
                                        disabled={status === "loading"}
                                        whileFocus={{ scale: 1.08 }}
                                        className={`
                                            w-11 h-13 text-center text-xl font-bold rounded-xl border-2
                                            bg-slate-950 text-white caret-emerald-500 outline-none
                                            transition-all duration-150 disabled:opacity-40
                                            ${digit
                                                ? "border-emerald-500 bg-emerald-500/5 shadow-md shadow-emerald-500/20"
                                                : "border-slate-700 focus:border-emerald-500/60"
                                            }
                                        `}
                                        style={{ height: "52px" }}
                                    />
                                ))}
                            </div>

                            {/* Resent notice */}
                            <AnimatePresence>
                                {resent && (
                                    <motion.p
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="text-xs text-emerald-400 text-center mb-3"
                                    >
                                        ✓ New code sent!
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs mb-4"
                                    >
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Verify button */}
                            <Button
                                disabled={!isComplete || status === "loading"}
                                onClick={() => verifyOtp(digits.join(""))}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold h-11 rounded-xl shadow-lg shadow-emerald-500/20"
                            >
                                {status === "loading"
                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                    : "Verify & Sign In"
                                }
                            </Button>

                            {/* Footer actions */}
                            <div className="flex items-center justify-between mt-5">
                                <button
                                    onClick={() => router.push("/auth")}
                                    className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
                                >
                                    ← Change email
                                </button>
                                <button
                                    onClick={handleResend}
                                    disabled={resending}
                                    className="text-xs text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors disabled:opacity-50"
                                >
                                    {resending
                                        ? <Loader2 className="h-3 w-3 animate-spin" />
                                        : <RefreshCw className="h-3 w-3" />
                                    }
                                    Resend code
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

// Default export wraps the content in Suspense to satisfy Next.js prerender requirements
export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                </div>
            }
        >
            <VerifyEmailContent />
        </Suspense>
    );
}
