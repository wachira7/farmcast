"use client"

import Image from "next/image"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts"
import type { HourlyForecast } from "@/types/weather"
import { hourLabel, wmoLabel } from "@/lib/utils"

interface Props {
  hourly: HourlyForecast[]
}

export default function HourlyTimeline({ hourly }: Props) {
  const now = new Date().getHours()
  const next24 = hourly.slice(0, 24)

  const data = next24.map((h) => {
    const hour = new Date(h.time).getHours()
    return {
      label: hourLabel(h.time),
      hour,
      temp: Math.round(h.temperature),
      feels: Math.round(h.feels_like),
      rain: h.precipitation_probability,
      icon: h.icon,
      condition: wmoLabel(h.condition_code),
    }
  })

  const nowLabel = data.find((h) => h.hour === now)?.label

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">24-Hour Breakdown</h3>

      {/* Scrollable icon strip */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {data.map((h) => (
          <div
            key={h.hour}
            className={`flex shrink-0 flex-col items-center gap-1 rounded-xl px-3 py-2 text-center ${
              h.hour === now
                ? "bg-emerald-600 text-white"
                : "bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            <span className="text-[10px] font-medium uppercase">{h.label}</span>
            <Image src={h.icon} alt={h.condition} width={24} height={24} unoptimized />
            <span className="text-xs font-bold">{h.temp}°</span>
            <span className="text-[10px] text-blue-400">{h.rain}%</span>
          </div>
        ))}
      </div>

      {/* Temp line chart */}
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={2} />
          <YAxis tick={{ fontSize: 10 }} unit="°" />
          <Tooltip
            formatter={(v) => [`${v}°C`]}
            contentStyle={{ borderRadius: 10, fontSize: 12 }}
          />
          {nowLabel && <ReferenceLine x={nowLabel} stroke="#10b981" strokeDasharray="4 2" />}
          <Line type="monotone" dataKey="temp" stroke="#10b981" strokeWidth={2} dot={false} name="Temp" />
          <Line type="monotone" dataKey="feels" stroke="#94a3b8" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="Feels like" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
