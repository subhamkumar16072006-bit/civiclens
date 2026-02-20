import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Priority = "low" | "medium" | "high" | "critical";

interface PriorityBadgeProps {
    priority: Priority;
    className?: string;
}

const config = {
    low: { label: "Low", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    medium: { label: "Medium", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    high: { label: "High", className: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
    critical: { label: "Critical", className: "bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse" },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
    const { label, className: variantStyles } = config[priority];

    return (
        <Badge variant="outline" className={cn("font-bold uppercase text-[10px]", variantStyles, className)}>
            {label}
        </Badge>
    );
}
