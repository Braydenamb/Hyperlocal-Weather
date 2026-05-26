import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') ?? '40.7128')
  const lon = parseFloat(searchParams.get('lon') ?? '-74.0060')
  const radius = parseFloat(searchParams.get('radius') ?? '0.5')

  try {
    const reports = await prisma.communityReport.findMany({
      where: {
        lat: { gte: lat - radius, lte: lat + radius },
        lon: { gte: lon - radius, lte: lon + radius },
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json(reports)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const report = await prisma.communityReport.create({
      data: {
        lat: body.lat,
        lon: body.lon,
        condition: body.condition,
        intensity: body.intensity ?? 1,
        description: body.description,
      },
    })
    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 })
  }
}
