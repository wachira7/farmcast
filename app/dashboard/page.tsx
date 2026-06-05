"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, TreePine, RefreshCw, WifiOff, AlertTriangle, Clock } from "lucide-react"
import WeatherCard from "@/components/WeatherCard"
import ForecastChart from "@/components/ForecastChart"
import HourlyTimeline from "@/components/HourlyTimeline"
import UsageQuota from "@/components/UsageQuota"
import NearbyConditions from "@/components/NearbyConditions"
import { getWeather, getUsage } from "@/lib/weather-api"
import type { WeatherResponse, UsageResponse } from "@/types/weather"

interface DashError {
  code: string
  message: string
  retryAfter?: number
}

const ERROR_META: Record<string, { icon: React.ReactNode; title: string; color: string }> = {
  rate_limited: {
    icon: <Clock className="h-8 w-8" />,
    title: "Rate limit reached",
    color: "text-yellow-500",
  },
  unavailable: {
    icon: <WifiOff className="h-8 w-8" />,
    title: "Service unavailable",
    color: "text-blue-500",
  },
  unauthorized: {
    icon: <AlertTriangle className="h-8 w-8" />,
    title: "Authentication error",
    color: "text-red-500",
  },
  server_error: {
    icon: <AlertTriangle className="h-8 w-8" />,
    title: "Server error",
    color: "text-red-500",
  },
}

function ErrorScreen({ error, onRetry }: { error: DashError; onRetry: () => void }) {
  const meta = ERROR_META[error.code] ?? {
    icon: <AlertTriangle className="h-8 w-8" />,
    title: "Something went wrong",
    color: "text-zinc-500",
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className={meta.color}>{meta.icon}</span>
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">{meta.title}</h2>
        <p className="max-w-xs text-sm text-zinc-500">{error.message}</p>
        <div className="mt-2 flex gap-3">
          <button
            onClick={onRetry}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Try again
          </button>
          <Link href="/" className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}

function DashboardContent() {
  const params = useSearchParams()
  const router = useRouter()

  const lat = params.get("lat")
  const lon = params.get("lon")
  const name = params.get("name") ?? "Unknown"

  const [weather, setWeather] = useState<WeatherResponse | null>(null)
  const [usage, setUsage] = useState<UsageResponse | null>(null)
  const [error, setError] = useState<DashError | null>(null)
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
      if (e instanceof Error) {
        try {
          const parsed = JSON.parse(e.message)
          setError(parsed)
        } catch {
          setError({ code: "unknown", message: e.message })
        }
      } else {
        setError({ code: "unknown", message: "Failed to load weather data" })
      }
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

  if (error) return <ErrorScreen error={error} onRetry={load} />

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 px-4 py-6">
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

      <NearbyConditions lat={parseFloat(lat!)} lon={parseFloat(lon!)} />

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
