'use client'
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet'
import { useWeatherStore } from '@/stores/weatherStore'
import { generateSimulatedRadar } from '@/lib/radar/radarEngine'
import 'leaflet/dist/leaflet.css'

export default function WeatherMap() {
  const { location } = useWeatherStore()
  const lat = location?.lat ?? 40.7128
  const lon = location?.lon ?? -74.006
  const radarCells = generateSimulatedRadar(lat, lon)

  const typeColors: Record<string, string> = {
    rain: '#06B6D4',
    snow: '#BAE6FD',
    mixed: '#A78BFA',
    storm: '#EF4444',
  }

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={9}
      style={{ height: '100%', width: '100%', borderRadius: '16px' }}
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />
      {/* Current location marker */}
      <CircleMarker
        center={[lat, lon]}
        radius={8}
        pathOptions={{ color: '#06B6D4', fillColor: '#06B6D4', fillOpacity: 0.8, weight: 2 }}
      >
        <Popup>
          <div style={{ background: '#0B1020', color: '#E2E8F0', borderRadius: '8px', padding: '8px', minWidth: '120px' }}>
            <strong>{location?.name ?? 'Current Location'}</strong>
          </div>
        </Popup>
      </CircleMarker>
      {/* Radar cells */}
      {radarCells.map((cell, i) => (
        <CircleMarker
          key={i}
          center={[cell.lat, cell.lon]}
          radius={cell.intensity * 15 + 5}
          pathOptions={{
            color: typeColors[cell.type] ?? '#06B6D4',
            fillColor: typeColors[cell.type] ?? '#06B6D4',
            fillOpacity: cell.intensity * 0.5,
            weight: 1,
          }}
        >
          <Popup>
            <div style={{ fontSize: '12px', color: '#0B1020' }}>
              {cell.type.toUpperCase()} — {Math.round(cell.intensity * 100)}% intensity
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
