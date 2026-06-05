import { NextRequest, NextResponse } from "next/server"
import { parseApiError } from "@/lib/errors"

const WAI_BASE = "https://api.weather-ai.co"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const days = searchParams.get("days") ?? "7"

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 })
  }

  let res: Response
  try {
    res = await fetch(`${WAI_BASE}/v1/daily?lat=${lat}&lon=${lon}&days=${days}&ai=true&units=metric`, {
      headers: { Authorization: `Bearer ${process.env.WEATHER_AI_API_KEY}` },
      next: { revalidate: 300 },
    })
  } catch {
    return NextResponse.json({ error: "Failed to reach weather service", code: "unavailable" }, { status: 503 })
  }

  const body = await res.json()
  if (!res.ok) {
    const err = parseApiError(res.status, body, res.headers)
    return NextResponse.json({ error: err.message, code: err.code, retryAfter: err.retryAfter }, { status: res.status })
  }
  return NextResponse.json(body)
}
