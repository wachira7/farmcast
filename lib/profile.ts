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

export function getProfile(): FarmerProfile | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as FarmerProfile) : null
  } catch {
    return null
  }
}

export function saveProfile(profile: FarmerProfile): void {
  localStorage.setItem(KEY, JSON.stringify(profile))
}

export function clearProfile(): void {
  localStorage.removeItem(KEY)
}
