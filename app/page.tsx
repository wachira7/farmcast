"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Leaf, CloudRain, TreePine, Loader2 } from "lucide-react"

const QUICK_LOCATIONS = [
  { name: "Bomet", lat: -0.7869, lon: 35.3394 },
  { name: "Nairobi", lat: -1.2921, lon: 36.8219 },
  { name: "Kisumu", lat: -0.1022, lon: 34.7617 },
  { name: "Mombasa", lat: -4.0435, lon: 39.6682 },
  { name: "Eldoret", lat: 0.5143, lon: 35.2698 },
  { name: "Nakuru", lat: -0.3031, lon: 36.0800 },
]

export default function LandingPage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [geocoding, setGeocoding] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  function goToLocation(lat: number, lon: number, name: string) {
    router.push(`/dashboard?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}`)
  }

  async function geocodeAndGo(q: string) {
    setGeocoding(true)
    setGeoError(null)
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Location not found")
      goToLocation(data.lat, data.lon, data.name)
    } catch (e: unknown) {
      setGeoError(e instanceof Error ? e.message : "Location not found")
      setGeocoding(false)
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return

    // Check quick locations first (instant)
    const match = QUICK_LOCATIONS.find((l) => l.name.toLowerCase() === q.toLowerCase())
    if (match) {
      goToLocation(match.lat, match.lon, match.name)
      return
    }

    // Geocode any other query
    await geocodeAndGo(q)
  }

  function useMyLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) => goToLocation(pos.coords.latitude, pos.coords.longitude, "My Location"),
      () => setGeoError("Location access denied.")
    )
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
      {/* Hero */}
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-4 flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          <Leaf className="h-3.5 w-3.5" />
          Powered by Weather-AI
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Farm<span className="text-emerald-600">Cast</span>
        </h1>
        <p className="mt-4 max-w-md text-lg text-zinc-500 dark:text-zinc-400">
          Hyper-local weather intelligence and canopy analysis for Kenyan agroforestry farms.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="w-full max-w-lg">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setGeoError(null) }}
              placeholder="Search any town or county in Kenya…"
              disabled={geocoding}
              className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <button
            type="submit"
            disabled={geocoding}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 disabled:opacity-60"
          >
            {geocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Go"}
          </button>
        </div>

        {geoError && (
          <p className="mt-2 text-xs text-red-500">{geoError}</p>
        )}
        {geocoding && (
          <p className="mt-2 text-xs text-zinc-400">Finding location…</p>
        )}
      </form>

      {/* Use my location */}
      <button
        onClick={useMyLocation}
        disabled={geocoding}
        className="mt-3 flex items-center gap-1.5 text-sm text-zinc-500 underline-offset-2 hover:text-emerald-600 hover:underline disabled:opacity-50"
      >
        <MapPin className="h-3.5 w-3.5" /> Use my current location
      </button>

      {/* Quick locations */}
      <div className="mt-10 w-full max-w-lg">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Quick access</p>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_LOCATIONS.map((loc) => (
            <button
              key={loc.name}
              onClick={() => goToLocation(loc.lat, loc.lon, loc.name)}
              disabled={geocoding}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              {loc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Feature pills */}
      <div className="mt-14 flex flex-wrap justify-center gap-3 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1 dark:border-zinc-800">
          <CloudRain className="h-3 w-3 text-blue-400" /> 7-day forecast
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1 dark:border-zinc-800">
          <TreePine className="h-3 w-3 text-emerald-500" /> Canopy analysis
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1 dark:border-zinc-800">
          <Leaf className="h-3 w-3 text-lime-500" /> AI farm insights
        </span>
      </div>
    </main>
  )
}
