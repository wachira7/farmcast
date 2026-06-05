"use client"

import { useState } from "react"
import { Leaf, User, MapPin, Sprout, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { saveProfile, KENYAN_COUNTIES, CROPS, type FarmerProfile } from "@/lib/profile"

interface Props {
  onComplete: (profile: FarmerProfile) => void
}

const STEPS = [
  { icon: <User className="h-5 w-5" />, title: "Welcome to FarmCast", subtitle: "Tell us your name to get started" },
  { icon: <MapPin className="h-5 w-5" />, title: "Your Farm", subtitle: "Help us personalise your weather data" },
  { icon: <Sprout className="h-5 w-5" />, title: "Primary Crop", subtitle: "We'll tailor insights to what you grow" },
]

export default function OnboardingWizard({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FarmerProfile>({ name: "", farmName: "", county: "", crop: "" })

  function set(field: keyof FarmerProfile, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function canAdvance(): boolean {
    if (step === 0) return form.name.trim().length > 0
    if (step === 1) return form.farmName.trim().length > 0 && form.county.length > 0
    if (step === 2) return form.crop.length > 0
    return false
  }

  function advance() {
    if (step < 2) { setStep((s) => s + 1); return }
    saveProfile(form)
    onComplete(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 pt-8 pb-6 text-white">
          <div className="mb-4 flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-wider uppercase">FarmCast</span>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <span className="rounded-full bg-white/20 p-2">{STEPS[step].icon}</span>
            <h2 className="text-xl font-bold">{STEPS[step].title}</h2>
          </div>
          <p className="text-emerald-100 text-sm">{STEPS[step].subtitle}</p>

          {/* Progress dots */}
          <div className="flex gap-2 mt-5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? "bg-white" : "bg-white/30"}`}
              />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          {step === 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Your name</label>
              <input
                autoFocus
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canAdvance() && advance()}
                placeholder="e.g. Warutere"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Farm name</label>
                <input
                  autoFocus
                  type="text"
                  value={form.farmName}
                  onChange={(e) => set("farmName", e.target.value)}
                  placeholder="e.g. Kapkimolwa Farm"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">County</label>
                <select
                  value={form.county}
                  onChange={(e) => set("county", e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <option value="">Select county…</option>
                  {KENYAN_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Primary crop</label>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {CROPS.map((crop) => (
                  <button
                    key={crop}
                    onClick={() => set("crop", crop)}
                    className={`rounded-xl border px-3 py-2.5 text-sm text-left transition ${
                      form.crop === crop
                        ? "border-emerald-500 bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-emerald-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {crop}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          ) : <div />}

          <button
            onClick={advance}
            disabled={!canAdvance()}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40"
          >
            {step === 2 ? (
              <><Check className="h-4 w-4" /> Get started</>
            ) : (
              <>Next <ChevronRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
