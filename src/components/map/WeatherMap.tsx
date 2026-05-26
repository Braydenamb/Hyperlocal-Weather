'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocationStore } from '@/stores/locationStore';
import { useThemeStore } from '@/stores/themeStore';
import RadarOverlay from './RadarOverlay';

// Fix for default Leaflet icon paths in Next.js/React environments
const customIcon = L.divIcon({
  html: `<div class="relative flex items-center justify-center">
    <div class="absolute w-8 h-8 rounded-full bg-cyan/25 animate-ping" style="animation-duration: 2.5s;"></div>
    <div class="w-3.5 h-3.5 rounded-full bg-cyan border border-white dark:border-slate-900 shadow-md relative z-10"></div>
  </div>`,
  className: 'custom-gps-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Helper to get condition colors for report markers
const getReportIcon = (condition: string) => {
  let color = 'bg-yellow-500';
  if (condition === 'rain' || condition === 'drizzle') color = 'bg-cyan';
  if (condition === 'storm' || condition === 'thunderstorm') color = 'bg-purple-500';
  if (condition === 'snow') color = 'bg-blue-300';
  if (condition === 'fog') color = 'bg-slate-400';
  if (condition === 'windy' || condition === 'wind') color = 'bg-emerald-400';

  return L.divIcon({
    html: `<div class="relative flex items-center justify-center">
      <div class="absolute w-6 h-6 rounded-full ${color}/35 animate-pulse" style="animation-duration: 2s;"></div>
      <div class="w-3 h-3 rounded-full ${color} border border-white dark:border-slate-900 shadow-md relative z-10"></div>
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

// Component to automatically call map.invalidateSize() when the map container element resizes
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    if (!container) return;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        map.invalidateSize({ animate: true });
      });
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [map]);

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

  // Elegant CartoDB dark/light tile layouts based on theme
  const tileUrl =
    theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-white/5 shadow-lg z-10 min-h-[380px]">
      <MapContainer
        center={[lat, lon]}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer url={tileUrl} attribution={attribution} />
        
        {/* Recenter & Reflow behavior */}
        <RecenterMap lat={lat} lon={lon} />
        <MapResizer />

        {/* GPS location marker */}
        <Marker position={[lat, lon]} icon={customIcon}>
          <Popup className="custom-leaflet-popup">
            <div className="p-1.5 font-sans flex flex-col gap-0.5 min-w-[120px]">
              <p className="font-black text-xs text-slate-900">
                {currentLocation?.name ?? 'Selected Location'}
              </p>
              <p className="text-[10px] font-semibold text-slate-400">
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
              <div className="p-1.5 font-sans min-w-[140px] flex flex-col gap-1 text-slate-800">
                <p className="font-black text-[9px] uppercase tracking-widest text-cyan">
                  Community Alert
                </p>
                <p className="font-extrabold text-xs capitalize text-slate-900">
                  {report.condition}
                </p>
                {report.note && (
                  <p className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 p-1.5 rounded mt-1">
                    "{report.note}"
                  </p>
                )}
                <p className="text-[9px] font-medium text-slate-400 mt-0.5">
                  Reported at {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
