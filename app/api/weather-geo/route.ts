import { NextResponse } from "next/server"
import { parseApiError } from "@/lib/errors"

const WAI_BASE = "https://api.weather-ai.co"

export async function GET() {
  let res: Response
  try {
    res = await fetch(`${WAI_BASE}/v1/weather-geo`, {
      headers: { Authorization: `Bearer ${process.env.WEATHER_AI_API_KEY}` },
      next: { revalidate: 300 },
    })
  } catch {
    return NextResponse.json({ error: "Failed to reach weather service", code: "unavailable" }, { status: 503 })
  }

  const body = await res.json()
  if (!res.ok) {
    const err = parseApiError(res.status, body, res.headers)
    return NextResponse.json({ error: err.message, code: err.code }, { status: res.status })
  }
  return NextResponse.json(body)
}
