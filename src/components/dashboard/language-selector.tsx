// src/components/dashboard/language-selector.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Locale } from "@/lib/translations";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const languages: { code: Locale; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
];

export function LanguageSelector() {
    const { locale, setLocale } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const currentLang = languages.find(l => l.code === locale) || languages[0];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-10 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center gap-2 transition-all duration-200",
                    isOpen && "border-emerald-500/50 text-white"
                )}
            >
                <Globe className="h-4 w-4 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{currentLang.label}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", isOpen && "rotate-180")} />
            </Button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl z-[100] animate-in fade-in zoom-in duration-200">
                    <div className="p-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLocale(lang.code);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-lg",
                                    locale === lang.code
                                        ? "bg-emerald-500/10 text-emerald-500"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <span className="text-sm">{lang.flag}</span>
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
