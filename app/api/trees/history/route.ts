import { NextRequest, NextResponse } from "next/server"
import { parseApiError } from "@/lib/errors"

const WAI_BASE = "https://api.weather-ai.co"

export async function GET(req: NextRequest) {
  const cursor = req.nextUrl.searchParams.get("cursor")
  const url = cursor
    ? `${WAI_BASE}/v1/trees/history?cursor=${cursor}`
    : `${WAI_BASE}/v1/trees/history`

  let res: Response
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.WEATHER_AI_API_KEY}` },
      next: { revalidate: 30 },
    })
  } catch {
    return NextResponse.json({ error: "Failed to reach analysis service", code: "unavailable" }, { status: 503 })
  }

  const body = await res.json()
  if (!res.ok) {
    const err = parseApiError(res.status, body, res.headers)
    return NextResponse.json({ error: err.message, code: err.code }, { status: res.status })
  }
  return NextResponse.json(body)
}
