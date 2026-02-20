"use client";

import React from "react";
import {
    Map as MapIcon,
    Shield,
    MessageSquare,
    Plus,
    LayoutGrid,
    LogOut,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";

export type NavItem = "dashboard" | "report" | "map" | "profile" | "activity";

interface SidebarProps {
    activeItem: NavItem;
    onNavigate: (item: NavItem) => void;
}

const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "report", label: "Report Issue", icon: Shield },
    { id: "map", label: "Community Map", icon: MapIcon },
    { id: "activity", label: "My Contributions", icon: MessageSquare },
] as const;

export function Sidebar({ activeItem, onNavigate }: SidebarProps) {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/auth");
    };

    const displayName = user?.user_metadata?.username || user?.email?.split("@")[0] || "Contributor";
    const avatarUrl = user?.user_metadata?.avatar_url ?? null;
    const initials = displayName.slice(0, 2).toUpperCase();
    return (
        <div className="fixed left-0 top-0 h-screen w-[260px] flex flex-col bg-slate-950 border-r border-slate-900 z-50 p-6">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500 border border-emerald-500/30">
                    <LayoutGrid className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">CivicLens</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id as NavItem)}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                            activeItem === item.id
                                ? "bg-emerald-500/5 text-emerald-500 border border-emerald-500/10"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <item.icon className={cn(
                            "h-5 w-5 transition-colors",
                            activeItem === item.id ? "text-emerald-500" : "group-hover:text-white"
                        )} />
                        <span className="text-sm font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="mt-auto space-y-4">
                <Button
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold h-11 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    onClick={() => onNavigate("report")}
                >
                    <Plus className="h-5 w-5" />
                    NEW REPORT
                </Button>

                {/* Live User Card */}
                <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
                    {loading ? (
                        <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-4 w-4 text-slate-500 animate-spin" />
                        </div>
                    ) : user ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="h-9 w-9 border border-slate-700">
                                        {avatarUrl && <AvatarImage src={avatarUrl} />}
                                        <AvatarFallback className="bg-emerald-500/20 text-emerald-500 text-xs font-bold">{initials}</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-white truncate">{displayName}</h4>
                                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{user.email}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSignOut}
                                className="w-full h-7 text-[10px] text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 gap-1 justify-start px-2"
                            >
                                <LogOut className="h-3 w-3" /> Sign Out
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-slate-700 text-slate-400 text-xs"
                            onClick={() => router.push("/auth")}
                        >
                            Sign In
                        </Button>
                    )}
                </div>

                <div className="flex gap-2">
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] font-bold px-2 py-0">TOP 1%</Badge>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-bold px-2 py-0 uppercase">Verified</Badge>
                </div>
            </div>
        </div>
    );
}
