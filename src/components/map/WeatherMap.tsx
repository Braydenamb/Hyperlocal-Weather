'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocationStore } from '@/stores/locationStore';
import { useThemeStore } from '@/stores/themeStore';
import type { Location } from '@/types';
import RadarOverlay from './RadarOverlay';

// Fix for default Leaflet icon paths in Next.js/React environments
const customIcon = L.divIcon({
  html: `<div class="relative flex items-center justify-center">
    <div class="absolute w-6 h-6 rounded-full bg-cyan/30 animate-ping"></div>
    <div class="w-3.5 h-3.5 rounded-full bg-cyan border border-white shadow-lg relative z-10"></div>
  </div>`,
  className: 'custom-gps-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Helper to get condition colors for report markers
const getReportIcon = (condition: string) => {
  let color = 'bg-yellow-500';
  if (condition === 'rain' || condition === 'drizzle') color = 'bg-blue-500';
  if (condition === 'storm' || condition === 'thunderstorm') color = 'bg-purple-600';
  if (condition === 'snow') color = 'bg-teal-300';
  if (condition === 'fog') color = 'bg-slate-400';
  if (condition === 'windy' || condition === 'wind') color = 'bg-teal-500';

  return L.divIcon({
    html: `<div class="relative flex items-center justify-center group">
      <div class="absolute w-5 h-5 rounded-full ${color}/40 animate-pulse"></div>
      <div class="w-3 h-3 rounded-full ${color} border border-white shadow-lg relative z-10"></div>
    </div>`,
    className: 'custom-report-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Component to dynamically recenter map when store location changes
function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom());
  }, [lat, lon, map]);
  return null;
}

interface WeatherMapProps {
  showRadar?: boolean;
}

export default function WeatherMap({ showRadar = false }: WeatherMapProps) {
  const currentLocation = useLocationStore((s) => s.currentLocation);
  const theme = useThemeStore((s) => s.theme);
  const [reports, setReports] = useState<any[]>([]);

  // Default coordinate if no current location is selected: NYC
  const lat = currentLocation?.latitude ?? 40.7128;
  const lon = currentLocation?.longitude ?? -74.006;

  // Load community reports
  useEffect(() => {
    const loadReports = async () => {
      try {
        const res = await fetch(`/api/reports?lat=${lat}&lon=${lon}`);
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        }
      } catch (err) {
        console.error("Failed to load reports:", err);
      }
    };
    loadReports();
  }, [lat, lon]);

  // Use elegant CartoDB dark/light tile layouts based on theme
  const tileUrl =
    theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-10 min-h-[380px]">
      <MapContainer
        center={[lat, lon]}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer url={tileUrl} attribution={attribution} />
        
        {/* Recenter behavior */}
        <RecenterMap lat={lat} lon={lon} />

        {/* GPS location marker */}
        <Marker position={[lat, lon]} icon={customIcon}>
          <Popup className="custom-leaflet-popup">
            <div className="p-1 font-sans">
              <p className="font-bold text-sm text-[#0B1020]">
                {currentLocation?.name ?? 'Selected Location'}
              </p>
              <p className="text-xs text-slate-500">
                Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Community reports markers */}
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={getReportIcon(report.condition)}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 font-sans text-[#0B1020]">
                <p className="font-bold text-xs uppercase tracking-wider text-cyan mb-0.5">
                  Community Alert
                </p>
                <p className="font-semibold text-sm capitalize">
                  Condition: {report.condition}
                </p>
                {report.note && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-1.5 rounded mt-1">
                    "{report.note}"
                  </p>
                )}
                <p className="text-[10px] text-slate-400 mt-1">
                  Reported at {new Date(report.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Animated Radar simulation overlay */}
        {showRadar && <RadarOverlay lat={lat} lon={lon} />}
      </MapContainer>
    </div>
  );
}
