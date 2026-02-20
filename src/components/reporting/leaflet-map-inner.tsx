"use client";

/**
 * LeafletMapInner — actual map component (client-side only via dynamic import).
 * Auto-centers on user's real GPS location on load.
 * Click on the map to place a marker + reverse-geocode via OpenCage.
 */

import { useEffect, useState, useCallback } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAddress, type GeoResult } from "@/lib/opencage";
import { Loader2, MapPin, Navigation } from "lucide-react";

// Fix default marker icons broken by webpack
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom emerald marker icon
const emeraldIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// ─── UserLocator: auto-flies map to user's GPS on mount ────────────────────
function UserLocator({ onLocated }: { onLocated: (lat: number, lng: number) => void }) {
    const map = useMap();
    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                map.flyTo([coords.latitude, coords.longitude], 15, { duration: 1.5 });
                onLocated(coords.latitude, coords.longitude);
            },
            () => { /* Permission denied — stay on fallback center */ },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    }, [map, onLocated]);
    return null;
}

// ─── MapClickHandler ───────────────────────────────────────────────────────
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) { onMapClick(e.latlng.lat, e.latlng.lng); },
    });
    return null;
}

// ─── Types ─────────────────────────────────────────────────────────────────
export interface MapSelection {
    lat: number;
    lng: number;
    address: string;
    formatted: string;
}

interface LeafletMapInnerProps {
    onLocationSelect: (selection: MapSelection) => void;
}

// ─── Main component ────────────────────────────────────────────────────────
export default function LeafletMapInner({ onLocationSelect }: LeafletMapInnerProps) {
    const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
    const [geoResult, setGeoResult] = useState<GeoResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(true); // true while GPS loads

    const handleLocated = useCallback((lat: number, lng: number) => {
        setLocating(false);
        // Optionally auto-pin the user's detected location
        // handleMapClick(lat, lng);  ← uncomment if you want auto-pin on load
        void lat; void lng;
    }, []);

    const handleMapClick = useCallback(async (lat: number, lng: number) => {
        setLocating(false);
        setMarker({ lat, lng });
        setLoading(true);
        setGeoResult(null);

        const result = await getAddress(lat, lng);
        setLoading(false);

        if (result) {
            setGeoResult(result);
            onLocationSelect({ lat, lng, address: result.address, formatted: result.formatted });
        } else {
            const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            onLocationSelect({ lat, lng, address: fallback, formatted: fallback });
        }
    }, [onLocationSelect]);

    return (
        <div
            className="relative w-full rounded-2xl overflow-hidden border border-slate-700 shadow-2xl"
            style={{ height: 500 }}
        >
            {/* GPS locating toast */}
            {locating && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/90 backdrop-blur border border-blue-500/30 rounded-full px-4 py-2 flex items-center gap-2 text-xs text-blue-400 shadow-lg pointer-events-none">
                    <Navigation className="h-3 w-3 animate-pulse" />
                    Detecting your location…
                </div>
            )}

            {/* Geocoding toast */}
            {loading && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/90 backdrop-blur border border-emerald-500/30 rounded-full px-4 py-2 flex items-center gap-2 text-xs text-emerald-400 shadow-lg">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Fetching address…
                </div>
            )}

            {/* Hint when ready, no marker yet */}
            {!locating && !loading && !marker && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/90 backdrop-blur border border-slate-700 rounded-full px-4 py-2 flex items-center gap-2 text-xs text-slate-400 shadow-lg pointer-events-none">
                    <MapPin className="h-3 w-3 text-emerald-500" />
                    Click on the map to pin the issue location
                </div>
            )}

            <MapContainer
                center={[20.5937, 78.9629]}   // Center of India — UserLocator will fly to real location
                zoom={5}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Auto-fly to user's real GPS */}
                <UserLocator onLocated={handleLocated} />
                <MapClickHandler onMapClick={handleMapClick} />

                {marker && (
                    <Marker position={[marker.lat, marker.lng]} icon={emeraldIcon}>
                        <Popup>
                            <div className="text-sm space-y-1.5 min-w-[200px]">
                                {loading ? (
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Loader2 className="h-3 w-3 animate-spin" /> Locating…
                                    </div>
                                ) : geoResult ? (
                                    <>
                                        <p className="font-bold text-slate-800 leading-snug">{geoResult.formatted}</p>
                                        {geoResult.city && (
                                            <p className="text-xs text-slate-500">{geoResult.city}, {geoResult.country}</p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-slate-500 text-xs">
                                        {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                                    </p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}
