export interface KenyaLocation {
  name: string
  label: string // agricultural identity
  lat: number
  lon: number
}

// 47 county seats + key agricultural towns with their farming identity
export const KENYA_LOCATIONS: KenyaLocation[] = [
  { name: "Nairobi", label: "Urban Horticulture", lat: -1.2921, lon: 36.8219 },
  { name: "Mombasa", label: "Coastal Farming", lat: -4.0435, lon: 39.6682 },
  { name: "Kisumu", label: "Rice & Fish", lat: -0.1022, lon: 34.7617 },
  { name: "Nakuru", label: "Mixed Farming", lat: -0.3031, lon: 36.08 },
  { name: "Eldoret", label: "Wheat Belt", lat: 0.5143, lon: 35.2698 },
  { name: "Bomet", label: "Tea Belt", lat: -0.7869, lon: 35.3394 },
  { name: "Kericho", label: "Tea Capital", lat: -0.3686, lon: 35.2863 },
  { name: "Meru", label: "Coffee & Miraa", lat: 0.047, lon: 37.6496 },
  { name: "Nyeri", label: "Coffee Zone", lat: -0.4167, lon: 36.95 },
  { name: "Thika", label: "Pineapple & Horticulture", lat: -1.0332, lon: 37.0693 },
  { name: "Machakos", label: "Dryland Farming", lat: -1.5177, lon: 37.2634 },
  { name: "Kitui", label: "Cotton & Mango", lat: -1.3667, lon: 38.0167 },
  { name: "Embu", label: "Coffee & Tea", lat: -0.5333, lon: 37.45 },
  { name: "Kakamega", label: "Sugarcane Belt", lat: 0.2827, lon: 34.7519 },
  { name: "Bungoma", label: "Sugarcane & Maize", lat: 0.5635, lon: 34.5606 },
  { name: "Kisii", label: "Tea & Banana", lat: -0.6817, lon: 34.766 },
  { name: "Migori", label: "Tobacco & Rice", lat: -1.0634, lon: 34.4731 },
  { name: "Homa Bay", label: "Mango & Cassava", lat: -0.5267, lon: 34.4571 },
  { name: "Siaya", label: "Sorghum & Millet", lat: 0.0612, lon: 34.2878 },
  { name: "Vihiga", label: "Tea Smallholders", lat: 0.0, lon: 34.7167 },
  { name: "Busia", label: "Sugarcane & Maize", lat: 0.4607, lon: 34.111 },
  { name: "Nandi", label: "Tea & Dairy", lat: 0.1833, lon: 35.1 },
  { name: "Trans Nzoia", label: "Maize Granary", lat: 1.0154, lon: 35.0003 },
  { name: "West Pokot", label: "Pastoral & Sorghum", lat: 1.25, lon: 35.1167 },
  { name: "Uasin Gishu", label: "Wheat & Maize", lat: 0.5167, lon: 35.2833 },
  { name: "Elgeyo-Marakwet", label: "Horticulture Valley", lat: 0.9, lon: 35.5167 },
  { name: "Nyandarua", label: "Potato Belt", lat: -0.1833, lon: 36.35 },
  { name: "Laikipia", label: "Ranch & Wheat", lat: 0.2, lon: 36.6 },
  { name: "Samburu", label: "Pastoral", lat: 1.0, lon: 36.7 },
  { name: "Isiolo", label: "Pastoral", lat: 0.3542, lon: 37.5822 },
  { name: "Marsabit", label: "Pastoral & Camel", lat: 2.3284, lon: 37.9899 },
  { name: "Mandera", label: "Pastoral", lat: 3.9366, lon: 41.8669 },
  { name: "Wajir", label: "Pastoral", lat: 1.7471, lon: 40.0573 },
  { name: "Garissa", label: "Pastoral & Irrigation", lat: -0.4532, lon: 39.6461 },
  { name: "Tana River", label: "Irrigation & Livestock", lat: -1.7, lon: 40.05 },
  { name: "Lamu", label: "Coconut & Cassava", lat: -2.2686, lon: 40.9022 },
  { name: "Kilifi", label: "Cashew & Coconut", lat: -3.6305, lon: 39.8499 },
  { name: "Kwale", label: "Cashew & Cotton", lat: -4.1739, lon: 39.4525 },
  { name: "Taita-Taveta", label: "Horticulture & Coffee", lat: -3.3833, lon: 38.3667 },
  { name: "Makueni", label: "Mango & Avocado", lat: -1.8, lon: 37.6167 },
  { name: "Kajiado", label: "Livestock & Horticulture", lat: -1.8516, lon: 36.7767 },
  { name: "Narok", label: "Wheat & Livestock", lat: -1.0836, lon: 35.8716 },
  { name: "Kirinyaga", label: "Rice & Coffee", lat: -0.6, lon: 37.3167 },
  { name: "Murang'a", label: "Tea & Coffee", lat: -0.7167, lon: 37.15 },
  { name: "Kiambu", label: "Tea & Coffee", lat: -1.0314, lon: 36.8314 },
  { name: "Tharaka-Nithi", label: "Coffee & Millet", lat: 0.0, lon: 38.15 },
  { name: "Nyamira", label: "Tea & Dairy", lat: -0.5667, lon: 34.9333 },
]

// Haversine distance in km
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(a))
}

export function nearestLocations(lat: number, lon: number, count = 3): KenyaLocation[] {
  return [...KENYA_LOCATIONS]
    .map((loc) => ({ ...loc, dist: haversine(lat, lon, loc.lat, loc.lon) }))
    .filter((loc) => loc.dist > 15) // exclude the current location itself
    .sort((a, b) => a.dist - b.dist)
    .slice(0, count)
}
