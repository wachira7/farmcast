import { NextResponse } from "next/server"

const WAI_BASE = "https://api.weather-ai.co"

export async function GET() {
  const res = await fetch(`${WAI_BASE}/v1/usage`, {
    headers: { Authorization: `Bearer ${process.env.WEATHER_AI_API_KEY}` },
    next: { revalidate: 60 },
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json(data, { status: res.status })
  return NextResponse.json(data)
}
