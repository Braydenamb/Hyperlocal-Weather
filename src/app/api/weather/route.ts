import { NextRequest, NextResponse } from "next/server";
import { fetchWeatherData } from "@/lib/weather/openMeteo";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latStr = searchParams.get("lat");
  const lonStr = searchParams.get("lon");

  if (!latStr || !lonStr) {
    return NextResponse.json(
      { error: "Latitude and longitude query parameters are required." },
      { status: 400 }
    );
  }

  const latitude = parseFloat(latStr);
  const longitude = parseFloat(lonStr);

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { error: "Latitude and longitude must be valid numbers." },
      { status: 400 }
    );
  }

  try {
    const weatherData = await fetchWeatherData({ latitude, longitude });
    return NextResponse.json(weatherData);
  } catch (error: any) {
    console.error("Error fetching weather in API route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch weather data." },
      { status: 500 }
    );
  }
}
