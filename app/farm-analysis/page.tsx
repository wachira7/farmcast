"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, TreePine, Info } from "lucide-react"
import TreeAnalysisUpload from "@/components/TreeAnalysisUpload"

function FarmAnalysisContent() {
  const params = useSearchParams()
  const lat = params.get("lat")
  const lon = params.get("lon")
  const name = params.get("name") ?? "your farm"

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}`}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
      </div>

      {/* Title */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-xl bg-white/20 p-2">
            <TreePine className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Farm Canopy Analysis</h1>
            <p className="text-emerald-200 text-sm">{name}</p>
          </div>
        </div>
        <p className="text-emerald-100 text-sm mt-3">
          Upload an aerial or ground-level photo of your farm. Our AI will count trees,
          assess canopy health, and provide actionable recommendations.
        </p>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/20 dark:text-blue-300">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <span>
          Works best with aerial photos taken from a drone or satellite imagery. Ground-level
          photos with visible canopy also work. Supported: JPEG, PNG, WEBP up to 20 MB.
        </span>
      </div>

      <TreeAnalysisUpload />
    </div>
  )
}

export default function FarmAnalysisPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    }>
      <FarmAnalysisContent />
    </Suspense>
  )
}
