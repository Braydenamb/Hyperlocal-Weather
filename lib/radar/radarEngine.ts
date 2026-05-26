import { RadarCell } from '@/types/weather'

export function generateSimulatedRadar(centerLat: number, centerLon: number): RadarCell[] {
  const cells: RadarCell[] = []
  const types: Array<'rain' | 'snow' | 'mixed' | 'storm'> = ['rain', 'rain', 'rain', 'mixed', 'storm']

  for (let i = 0; i < 40; i++) {
    const latOffset = (Math.random() - 0.5) * 2
    const lonOffset = (Math.random() - 0.5) * 2
    cells.push({
      lat: centerLat + latOffset,
      lon: centerLon + lonOffset,
      intensity: Math.random(),
      type: types[Math.floor(Math.random() * types.length)],
    })
  }

  return cells
}

export function getRadarColor(intensity: number, type: RadarCell['type']): string {
  if (type === 'storm') return `rgba(139,0,0,${intensity})`
  if (type === 'snow') return `rgba(200,220,255,${intensity})`
  if (type === 'mixed') return `rgba(180,100,220,${intensity})`
  // rain
  if (intensity < 0.3) return `rgba(0,200,255,${intensity + 0.2})`
  if (intensity < 0.6) return `rgba(0,100,255,${intensity + 0.2})`
  return `rgba(0,50,200,${intensity + 0.2})`
}
