"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { Sidebar, NavItem } from "@/components/layout/sidebar";
import { RedesignedDashboard } from "@/components/layout/redesigned-dashboard";
import { CommandCenter } from "@/components/layout/command-center";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeItem, setActiveItem] = useState<NavItem>("dashboard");

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar activeItem={activeItem} onNavigate={setActiveItem} />

      <main className="flex-1 h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {activeItem === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              <RedesignedDashboard />
            </motion.div>
          )}

          {activeItem === "report" && (
            <motion.div
              key="report"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="h-full"
            >
              <CommandCenter />
            </motion.div>
          )}

          {(activeItem === "map" || activeItem === "profile" || activeItem === "activity") && (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center ml-[260px] text-slate-500"
            >
              <div className="text-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-700">
                  {activeItem === "map" ? "MAP" : "USR"}
                </div>
                <h3 className="text-lg font-medium capitalize">{activeItem} View coming soon</h3>
                <p className="text-sm">This module is part of the Phase 2 expansion.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
