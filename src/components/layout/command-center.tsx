"use client";

import React from "react";
import { ReportingEngine } from "@/components/reporting/reporting-engine";
import { LiveIntelligenceFeed } from "@/components/reporting/live-intelligence-feed";
import { TrustAndImpact } from "@/components/reporting/trust-and-impact";

export function CommandCenter() {
    return (
        <div className="flex h-screen ml-[260px] bg-background overflow-hidden">
            {/* Left Column: Reporting Engine */}
            <div className="w-[340px] h-full flex flex-col shrink-0">
                <ReportingEngine />
            </div>

            {/* Center Column: Live Intelligence Feed */}
            <div className="flex-1 h-full min-w-[400px]">
                <LiveIntelligenceFeed />
            </div>

            {/* Right Column: Trust & Impact */}
            <div className="w-[300px] h-full shrink-0">
                <TrustAndImpact />
            </div>
        </div>
    );
}
