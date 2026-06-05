"use client"

import Image from "next/image"
import { Wind, Droplets, Thermometer } from "lucide-react"
import type { WeatherResponse } from "@/types/weather"
import { formatTemp, wmoLabel } from "@/lib/utils"

interface Props {
  data: WeatherResponse
  locationName: string
}

export default function WeatherCard({ data, locationName }: Props) {
  const { current, location, hourly } = data

  // Grab humidity / feels_like from the current hour's hourly entry
  const now = new Date().getHours()
  const currentHour = hourly.find((h) => new Date(h.time).getHours() === now) ?? hourly[0]

  return (
    <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-xl">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-100 uppercase tracking-wider">Current Weather</p>
          <h2 className="mt-1 text-2xl font-bold">{locationName}</h2>
          <p className="text-emerald-200 text-sm">{location.country} · {location.timezone}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-6xl font-thin">{formatTemp(current.temperature)}</p>
          {currentHour && (
            <p className="text-emerald-200 text-sm">Feels {formatTemp(currentHour.feels_like)}</p>
          )}
        </div>
      </div>

      <div className="mb-5 flex items-center gap-3">
        <Image
          src={current.icon}
          alt={wmoLabel(current.condition_code)}
          width={40}
          height={40}
          className="drop-shadow"
          unoptimized
        />
        <p className="text-lg">{wmoLabel(current.condition_code)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat icon={<Wind className="h-4 w-4" />} label="Wind" value={`${Math.round(current.wind_speed)} km/h`} />
        {currentHour && (
          <>
            <Stat icon={<Droplets className="h-4 w-4" />} label="Humidity" value={`${currentHour.humidity}%`} />
            <Stat icon={<Thermometer className="h-4 w-4" />} label="UV Index" value={`${currentHour.uv_index}`} />
          </>
        )}
      </div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
      <span className="text-emerald-200">{icon}</span>
      <div>
        <p className="text-[10px] text-emerald-200 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  )
}
