"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Badge } from "@/components/ui/badge";

interface MapData {
    id: string;
    lat: number;
    lng: number;
    status: string;
    category: string;
}

// Custom icons based on status
const createIcon = (status: string) => {
    const color = status === "resolved" ? "rgb(16 185 129)" : // Emerald
        status === "rejected" ? "rgb(244 63 94)" : // Rose
            "rgb(245 158 11)"; // Amber (pending/in_progress)

    return L.divIcon({
        className: "custom-leaflet-marker",
        html: `
            <div style="position:relative;">
                <div style="position:absolute; inset:-4px; background-color:${color}; opacity:0.3; border-radius:50%; animation:ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                <div style="height:14px; width:14px; background-color:${color}; border:2px solid #020617; border-radius:50%; position:relative; z-index:10; box-shadow:0 0 10px ${color}"></div>
            </div>
        `,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
    });
};

function MapBounds({ data }: { data: MapData[] }) {
    const map = useMap();

    useEffect(() => {
        if (data.length > 0) {
            const bounds = L.latLngBounds(data.map(d => [d.lat, d.lng] as [number, number]));
            // Pad bounds slightly so markers aren't right on the edge
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        }
    }, [data, map]);

    return null;
}

export default function PriorityMapInner({ mapData }: { mapData: MapData[] }) {
    // Default to LPU Phagwara
    const center: [number, number] = [31.2548, 75.7055];

    return (
        <MapContainer
            center={center}
            zoom={14}
            className="w-full h-full z-0"
            zoomControl={false}
            attributionControl={false}
        >
            {/* Dark themed map tiles (CARTO Dark Matter) */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                maxZoom={19}
            />

            <MapBounds data={mapData} />

            {mapData.map((issue) => (
                <Marker
                    key={issue.id}
                    position={[issue.lat, issue.lng]}
                    icon={createIcon(issue.status)}
                >
                    <Popup className="custom-popup border-0">
                        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl w-48">
                            <Badge className="bg-slate-800 text-slate-300 border-none mb-2 capitalize text-[10px] tracking-widest">
                                {issue.category}
                            </Badge>
                            <p className="text-xs text-white break-words">Status: {issue.status.toUpperCase()}</p>
                            <p className="text-[10px] text-slate-500 mt-2 font-mono">{issue.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
