import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

// In-memory fallback if the database connection isn't available or fails
let memorySavedLocations: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const dbLocations = await prisma.savedLocation.findMany({
      orderBy: { sortOrder: "asc" },
    });

    const locations = dbLocations.map((l) => ({
      id: l.id,
      name: l.name,
      country: l.country || "",
      latitude: l.latitude,
      longitude: l.longitude,
      admin1: l.admin1 || undefined,
    }));

    return NextResponse.json(locations);
  } catch (error) {
    console.warn("Database failed in GET /api/locations, using memory:", error);
    return NextResponse.json(memorySavedLocations);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, country, latitude, longitude, admin1 } = body;

    if (!name || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Name, latitude, and longitude are required." },
        { status: 400 }
      );
    }

    const newLocation = {
      id: `loc-${Math.random().toString(36).substr(2, 9)}`,
      name,
      country: country || "",
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      admin1: admin1 || undefined,
    };

    try {
      await prisma.savedLocation.create({
        data: {
          id: newLocation.id,
          userId: "default-user",
          name: newLocation.name,
          country: newLocation.country,
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
          admin1: newLocation.admin1 || null,
          sortOrder: memorySavedLocations.length,
        },
      });
    } catch (error) {
      console.warn("Prisma failed to save location, saving in memory:", error);
    }

    memorySavedLocations.push(newLocation);
    return NextResponse.json(newLocation, { status: 201 });
  } catch (error: any) {
    console.error("Error saving location:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save location." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Location ID is required." },
        { status: 400 }
      );
    }

    try {
      await prisma.savedLocation.delete({
        where: { id },
      });
    } catch (error) {
      console.warn("Prisma failed to delete location, deleting in memory:", error);
    }

    memorySavedLocations = memorySavedLocations.filter((l) => l.id !== id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting location:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete location." },
      { status: 500 }
    );
  }
}
