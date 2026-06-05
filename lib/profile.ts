const KEY = "farmcast_profile"

export interface FarmerProfile {
  name: string
  farmName: string
  county: string
  crop: string
}

export const KENYAN_COUNTIES = [
  "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa",
  "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu",
  "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale",
  "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit",
  "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru",
  "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu",
  "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi", "Trans Nzoia",
  "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot",
]

export const CROPS = [
  "Tea", "Coffee", "Maize", "Wheat", "Sugarcane", "Avocado",
  "Macadamia", "Pyrethrum", "Potatoes", "Beans", "Sorghum", "Millet",
  "Horticulture (mixed)", "Dairy / Fodder", "Agroforestry (mixed)",
]

// Module-level cache — useSyncExternalStore requires a stable reference
// so the same object is returned until saveProfile/clearProfile is called
let cachedProfile: FarmerProfile | null = null
let cacheReady = false

const listeners = new Set<() => void>()

export function subscribeProfile(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getProfile(): FarmerProfile | null {
  if (typeof window === "undefined") return null
  if (!cacheReady) {
    try {
      const raw = localStorage.getItem(KEY)
      cachedProfile = raw ? (JSON.parse(raw) as FarmerProfile) : null
    } catch {
      cachedProfile = null
    }
    cacheReady = true
  }
  return cachedProfile
}

export function saveProfile(profile: FarmerProfile): void {
  localStorage.setItem(KEY, JSON.stringify(profile))
  cachedProfile = profile
  cacheReady = true
  listeners.forEach((l) => l())
}

export function clearProfile(): void {
  localStorage.removeItem(KEY)
  cachedProfile = null
  listeners.forEach((l) => l())
}
