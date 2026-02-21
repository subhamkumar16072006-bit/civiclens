// src/components/providers/language-provider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Locale, translations } from '@/lib/translations';

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, variables?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');

    useEffect(() => {
        // Load persist language
        const saved = localStorage.getItem('app-locale') as Locale;
        if (saved && (saved === 'en' || saved === 'hi' || saved === 'pa')) {
            setLocaleState(saved);
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('app-locale', newLocale);
    };

    const t = (key: string, variables?: Record<string, string>) => {
        let text = translations[locale][key] || translations['en'][key] || key;

        if (variables) {
            Object.entries(variables).forEach(([name, value]) => {
                text = text.replace(`{${name}}`, value);
            });
        }

        return text;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
