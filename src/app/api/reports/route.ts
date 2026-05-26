import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

// In-memory fallback if the database connection isn't available or fails
let memoryReports: any[] = [
  {
    id: "rep-1",
    latitude: 40.73061,
    longitude: -73.935242,
    condition: "rain",
    note: "Heavy rain starting near Greenpoint",
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: "rep-2",
    latitude: 40.7128,
    longitude: -74.006,
    condition: "storm",
    note: "Thunder and lightning visible over Lower Manhattan!",
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: "rep-3",
    latitude: 40.7589,
    longitude: -73.9851,
    condition: "windy",
    note: "Strong gusts between skyscrapers near Times Square.",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get("lat");
  const lonStr = searchParams.get("lon");

  try {
    // Attempt database query first
    const dbReports = await prisma.communityReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Map Prisma schema format back to frontend types/index.ts structure
    const reports = dbReports.map((r) => ({
      id: r.id,
      latitude: r.latitude,
      longitude: r.longitude,
      condition: r.reportType, // maps to reportType in schema
      note: r.description || undefined,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json(reports);
  } catch (error) {
    console.warn("Database failed in /api/reports, using memory fallback:", error);
    // Filter by proximity in memory if coords are passed, otherwise return all
    let reports = [...memoryReports];
    if (latStr && lonStr) {
      const lat = parseFloat(latStr);
      const lon = parseFloat(lonStr);
      if (!isNaN(lat) && !isNaN(lon)) {
        // Return reports within roughly ~50km
        reports = reports.filter((r) => {
          const dLat = r.latitude - lat;
          const dLon = r.longitude - lon;
          const dist = Math.sqrt(dLat * dLat + dLon * dLon);
          return dist < 0.5; // roughly ~55km bounding box
        });
      }
    }
    return NextResponse.json(reports);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latitude, longitude, condition, note } = body;

    if (!latitude || !longitude || !condition) {
      return NextResponse.json(
        { error: "Latitude, longitude, and condition are required." },
        { status: 400 }
      );
    }

    const newReport = {
      id: `rep-${Math.random().toString(36).substr(2, 9)}`,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      condition,
      note: note || "",
      createdAt: new Date().toISOString(),
    };

    try {
      // Attempt database insertion
      await prisma.communityReport.create({
        data: {
          id: newReport.id,
          latitude: newReport.latitude,
          longitude: newReport.longitude,
          reportType: newReport.condition,
          severity: 2,
          description: newReport.note,
          expiresAt: new Date(Date.now() + 2 * 3600000), // expires in 2 hours
        },
      });
    } catch (error) {
      console.warn("Prisma insertion failed, saving only in memory:", error);
    }

    // Always push to in-memory list so it works in UI instantly
    memoryReports.unshift(newReport);

    return NextResponse.json(newReport, { status: 201 });
  } catch (error: any) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit report." },
      { status: 500 }
    );
  }
}
