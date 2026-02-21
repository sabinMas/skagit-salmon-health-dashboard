# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Role

Full-stack web developer + data engineer. Primary mission: scrape and integrate Puget Sound Chinook salmon data from WDFW, USGS, NOAA, and the Puget Sound Partnership into a live interactive dashboard.

## Dev Command

```bash
npx nodemon app.js
# Opens at http://localhost:3000
```

No build steps or transpilation. Edit files and the server restarts automatically.

## Architecture

**Backend** — `app.js` (Express, port 3000)
- Serves all static files (`index.html`, `styles.css`, `script.js`, `data/`)
- Proxies all external API calls server-side (eliminates CORS, enables caching)
- In-memory cache per route with 15-minute TTL

**Frontend** — `index.html` / `styles.css` / `script.js`
- `index.html` — Semantic HTML only. Loads Leaflet (v1.9.4) and Chart.js (v4.3.0) from CDN, then `styles.css` and `script.js`.
- `styles.css` — All visual styling. CSS variables for theming, Flexbox/Grid for layout.
- `script.js` — All client logic (~1000+ lines), organized into labeled block-comment sections.

### script.js Sections (in order)

1. **Configuration** — API constants pointing to `/api/*` Express routes; global layer state vars.
2. **Temperature helpers** — `getTemperatureColor/Status/Icon()`, `fetchUSGSTemperatureData()`, `loadTemperatureStations()`, `createTemperatureLegend()`, `toggleTemperature()`.
3. **Fallback data** — `FALLBACK_WATERSHED_DATA` (8 watersheds) used when `/api/wdfw` is unavailable.
4. **Time slider** — `generateHistoricalData()`, `updateMapForYear()`, `toggleAnimation()`, `initializeTimeSlider()`. Synthesizes historical data back to 1990.
5. **Population helpers** — `getPopulationColor()`, `statusLabel()`, `statusClass()`, `getHabitatColor()`.
6. **Data fetching** — `fetchWDFWData()`, `loadWatershedBoundaries()`, `fetchFishBarriers()` / `loadFishBarriers()`, `toggleBarriers()`.
7. **Initialization** — `initDashboard()` orchestrates all async loads, renders circles/charts/status card.

### Data Flow

All client API calls go to Express routes on `localhost:3000`. `initDashboard()`:

1. Loads `data/puget-sound-watersheds.geojson` → Leaflet polygon layer
2. Calls `/api/barriers` → WSDOT ArcGIS → Leaflet marker layer
3. Calls `/api/usgs` → parsed temperature stations → Leaflet marker layer
4. Calls `/api/wdfw` → WDFW SPI data → falls back to `FALLBACK_WATERSHED_DATA` on error
5. Renders population circles sized by `sqrt(population)`, colored by `% of recovery target`
6. Populates Chart.js charts (5-year trend line, watershed comparison bar chart)
7. Initializes time slider (1990–2024) with play/pause animation

### Population Health Color Scale

`getPopulationColor()` in `script.js`, based on `% of recovery target`:

| Range | Color | Status |
|-------|-------|--------|
| < 5% | `#dc2626` Red | Critical |
| 5–10% | `#ea580c` Orange | Endangered |
| 10–25% | `#ca8a04` Yellow | Threatened |
| ≥ 25% | `#22c55e` Green | Stable |

## API Routes (app.js)

| Route | Source | Description |
|-------|--------|-------------|
| `GET /api/wdfw` | data.wa.gov Socrata | WDFW SPI metrics (Puget Sound Chinook) |
| `GET /api/usgs` | waterservices.usgs.gov NWIS | Stream temperature, Puget Sound bounding box |
| `GET /api/barriers` | data.wsdot.wa.gov ArcGIS | Fish passage barriers |
| `GET /api/scrape` | WDFW + NOAA + PSP | Aggregated salmon data from multiple sources |

## Adding a New Watershed

1. Add entry to `FALLBACK_WATERSHED_DATA` in `script.js` (~line 335) with fields: `watershed`, `population`, `recoveryTarget`, `latestYear`, `targetYear`, `estuary`, `tributaries`.
2. Add coordinates to the `coords` object inside `initDashboard()` (~line 975).
3. Add a matching GeoJSON feature to `data/puget-sound-watersheds.geojson`.
