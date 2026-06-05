"use client"

import { useState, useRef } from "react"
import { Upload, TreePine, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import type { TreeAnalysisResult } from "@/types/weather"
import { analyzeTrees } from "@/lib/weather-api"
import Image from "next/image"

export default function TreeAnalysisUpload() {
  const [result, setResult] = useState<TreeAnalysisResult | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError(null)
    setResult(null)
    setPreview(URL.createObjectURL(file))

    const fd = new FormData()
    fd.append("image", file)
    fd.append("county", "Bomet")

    setLoading(true)
    try {
      const data = await analyzeTrees(fd)
      setResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed")
    } finally {
      setLoading(false)
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-10 text-center transition hover:border-emerald-500 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40"
      >
        {loading ? (
          <Loader2 className="mb-3 h-10 w-10 animate-spin text-emerald-500" />
        ) : (
          <Upload className="mb-3 h-10 w-10 text-emerald-400" />
        )}
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {loading ? "Analysing farm image…" : "Drop a farm/aerial photo here"}
        </p>
        <p className="mt-1 text-xs text-zinc-400">JPEG, PNG or WEBP · max 20 MB</p>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFileChange} />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {preview && result && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Images */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Overlay</p>
            <div className="relative aspect-video overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
              <Image src={result.overlay_image_url} alt="Tree overlay" fill className="object-cover" />
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <StatRow label="Total Trees" value={result.total_tree_count.toString()} icon={<TreePine className="h-4 w-4" />} />
            {result.tree_density_per_acre && (
              <StatRow label="Density / Acre" value={result.tree_density_per_acre.toFixed(1)} />
            )}
            <StatRow label="Canopy Coverage" value={`${result.canopy_coverage_pct.toFixed(1)}%`} />
            <StatRow label="Confidence" value={`${Math.round(result.confidence_score * 100)}%`} />
            {result.tree_species_guess && (
              <StatRow label="Species" value={result.tree_species_guess} />
            )}

            {/* Health breakdown */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Tree Health</p>
              <div className="space-y-1.5">
                <HealthBar label="Healthy" count={result.tree_health.healthy} total={result.total_tree_count} color="bg-emerald-500" />
                <HealthBar label="Needs Care" count={result.tree_health.needs_care} total={result.total_tree_count} color="bg-yellow-500" />
                <HealthBar label="Replace" count={result.tree_health.needs_replacement} total={result.total_tree_count} color="bg-red-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {result && result.recommendations.length > 0 && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Recommendations
          </p>
          <ul className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
            {result.recommendations.map((r, i) => (
              <li key={i} className="flex gap-2"><span className="text-emerald-500">•</span>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function StatRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-800">
      <span className="flex items-center gap-1.5 text-xs text-zinc-500">{icon}{label}</span>
      <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{value}</span>
    </div>
  )
}

function HealthBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 text-zinc-500">{label}</span>
      <div className="flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700 h-1.5">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-right font-medium text-zinc-700 dark:text-zinc-300">{count}</span>
    </div>
  )
}
