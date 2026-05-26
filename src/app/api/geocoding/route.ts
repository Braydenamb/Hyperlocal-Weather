import { NextRequest, NextResponse } from "next/server";
import { searchLocations } from "@/lib/geolocation/geocoding";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required." },
      { status: 400 }
    );
  }

  try {
    const locations = await searchLocations(query);
    return NextResponse.json(locations);
  } catch (error: any) {
    console.error("Error performing geocoding:", error);
    return NextResponse.json(
      { error: error.message || "Failed to search locations." },
      { status: 500 }
    );
  }
}
