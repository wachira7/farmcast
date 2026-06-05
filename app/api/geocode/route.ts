import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")
  if (!q) return NextResponse.json({ error: "q is required" }, { status: 400 })

  // Bias results toward Kenya
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + " Kenya")}&format=json&limit=1&countrycodes=ke`

  const res = await fetch(url, {
    headers: { "User-Agent": "FarmCast/1.0 (agroforestry weather dashboard)" },
  })

  if (!res.ok) return NextResponse.json({ error: "Geocoding failed" }, { status: 502 })

  const results = await res.json()
  if (!results.length) {
    // Retry without Kenya bias
    const retry = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
      { headers: { "User-Agent": "FarmCast/1.0 (agroforestry weather dashboard)" } }
    )
    const retryResults = await retry.json()
    if (!retryResults.length) return NextResponse.json({ error: `Location "${q}" not found` }, { status: 404 })
    const { lat, lon, display_name } = retryResults[0]
    return NextResponse.json({ lat: parseFloat(lat), lon: parseFloat(lon), name: display_name.split(",")[0] })
  }

  const { lat, lon, display_name } = results[0]
  return NextResponse.json({ lat: parseFloat(lat), lon: parseFloat(lon), name: display_name.split(",")[0] })
}
