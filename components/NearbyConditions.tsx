"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { getCurrent } from "@/lib/weather-api"
import { nearestLocations, type KenyaLocation } from "@/lib/locations"
import type { CurrentResponse } from "@/types/weather"
import { formatTemp, wmoLabel } from "@/lib/utils"

interface Props {
  lat: number
  lon: number
}

interface HubData extends KenyaLocation {
  data: CurrentResponse | null
  error: boolean
}

export default function NearbyConditions({ lat, lon }: Props) {
  const hubs = nearestLocations(lat, lon, 3)
  const [results, setResults] = useState<HubData[]>(
    hubs.map((h) => ({ ...h, data: null, error: false }))
  )

  useEffect(() => {
    // Recompute when lat/lon changes
    const nearest = nearestLocations(lat, lon, 3)
    setResults(nearest.map((h) => ({ ...h, data: null, error: false })))

    nearest.forEach(async (hub, i) => {
      try {
        const data = await getCurrent(hub.lat, hub.lon)
        setResults((prev) => prev.map((h, idx) => idx === i ? { ...h, data } : h))
      } catch {
        setResults((prev) => prev.map((h, idx) => idx === i ? { ...h, error: true } : h))
      }
    })
  }, [lat, lon])

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-zinc-500" />
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Nearby Farm Conditions</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {results.map((hub) => (
          <Link
            key={hub.name}
            href={`/dashboard?lat=${hub.lat}&lon=${hub.lon}&name=${encodeURIComponent(hub.name)}`}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-center transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-800 dark:hover:bg-emerald-950/30"
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{hub.label}</span>
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{hub.name}</span>

            {hub.data ? (
              <>
                <Image
                  src={hub.data.current.icon}
                  alt={wmoLabel(hub.data.current.condition_code)}
                  width={32}
                  height={32}
                  unoptimized
                />
                <span className="text-xl font-thin text-zinc-800 dark:text-zinc-100">
                  {formatTemp(hub.data.current.temperature)}
                </span>
                <span className="text-[10px] text-zinc-400 leading-tight">
                  {wmoLabel(hub.data.current.condition_code)}
                </span>
                {hub.data.hourly[0] && (
                  <span className="text-[10px] text-zinc-400">
                    {hub.data.hourly[0].humidity}% humidity
                  </span>
                )}
              </>
            ) : hub.error ? (
              <span className="text-xs text-zinc-300 mt-2">Unavailable</span>
            ) : (
              <div className="mt-2 h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
