import type { WeatherResponse, TreeAnalysisResult, UsageResponse } from "@/types/weather"

const BASE = "/api"

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? res.statusText)
  }
  return res.json()
}

export function getWeather(lat: number, lon: number, days = 7): Promise<WeatherResponse> {
  return fetchJson(`${BASE}/weather?lat=${lat}&lon=${lon}&days=${days}`)
}

export function getUsage(): Promise<UsageResponse> {
  return fetchJson(`${BASE}/usage`)
}

export async function analyzeTrees(formData: FormData): Promise<TreeAnalysisResult> {
  const res = await fetch(`${BASE}/trees`, { method: "POST", body: formData })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? res.statusText)
  }
  return res.json()
}
