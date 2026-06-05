"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, TreePine, RefreshCw } from "lucide-react"
import WeatherCard from "@/components/WeatherCard"
import ForecastChart from "@/components/ForecastChart"
import HourlyTimeline from "@/components/HourlyTimeline"
import UsageQuota from "@/components/UsageQuota"
import { getWeather, getUsage } from "@/lib/weather-api"
import type { WeatherResponse, UsageResponse } from "@/types/weather"

function DashboardContent() {
  const params = useSearchParams()
  const router = useRouter()

  const lat = params.get("lat")
  const lon = params.get("lon")
  const name = params.get("name") ?? "Unknown"

  const [weather, setWeather] = useState<WeatherResponse | null>(null)
  const [usage, setUsage] = useState<UsageResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!lat || !lon) {
      router.replace("/")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const [w, u] = await Promise.all([
        getWeather(parseFloat(lat), parseFloat(lon)),
        getUsage(),
      ])
      setWeather(w)
      setUsage(u)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load weather data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [lat, lon])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <p className="text-sm">Loading weather data…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-3">{error}</p>
          <button onClick={() => router.back()} className="text-sm text-emerald-600 underline">Go back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-emerald-600">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <Link
          href={`/farm-analysis?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}`}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          <TreePine className="h-4 w-4" /> Farm Analysis
        </Link>
      </div>

      {weather && <WeatherCard data={weather} locationName={name} />}

      {weather?.daily && weather.daily.length > 0 && (
        <ForecastChart daily={weather.daily} />
      )}

      {weather?.hourly && weather.hourly.length > 0 && (
        <HourlyTimeline hourly={weather.hourly} />
      )}

      {usage && <UsageQuota data={usage} />}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
