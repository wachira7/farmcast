# FarmCast — Agroforestry Weather Dashboard

A hyper-local weather intelligence platform built for Kenyan agroforestry farmers, powered by the [Weather-AI API](https://weather-ai.co). Built as part of the Weather-AI technical integration assessment.

---

## Features

### Weather Intelligence
- **Location search** : search any Kenyan town or county; resolves coordinates via OpenStreetMap Nominatim (Kenya-biased, global fallback)
- **IP auto-detection** : on first load, detects the user's region via `/v1/weather-geo` and shows a contextual weather banner
- **Current conditions** : temperature, feels-like, wind, humidity, UV index with WMO condition icons
- **7-day forecast** : daily high/low area chart + icon strip with precipitation probability
- **24-hour breakdown** : scrollable hourly timeline with a recharts line chart and live "now" marker
- **Nearby farm conditions** : dynamically computes the 3 geographically nearest Kenyan agricultural locations (Haversine distance across all 47 counties) and shows live current conditions for each via `/v1/current`

### Farm Canopy Analysis
- **Drag-and-drop upload** : aerial/ground photo → AI tree count, health breakdown (healthy/needs care/replace), canopy coverage %, overlay image, and actionable recommendations via `POST /v1/trees/analyze`
- **Analysis quota** : live quota bar before upload so the farmer knows remaining analyses via `GET /v1/trees/quota`
- **Analysis history** : past analyses list with thumbnail, date, tree count and canopy % via `GET /v1/trees/history`; new analyses prepend instantly without a reload

### Farmer Experience
- **Onboarding wizard** : 3-step profile modal on first visit (name to farm name + county and primary crop) stored in `localStorage`; skips on return visits
- **Personalised dashboard** : time-aware greeting ("Good morning, Warutere") in the weather card, home county highlighted with ★ in the quick-access grid
- **Pre-filled analysis form** : county, farm name and farmer ID auto-populated from the onboarding profile
- **API usage quota** : monthly request and AI-request quota bars via `GET /v1/usage`

### Reliability & Error Handling
- **429 Rate limit** : shows quota-reset time in minutes
- **401 / 403** : "Invalid API key" with context
- **502 / 503** : "Service unavailable, try again" with WifiOff indicator
- **500** : "Server error" with retry button
- **Network failure** : caught at the `fetch()` level before hitting the API, returns 503 gracefully
- All API proxy routes wrap upstream calls in try/catch block thus the key is never exposed to the browser

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| Geocoding | OpenStreetMap Nominatim |
| Deployment | Vercel |

---

## Local Setup

### Prerequisites
- Node.js 18+
- Yarn

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/farmcast.git
cd farmcast

# 2. Install dependencies
yarn install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Weather-AI API key

# 4. Run the development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description |
|---|---|
| `WEATHER_AI_API_KEY` | Your Weather-AI API key (prefixed `wai_xxxx`) |

```env
# .env.local
WEATHER_AI_API_KEY=wai_your_key_here
```

> The key is used exclusively in Next.js API routes (server-side). It is never sent to the browser.

---

## Project Structure

```
├── app/
│   ├── page.tsx                    # Landing - search, IP auto-detect, onboarding
│   ├── dashboard/page.tsx          # Weather dashboard
│   ├── farm-analysis/page.tsx      # Canopy analysis + quota + history
│   └── api/
│       ├── weather/route.ts        #  GET /v1/weather
│       ├── forecast/route.ts       #  GET /v1/daily
│       ├── hourly/route.ts         #  GET /v1/hourly
│       ├── current/route.ts        #  GET /v1/current
│       ├── weather-geo/route.ts    #  GET /v1/weather-geo
│       ├── trees/route.ts          #  POST /v1/trees/analyze
│       ├── trees/quota/route.ts    #  GET /v1/trees/quota
│       ├── trees/history/route.ts  #  GET /v1/trees/history
│       ├── usage/route.ts          #  GET /v1/usage
│       └── geocode/route.ts        #  Nominatim OSM (location name i.e lat/lon)
├── components/
│   ├── WeatherCard.tsx             # Current conditions hero + personalised greeting
│   ├── ForecastChart.tsx           # 7-day strip + recharts area chart
│   ├── HourlyTimeline.tsx          # 24h scrollable timeline + line chart
│   ├── NearbyConditions.tsx        # 3 nearest counties via Haversine + /v1/current
│   ├── AISummary.tsx               # AI insight callout
│   ├── TreeAnalysisUpload.tsx      # Drag-and-drop upload + results display
│   ├── TreesQuotaBar.tsx           # Monthly analysis quota progress bar
│   ├── TreesHistory.tsx            # Past analyses list with thumbnails
│   ├── UsageQuota.tsx              # API request quota progress bars
│   └── OnboardingWizard.tsx        # 3-step farmer profile modal
├── lib/
│   ├── weather-api.ts              # Typed client-side fetch helpers
│   ├── errors.ts                   # Structured API error parsing (429/401/502/503/500)
│   ├── profile.ts                  # localStorage farmer profile (read/write/clear)
│   ├── locations.ts                # 47 Kenyan county seats + Haversine nearest-neighbour
│   └── utils.ts                    # WMO condition codes, temp/date/UV formatters
└── types/
    └── weather.ts                  # TypeScript types for all Weather-AI API responses
```

---

## Weather-AI Endpoints Used

| Endpoint | Method | Usage |
|---|---|---|
| `/v1/weather` | GET | Current conditions + hourly + daily forecast (main dashboard) |
| `/v1/daily` | GET | 7-day daily forecast |
| `/v1/hourly` | GET | 24-hour breakdown |
| `/v1/current` | GET | Lightweight current conditions for nearby locations widget |
| `/v1/weather-geo` | GET | IP-based region auto-detection on landing page |
| `/v1/trees/analyze` | POST | Farm canopy AI analysis (tree count, health, overlay) |
| `/v1/trees/quota` | GET | Monthly analysis quota remaining |
| `/v1/trees/history` | GET | Past analyses list |
| `/v1/usage` | GET | Monthly API request quota tracking |

---

## Deployment

The app is deployed on Vercel. Set `WEATHER_AI_API_KEY` as an environment variable in your Vercel project settings before deploying.


