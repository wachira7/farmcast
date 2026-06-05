"use client"

import { Activity } from "lucide-react"
import type { UsageResponse } from "@/types/weather"

interface Props {
  data: UsageResponse
}

export default function UsageQuota({ data }: Props) {
  const reqPct = Math.round(((data.limits.requests - data.remaining.requests) / data.limits.requests) * 100)
  const aiPct = data.limits.aiRequests > 0
    ? Math.round(((data.limits.aiRequests - data.remaining.aiRequests) / data.limits.aiRequests) * 100)
    : 0

  const reqUsed = data.limits.requests - data.remaining.requests
  const aiUsed = data.limits.aiRequests - data.remaining.aiRequests

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-zinc-500" />
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">API Usage</h3>
        <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 capitalize dark:bg-emerald-900 dark:text-emerald-300">
          {data.plan}
        </span>
      </div>

      <div className="space-y-3">
        <QuotaBar label="Requests" used={reqUsed} limit={data.limits.requests} pct={reqPct} />
        {data.limits.aiRequests > 0 && (
          <QuotaBar label="AI Requests" used={aiUsed} limit={data.limits.aiRequests} pct={aiPct} />
        )}
      </div>

      <p className="mt-3 text-[10px] text-zinc-400">
        Max forecast: {data.limits.maxDays} days · Webhooks: {data.limits.webhooks ? "yes" : "no"} · SMS: {data.limits.sms ? "yes" : "no"}
      </p>
    </div>
  )
}

function QuotaBar({ label, used, limit, pct }: { label: string; used: number; limit: number; pct: number }) {
  const color = pct > 85 ? "bg-red-500" : pct > 60 ? "bg-yellow-500" : "bg-emerald-500"
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-zinc-500">
        <span>{label}</span>
        <span>{used.toLocaleString()} / {limit.toLocaleString()}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  )
}
