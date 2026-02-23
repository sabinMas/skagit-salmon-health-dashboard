# Puget Sound Salmon Health Dashboard

> An interactive public dashboard tracking salmon population health across Puget Sound watersheds — powered by real data from WDFW, USGS, and WSDOT.

**Live site:** https://puget-salmon-health.vercel.app

---

## What It Does

The dashboard answers two questions:

1. **"How are the salmon doing?"** — visual, data-backed indicators across 9 Puget Sound watersheds
2. **"What's being done about it?"** — a curated index of real habitat restoration, monitoring, and stewardship projects

Data is sourced from public government APIs (WDFW SPI database, USGS NWIS stream gauges, WSDOT fish passage barrier database). No fabricated or mock data is shown to end users.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.5 (App Router, React Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Data | Pre-seeded JSON + live USGS API (see Data Architecture below) |
| Deployment | Vercel (auto-deploy on push to `main`) |
| Charts | Recharts |
| Maps | Leaflet + react-leaflet |

---

## Project Structure

```
puget-salmon-health/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home page
│   ├── dashboard/              # Salmon data visualization
│   │   ├── page.tsx            # Main dashboard (map, charts, filters)
│   │   ├── layout.tsx          # Dashboard layout (Leaflet CSS, metadata)
│   │   └── [basin]/page.tsx    # Per-watershed detail page
│   ├── learn/                  # Educational modules
│   │   ├── page.tsx            # Learn index
│   │   ├── salmon-life-cycle/  # Built module
│   │   ├── why-salmon-matter/  # Built module
│   │   ├── treaty-rights/      # Built module
│   │   ├── reading-the-dashboard/ # Built module
│   │   ├── educators/          # Educator resources page
│   │   └── [module]/page.tsx   # Catch-all for future modules
│   ├── stewardship/            # Restoration project showcase
│   │   ├── page.tsx            # Project index
│   │   └── [project]/page.tsx  # Project detail page
│   ├── about/                  # About, data sources, contact
│   ├── api/                    # Next.js API routes
│   │   ├── wdfw/               # Serves pre-seeded salmon-returns.json
│   │   ├── usgs/               # Live USGS stream temperatures (15-min ISR)
│   │   ├── barriers/           # WSDOT fish passage barriers (15-min ISR)
│   │   ├── scrape/             # Aggregated WDFW + NOAA data (15-min ISR)
│   │   └── contact/            # Contact form handler (Resend)
│   ├── layout.tsx              # Root layout: font, nav, footer, skip link
│   └── globals.css             # Design tokens + Tailwind config
│
├── components/
│   ├── layout/                 # SiteHeader, SiteFooter
│   ├── ui/                     # Card, PageHeader, StatusBadge, InfoTooltip
│   ├── dashboard/              # SalmonMetricCard, WatershedMap, WatershedSelector,
│   │                           # SpeciesFilter, IndicatorChart
│   └── stewardship/            # ProjectList, ProjectCard
│
├── lib/
│   └── data/                   # Data adapters
│       ├── watersheds.ts       # 9 watershed definitions + slugs
│       ├── species.ts          # 6 salmon species
│       ├── salmon-returns.ts   # Reads real/salmon-returns.json; exports salmonDataFetchedAt
│       ├── projects.ts         # 9 real stewardship projects
│       └── real/
│           └── salmon-returns.json   # Pre-seeded WDFW data (391 records, 106KB)
│
├── scripts/
│   └── fetch-wdfw.mjs          # Seed script: fetches WDFW API → writes salmon-returns.json
│
├── types/index.ts              # TypeScript interfaces
├── public/data/
│   └── puget-sound-watersheds.geojson  # Watershed polygons (2.6MB, cached 1yr)
├── docs/
│   └── wdfw-schema.md          # WDFW API field mapping reference
├── PLANNING.md                 # Architecture & design decisions
├── TASKS.md                    # Milestone tracking
└── CLAUDE.md                   # Claude Code session log
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/sabinMas/puget-salmon-health.git
cd puget-salmon-health
npm install
npm run dev
```

Open [http://localhost:3010](http://localhost:3010).

### Build for Production

```bash
npm run build
npm start
```

---

## Data Architecture

### The Adapter Pattern

All data access goes through adapter functions in `lib/data/`. The UI never directly calls APIs or reads files — it always calls adapters:

```typescript
import { getSalmonReturns } from '@/lib/data/salmon-returns';
import { getProjects }      from '@/lib/data/projects';
import { getWatersheds }    from '@/lib/data/watersheds';
```

This makes it straightforward to upgrade data sources without changing any component code.

### Current Data Sources

| Data | Source | How It Works |
|------|--------|-------------|
| Salmon returns | WDFW SPI (`data.wa.gov`, dataset `fgyz-n3uk`) | Pre-seeded JSON; refresh with `npm run data:refresh` |
| Stream temperatures | USGS NWIS (`waterservices.usgs.gov`) | Live API call, 15-min ISR cache |
| Fish passage barriers | WSDOT ArcGIS REST API | Live API call, 15-min ISR cache |
| Watershed boundaries | USGS NHD (GeoJSON) | Static file in `/public/data/`, cached 1 year |

### Refreshing Salmon Return Data

The WDFW salmon return data is stored as a pre-seeded JSON file to avoid rate limits and build-time API failures. To update it with the latest WDFW data:

```bash
npm run data:refresh
```

This runs `scripts/fetch-wdfw.mjs`, which:
1. Fetches all Puget Sound Chinook records from the WDFW Socrata API
2. Maps population names to watershed slugs
3. Writes `lib/data/real/salmon-returns.json` (~106KB, 391 records)

Run this periodically (e.g., annually after WDFW publishes new escapement data) and commit the updated JSON.

---

## Environment Variables

For the contact form to work, set these in Vercel project settings (Settings → Environment Variables):

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) — free tier is sufficient |
| `CONTACT_EMAIL` | Email address where contact form submissions are delivered |

For local development, create a `.env.local` file:

```
RESEND_API_KEY=re_your_key_here
CONTACT_EMAIL=you@example.com
```

---

## Milestones

| Milestone | Status |
|-----------|--------|
| M0 Foundation | ✅ Complete |
| M1 Dashboard MVP | ✅ Complete |
| M2 Nations System | Removed (no real partnerships) |
| M3 Learn Hub | ✅ Complete |
| M4 Stewardship & About | ✅ Complete |
| M5 Real API Data | ✅ Complete |
| M6 Stewardship Content | 🚧 In progress |
| M7 Polish / Launch | ✅ Complete |

See [TASKS.md](./TASKS.md) for task-level detail.

---

## Design Principles

**Data first.** Every number on the dashboard comes from a named government data source. The About page documents every source, update frequency, and known limitation.

**Accessible.** WCAG 2.1 Level AA. Keyboard navigation, screen-reader-friendly charts (accessible data tables behind every chart), semantic HTML, color + text/icon pairings, skip-to-content links.

**Plain language.** A 7th grader should understand the landing page. Technical terms are explained when introduced. Every chart has a 2–3 sentence plain-language interpretation.

**Built to grow.** Data adapters, typed interfaces, and a clear adapter pattern mean new watersheds, species, or data sources can be added without architectural changes.

---

## Contributing

1. Read [PLANNING.md](./PLANNING.md) for architecture and design decisions
2. Check [TASKS.md](./TASKS.md) for current priorities
3. Follow the adapter pattern — all data access through `lib/data/` functions
4. Run `npm run lint && npm run build` before submitting a PR
5. Test keyboard navigation and screen reader behavior for any UI changes

---

## Data Sources & Attribution

- **WDFW Salmonid Population Indicators** — Washington Department of Fish and Wildlife, `data.wa.gov` dataset `fgyz-n3uk`
- **USGS National Water Information System** — U.S. Geological Survey stream gauge network
- **WSDOT Fish Passage Barrier API** — Washington State Department of Transportation
- **Watershed Boundaries** — USGS National Hydrography Dataset

---

## Land Acknowledgment

This dashboard tracks salmon across the traditional territories of the Coast Salish peoples, including but not limited to the Duwamish, Muckleshoot, Puyallup, Snoqualmie, Suquamish, Stillaguamish, Tulalip, Swinomish, Lummi, Nooksack, Nisqually, Squaxin Island, and Skokomish peoples. Their relationship with salmon predates written history and continues today through treaty rights, co-management, and stewardship programs documented on this site.

---

**License:** MIT
