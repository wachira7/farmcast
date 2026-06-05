"use client"

import Image from "next/image"
import { TreePine, Clock, ChevronRight } from "lucide-react"
import type { TreeAnalysisSummary } from "@/types/weather"

interface Props {
  analyses: TreeAnalysisSummary[]
  onSelect?: (id: string) => void
}

export default function TreesHistory({ analyses, onSelect }: Props) {
  if (analyses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <TreePine className="mx-auto mb-3 h-8 w-8 text-zinc-300 dark:text-zinc-700" />
        <p className="text-sm font-medium text-zinc-500">No analyses yet</p>
        <p className="mt-1 text-xs text-zinc-400">Upload a farm photo above to get started</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Past Analyses</h3>
      </div>
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {analyses.map((a) => (
          <li key={a.analysis_id}>
            <button
              onClick={() => onSelect?.(a.analysis_id)}
              className="w-full flex items-center gap-4 px-5 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
            >
              {a.overlay_image_url ? (
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <Image src={a.overlay_image_url} alt="Analysis" fill className="object-cover" />
                </div>
              ) : (
                <div className="h-12 w-16 shrink-0 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
                  <TreePine className="h-5 w-5 text-emerald-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate">
                  {a.location ?? a.county ?? "Unnamed farm"}
                </p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(a.timestamp).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="text-emerald-600 font-medium">{a.total_tree_count} trees</span>
                  <span>{a.canopy_coverage_pct.toFixed(1)}% canopy</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-300 shrink-0" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
