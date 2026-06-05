"use client"

import { TreePine, RefreshCw } from "lucide-react"
import type { TreesQuotaResponse } from "@/types/weather"

interface Props {
  data: TreesQuotaResponse
}

export default function TreesQuotaBar({ data }: Props) {
  const pct = data.unlimited ? 0 : Math.round((data.used / data.limit) * 100)
  const resetsAt = new Date(data.resets_at).toLocaleDateString("en-KE", { month: "short", day: "numeric" })
  const color = pct > 85 ? "bg-red-500" : pct > 60 ? "bg-yellow-500" : "bg-emerald-500"

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-2 mb-3">
        <TreePine className="h-4 w-4 text-emerald-600" />
        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Analysis Quota</span>
        <span className="ml-auto text-xs text-zinc-400 flex items-center gap-1">
          <RefreshCw className="h-3 w-3" /> Resets {resetsAt}
        </span>
      </div>

      {data.unlimited ? (
        <p className="text-sm text-emerald-600 font-medium">Unlimited analyses</p>
      ) : (
        <>
          <div className="flex justify-between text-xs text-zinc-500 mb-1">
            <span>{data.used} used</span>
            <span>{data.remaining} remaining of {data.limit}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
          {data.remaining === 0 && (
            <p className="mt-2 text-xs text-red-500">Quota exhausted — resets {resetsAt}</p>
          )}
        </>
      )}
    </div>
  )
}
