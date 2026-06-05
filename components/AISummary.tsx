"use client"

import { Sparkles } from "lucide-react"

interface Props {
  summary: string
  title?: string
}

export default function AISummary({ summary, title = "AI Weather Insight" }: Props) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-emerald-600" />
        <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{summary}</p>
    </div>
  )
}
