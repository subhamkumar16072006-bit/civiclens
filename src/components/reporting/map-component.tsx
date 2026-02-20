"use client";

/**
 * MapComponent — SSR-safe wrapper around LeafletMapInner.
 * Uses next/dynamic with ssr: false to prevent server-side rendering crashes.
 */
import dynamic from "next/dynamic";
import type { MapSelection } from "./leaflet-map-inner";

const LeafletMapInner = dynamic(() => import("./leaflet-map-inner"), {
    ssr: false,
    loading: () => (
        <div
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 flex flex-col items-center justify-center gap-3"
            style={{ height: 500 }}
        >
            <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
            <p className="text-xs text-slate-500">Loading map…</p>
        </div>
    ),
});

interface MapComponentProps {
    onLocationSelect: (selection: MapSelection) => void;
}

export function MapComponent({ onLocationSelect }: MapComponentProps) {
    return <LeafletMapInner onLocationSelect={onLocationSelect} />;
}

export type { MapSelection };
