import { NextRequest, NextResponse } from 'next/server'
import { fetchWeather } from '@/lib/weather/openMeteo'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') ?? '40.7128')
  const lon = parseFloat(searchParams.get('lon') ?? '-74.0060')

  try {
    const data = await fetchWeather(lat, lon)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 })
  }
}
