import { NextRequest, NextResponse } from "next/server"

const WAI_BASE = "https://api.weather-ai.co"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const days = searchParams.get("days") ?? "7"

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 })
  }

  const url = `${WAI_BASE}/v1/weather?lat=${lat}&lon=${lon}&days=${days}&ai=true&units=metric`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.WEATHER_AI_API_KEY}` },
    next: { revalidate: 300 },
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json(data, { status: res.status })
  return NextResponse.json(data)
}
