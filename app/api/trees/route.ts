import { NextRequest, NextResponse } from "next/server"

const WAI_BASE = "https://api.weather-ai.co"

export async function POST(req: NextRequest) {
  const formData = await req.formData()

  const res = await fetch(`${WAI_BASE}/v1/trees/analyze`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.WEATHER_AI_API_KEY}` },
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json(data, { status: res.status })
  return NextResponse.json(data)
}
