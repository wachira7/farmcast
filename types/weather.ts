export interface WeatherLocation {
  lat: number
  lon: number
  timezone: string
  country: string
  requested_lat?: number
  requested_lon?: number
}

export interface CurrentWeather {
  time: string
  temperature: number
  wind_speed: number
  wind_direction: number
  condition_code: string
  icon: string
  icon_path: string
}

export interface HourlyForecast {
  time: string
  temperature: number
  feels_like: number
  precipitation_probability: number
  wind_speed: number
  wind_gust: number
  condition_code: string
  icon: string
  icon_path: string
  humidity: number
  uv_index: number
}

export interface DailyForecast {
  date: string
  temp_min: number
  temp_max: number
  precipitation_sum: number
  precipitation_probability: number
  wind_max: number
  condition_code: string
  icon: string
  icon_path: string
  sunrise: string
  sunset: string
}

export interface WeatherResponse {
  location: WeatherLocation
  current: CurrentWeather
  hourly: HourlyForecast[]
  daily: DailyForecast[]
}

export interface UsagePeriod {
  start: string | null
  end: string | null
  requestCount: number
  aiRequestCount: number
}

export interface UsageLimits {
  requests: number
  aiRequests: number
  maxDays: number
  webhooks: boolean
  teamSeats: number
  sms: boolean
}

export interface UsageRemaining {
  requests: number
  aiRequests: number
}

export interface UsageResponse {
  plan: string
  period: UsagePeriod
  limits: UsageLimits
  remaining: UsageRemaining
}

export interface TreeAnalysisResult {
  analysis_id: string
  timestamp: string
  farmer_id?: string
  county?: string
  location?: string
  land_acres?: number
  total_tree_count: number
  tree_density_per_acre?: number
  confidence_score: number
  canopy_coverage_pct: number
  tree_health: {
    healthy: number
    needs_care: number
    needs_replacement: number
  }
  low_confidence: boolean
  tree_species_guess?: string
  observations: string[]
  recommendations: string[]
  original_image_url: string
  overlay_image_url: string
}
