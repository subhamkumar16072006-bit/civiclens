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
    category: string;
    ai_score: number | null;
}

// Officer icons are exclusively red pins for pending work
const createOfficerIcon = () => {
    return L.divIcon({
        className: "custom-leaflet-marker",
        html: `
            <div style="position:relative;">
                <div style="position:absolute; inset:-4px; background-color:#e11d48; opacity:0.2; border-radius:50%; animation:ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                <div style="height:16px; width:16px; background-color:#e11d48; border:2px solid #ffffff; border-radius:50%; position:relative; z-index:10; box-shadow:0 0 10px rgba(225,29,72,0.5)"></div>
            </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
    });
};

function MapBounds({ data }: { data: MapData[] }) {
    const map = useMap();

    useEffect(() => {
        if (data.length > 0) {
            const bounds = L.latLngBounds(data.map(d => [d.lat, d.lng] as [number, number]));
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        }
    }, [data, map]);

    return null;
}

export default function OfficerMapInner({ mapData }: { mapData: MapData[] }) {
    const center: [number, number] = [31.2548, 75.7055];

    return (
        <MapContainer
            center={center}
            zoom={14}
            className="w-full h-full z-0 rounded-xl"
            zoomControl={false}
            attributionControl={false}
        >
            {/* Clean Light-Themed Map for Officers */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                maxZoom={19}
            />

            <MapBounds data={mapData} />

            {mapData.map((issue) => (
                <Marker
                    key={issue.id}
                    position={[issue.lat, issue.lng]}
                    icon={createOfficerIcon()}
                >
                    <Popup className="custom-popup border-0">
                        <div className="bg-white border md:min-w-40 border-slate-200 p-3 rounded-xl shadow-xl w-48 font-sans">
                            <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none mb-2 capitalize text-[10px] font-bold tracking-widest">
                                {issue.category}
                            </Badge>
                            <p className="text-xs text-slate-700 font-medium">AI Priority Score: <span className="text-rose-600 font-bold">{issue.ai_score || 0}%</span></p>
                            <p className="text-[10px] text-slate-400 mt-2 font-mono">ID: {issue.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
