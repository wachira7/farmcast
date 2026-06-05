"use client"

import Image from "next/image"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import type { DailyForecast } from "@/types/weather"
import { dayAbbr, wmoLabel } from "@/lib/utils"

interface Props {
  daily: DailyForecast[]
}

export default function ForecastChart({ daily }: Props) {
  const data = daily.slice(0, 7).map((d) => ({
    day: dayAbbr(d.date),
    high: Math.round(d.temp_max),
    low: Math.round(d.temp_min),
    rain: Math.round(d.precipitation_sum * 10) / 10,
    chance: d.precipitation_probability,
    icon: d.icon,
    condition: wmoLabel(d.condition_code),
  }))

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">7-Day Forecast</h3>

      {/* Card strip */}
      <div className="mb-6 grid grid-cols-7 gap-1">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 rounded-xl bg-zinc-50 px-1 py-2 text-center dark:bg-zinc-800"
          >
            <span className="text-[10px] font-medium text-zinc-500 uppercase">{d.day}</span>
            <Image src={d.icon} alt={d.condition} width={28} height={28} unoptimized />
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{d.high}°</span>
            <span className="text-[10px] text-zinc-400">{d.low}°</span>
            <span className="text-[10px] text-blue-500">{d.chance}%</span>
          </div>
        ))}
      </div>

      {/* Temperature chart */}
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="high" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="low" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit="°" />
          <Tooltip
            formatter={(v, name) => [`${v}°C`, name === "high" ? "High" : "Low"]}
            contentStyle={{ borderRadius: 10, fontSize: 12 }}
          />
          <Area type="monotone" dataKey="high" stroke="#10b981" fill="url(#high)" strokeWidth={2} dot={{ r: 3 }} />
          <Area type="monotone" dataKey="low" stroke="#0ea5e9" fill="url(#low)" strokeWidth={2} dot={{ r: 3 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
