export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ")
}

export function formatTemp(temp: number): string {
  return `${Math.round(temp)}°C`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-KE", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export function dayAbbr(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-KE", { weekday: "short" })
}

export function hourLabel(isoTime: string): string {
  const h = new Date(isoTime).getHours()
  if (h === 0) return "12am"
  if (h < 12) return `${h}am`
  if (h === 12) return "12pm"
  return `${h - 12}pm`
}

export function uvLabel(index: number): { label: string; color: string } {
  if (index <= 2) return { label: "Low", color: "text-green-500" }
  if (index <= 5) return { label: "Moderate", color: "text-yellow-500" }
  if (index <= 7) return { label: "High", color: "text-orange-500" }
  if (index <= 10) return { label: "Very High", color: "text-red-500" }
  return { label: "Extreme", color: "text-purple-500" }
}

// WMO weather interpretation codes → human label
const WMO_LABELS: Record<string, string> = {
  "0": "Clear sky", "1": "Mainly clear", "2": "Partly cloudy", "3": "Overcast",
  "45": "Fog", "48": "Icy fog",
  "51": "Light drizzle", "53": "Drizzle", "55": "Heavy drizzle",
  "61": "Light rain", "63": "Rain", "65": "Heavy rain",
  "71": "Light snow", "73": "Snow", "75": "Heavy snow",
  "77": "Snow grains",
  "80": "Light showers", "81": "Showers", "82": "Heavy showers",
  "85": "Snow showers", "86": "Heavy snow showers",
  "95": "Thunderstorm", "96": "Thunderstorm with hail", "99": "Severe thunderstorm",
}

export function wmoLabel(code: string): string {
  return WMO_LABELS[code] ?? `Code ${code}`
}
