import type {
  WeatherResponse,
  TreeAnalysisResult,
  UsageResponse,
  TreesQuotaResponse,
  TreesHistoryResponse,
  GeoWeatherResponse,
  CurrentResponse,
} from "@/types/weather"

const BASE = "/api"

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" })
  const body = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(body))
  return body
}

export function getWeather(lat: number, lon: number, days = 7): Promise<WeatherResponse> {
  return fetchJson(`${BASE}/weather?lat=${lat}&lon=${lon}&days=${days}`)
}

export function getUsage(): Promise<UsageResponse> {
  return fetchJson(`${BASE}/usage`)
}

export function getTreesQuota(): Promise<TreesQuotaResponse> {
  return fetchJson(`${BASE}/trees/quota`)
}

export function getTreesHistory(cursor?: string): Promise<TreesHistoryResponse> {
  return fetchJson(`${BASE}/trees/history${cursor ? `?cursor=${cursor}` : ""}`)
}

export function getWeatherGeo(): Promise<GeoWeatherResponse> {
  return fetchJson(`${BASE}/weather-geo`)
}

export function getCurrent(lat: number, lon: number): Promise<CurrentResponse> {
  return fetchJson(`${BASE}/current?lat=${lat}&lon=${lon}`)
}

export async function analyzeTrees(formData: FormData): Promise<TreeAnalysisResult> {
  const res = await fetch(`${BASE}/trees`, { method: "POST", body: formData })
  const body = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(body))
  return body
}
