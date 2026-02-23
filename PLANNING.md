# PLANNING.md — Puget Salmon Health Dashboard

> Vision, architecture, information architecture, data model, and design decisions.

---

## 1. Vision & Purpose

The Puget Salmon Health Dashboard is a public website that answers two questions:

1. **"How are the salmon doing?"** — through clear, visual, data-backed indicators of salmon health across Puget Sound watersheds.
2. **"What's being done about it?"** — by showcasing active habitat restoration, monitoring, and stewardship projects happening across those same watersheds.

The site is not a government report or an academic paper. It's a **community learning tool** — accessible to a curious neighbor, useful to a teacher, and credible enough that an NGO or government staffer would feel comfortable citing it.

### Design Philosophy

- **Data first**: The dashboard is the primary feature. Clear, verifiable data from WDFW, USGS, and NOAA is the foundation of everything.
- **Projects show action**: The stewardship section demonstrates that recovery work is underway. Projects may list partner organizations (including tribal nations, conservation districts, NGOs) where relevant, without fabricating formal partnerships.
- **Clarity over cleverness**: Simple layouts, plain language, strong visual hierarchy. A 7th grader should be able to understand the landing page. A scientist should find the data credible.
- **Built to grow**: The data layer uses adapters that can swap mock data for live APIs. New watersheds, species, and projects can be added without redesigning the site.

---

## 2. Information Architecture

### 2.1 Sitemap

```
Home (/)
│
├── Dashboard (/dashboard)
│   ├── Overview (default view — all Puget Sound)
│   ├── By Watershed (/dashboard/[basin-slug])
│   │   └── e.g., /dashboard/skagit, /dashboard/nisqually
│   └── By Species (/dashboard?species=chinook)  ← filter, not separate route
│
├── Learn (/learn)
│   ├── Index — module overview
│   ├── Module: Salmon Life Cycle (/learn/salmon-life-cycle)
│   ├── Module: Treaty Rights & Co-Management (/learn/treaty-rights)
│   └── For Educators (/learn/educators)
│       └── Downloadable lesson plans, activity ideas
│
├── Stewardship (/stewardship)
│   ├── Index — all projects
│   └── Individual Project (/stewardship/[project-slug])
│
├── About (/about)
│   ├── About This Project
│   ├── Data Sources & Methods
│   └── Contact / Get Involved
│
└── Shared Elements (present on all pages)
    ├── Global Navigation (header)
    ├── Footer (attribution, links, land acknowledgment)
    └── "How to read this" contextual help tooltips
```

### 2.2 Navigation Structure

**Primary Navigation (header — always visible):**

| Label | Route | Notes |
|---|---|---|
| Dashboard | `/dashboard` | The data view |
| Learn | `/learn` | Education modules |
| Stewardship | `/stewardship` | Projects & stories |
| About | `/about` | Project info & data sources |

**Secondary Navigation:**
- Within Dashboard: watershed selector (dropdown/map) + species filter
- Within Learn: module list

**Utility Navigation (top-right or mobile menu):**
- Search (if implemented)

---

## 3. Core User Journeys

### Journey 1: Curious Local — "How are the salmon in my area?"

```
Home → Dashboard → Select watershed (e.g., Skagit) →
  See salmon return trends + environmental indicators →
  Read "What does this mean?" interpretation →
  (Optional) Click through to stewardship projects in that basin →
  (Optional) Click through to Learn module on salmon ecology
```

**Key need:** Fast, visual answer with enough context to understand significance.
**Design implication:** Dashboard must have a prominent geography selector and at-a-glance metrics before detailed charts.

### Journey 2: Teacher — "Find a lesson idea for my class"

```
Home → Learn → Browse modules by topic or grade band →
  Select "Why Salmon Matter" module →
  Read content, view embedded visuals →
  Scroll to "For Educators" section with lesson ideas →
  Download/copy lesson plan
```

**Key need:** Scannable, grade-appropriate content with ready-to-use materials.
**Design implication:** Learn pages need clear age-band indicators and a dedicated educator section with downloadable resources.

### Journey 3: Student (middle school) — "Learn about salmon for a school project"

```
Home → Learn → "Salmon Life Cycle" module →
  Read age-appropriate content with diagrams →
  (Optional) Explore Dashboard to find real data for their watershed →
  (Optional) Browse stewardship projects for "what's being done"
```

**Key need:** Engaging, visual, age-appropriate. Not overwhelming.
**Design implication:** Learn modules need a gentle reading level option and visual storytelling components.

### Journey 4: NGO/Government Staff — "Get context for a report or meeting"

```
Home → Dashboard → Browse multiple watersheds →
  Compare trends across basins →
  Read data source documentation (/about) →
  Reference specific stewardship projects →
  Share or cite specific charts/pages
```

**Key need:** Credible data with clear sourcing and caveats.
**Design implication:** Every chart needs source attribution and export/share capability (stretch goal).

---

## 4. Page-Level Wireframe Descriptions

### 4.1 Home Page (`/`)

**Purpose:** Orientation, emotional hook, and wayfinding. Answers: "What is this site?" and "Where should I go?"

| Order | Section | Contents |
|---|---|---|
| 1 | **Hero** | Large heading: "How Are the Salmon?" / Subheading: "Tracking salmon health across Puget Sound watersheds — with real data from WDFW, USGS, and NOAA." / Two CTAs: "Explore the Dashboard" → `/dashboard`, "View Projects" → `/stewardship` |
| 2 | **At-a-Glance Pulse** | 3–4 `<SalmonMetricCard>` components: e.g., "Chinook returns this year: [X]", "Watersheds monitored: [X]", "Active projects: [X]". Each card links to its detail view. |
| 3 | **Two-Pillar Introduction** | Left — "The Data" (brief description of the dashboard + preview chart + link). Right — "The Projects" (brief description of stewardship work + link to `/stewardship`). |
| 4 | **How to Use This Site** | Three icon+text blocks: "Check the Data" / "Learn the Story" / "See the Projects" — each a brief sentence with a link. |
| 5 | **Footer** | Site-wide footer. |

---

### 4.2 Dashboard Page (`/dashboard`)

**Purpose:** Primary data interface. Answer "how are salmon doing?" with visual indicators.

| Order | Section | Contents |
|---|---|---|
| 1 | **Page Header** | Title: "Salmon Health Dashboard" / Subtitle: "Current conditions and trends across Puget Sound watersheds." |
| 2 | **Geography & Filter Bar** | `<WatershedSelector>` (dropdown or clickable map) + `<SpeciesFilter>` (pill buttons: All, Chinook, Coho, Chum, Pink, Sockeye) + optional time range selector. Sticky on scroll. |
| 3 | **At-a-Glance Summary** | Row of 3–5 `<SalmonMetricCard>` components for the selected watershed/species: latest return estimate, trend direction (↑↓→), key environmental indicator (water temp, flow), overall status. Each card has a "What does this mean?" tooltip. |
| 4 | **Primary Chart: Salmon Returns Over Time** | `<IndicatorChart>` — line/area chart showing annual returns for the selected species + basin. Clear axis labels, legend, data source footnote. Below the chart: 2–3 sentence plain-language interpretation. |
| 5 | **Environmental Indicators Panel** | Grid of 2–3 smaller `<IndicatorChart>` components: water temperature trends, streamflow, habitat quality proxy. |
| 6 | **Context Section** | "Why This Matters" block: 1–2 paragraphs connecting the data to ecological significance. Links to relevant Learn module and stewardship projects for this watershed. |
| 7 | **Data Sources & Caveats** | Collapsible section listing data sources, update frequency, known limitations. Link to full `/about`. |

**Basin Detail Page (`/dashboard/[basin]`):** Same layout pre-filtered to that basin, with local context (map zoomed in, nearby stewardship projects, local species breakdown).

---

### 4.3 Learn Index Page (`/learn`)

**Purpose:** Hub for educational content.

| Order | Section | Contents |
|---|---|---|
| 1 | **Page Header** | Title: "Learn" / Subtitle: "Understand the story of salmon — from their life cycle and ecological role to the treaty rights and stewardship that protect them." |
| 2 | **Module Cards** | Grid of `<LearningModuleCard>` components. Each shows: module title, short description, estimated time, grade-level suitability. |
| 3 | **For Educators** | Highlighted section with links to downloadable lesson plans, activity ideas, standards alignment notes. Links to `/learn/educators`. |
| 4 | **Connection Block** | "These modules connect to the Dashboard data and the Projects. Learning is richer when you explore all three." |

---

### 4.4 Learn Module Page (`/learn/[module-slug]`)

**Purpose:** A single guided learning experience on one topic.

| Order | Section | Contents |
|---|---|---|
| 1 | **Module Header** | Title, brief description, estimated reading time, grade-level indicator. |
| 2 | **Content Body** | Prose, diagrams, embedded charts, image figures. Structured with clear H2/H3 headings. |
| 3 | **Key Takeaways** | Boxed summary: 3–5 bullet points. |
| 4 | **Connections** | Links to related Dashboard views and other Learn modules. |
| 5 | **For Educators** | Collapsible section with lesson ideas, discussion questions, activity suggestions. |

---

### 4.5 Stewardship Index (`/stewardship`)

**Purpose:** Showcase active restoration and stewardship projects happening across Puget Sound watersheds.

| Order | Section | Contents |
|---|---|---|
| 1 | **Page Header** | Title: "Stewardship & Projects" / Subtitle: "Habitat restoration, monitoring, climate adaptation, and education projects working to recover salmon across Puget Sound." |
| 2 | **Filter Bar** | Filter by: project type (restoration, monitoring, education, climate adaptation, hatchery), watershed. |
| 3 | **Project Grid** | Grid of `<ProjectCard>` components. Each shows: project name, partner organizations, location, project type tag, short description. |

---

### 4.6 Stewardship Project Page (`/stewardship/[project-slug]`)

| Order | Section | Contents |
|---|---|---|
| 1 | **Project Header** | Title, partner organizations (may include tribal nations, NGOs, agencies), location, project type, status (active/completed). |
| 2 | **Story / Description** | What the project does, why it matters, how it connects ecology and recovery goals. |
| 3 | **Impact / Results** | Data or qualitative outcomes if available. |
| 4 | **Related** | Links to relevant Dashboard basin view, related Learn modules. |

**Note on partner attribution:** Projects may list tribal nations, conservation districts, NGOs, or government agencies as partners where that information is accurate and publicly known. No special governance layer is required — standard factual attribution as you'd find in a news article.

---

### 4.7 About Page (`/about`)

| Order | Section | Contents |
|---|---|---|
| 1 | **About This Project** | Who built it, why, what it aims to do. |
| 2 | **Data Sources & Methods** | Table of data sources (WDFW, USGS, NOAA), update frequencies, links. Caveats and known limitations. |
| 3 | **Accessibility Statement** | Commitment to WCAG 2.1 AA and how to report issues. |
| 4 | **Contact** | How to reach the team, how to get involved. |

---

## 5. Data Model (Conceptual)

### Entities & Relationships

```
┌──────────────┐       ┌──────────────────┐       ┌───────────────┐
│  Watershed   │──────<│  SalmonReturn    │       │    Species    │
│  / Basin     │  1:N  │                  │       │               │
│              │       │ id               │       │ id            │
│ id           │       │ watershed_id(FK) │       │ common_name   │
│ name         │       │ species_id (FK)  │       │ scientific_nm │
│ slug         │       │ year             │       │ slug          │
│ region       │       │ count_estimate   │       │ icon          │
│ geometry_geo │       │ method           │       └───────┬───────┘
│ area_sq_km   │       │ source           │               │
└──────┬───────┘       │ confidence       │               │
       │               └──────────────────┘               │
       │  1:N                                             │
       ▼                                                  │
┌──────────────────┐       ┌──────────────────┐          │
│ EnvIndicator     │       │    Project       │          │
│ Reading          │       │                  │          │
│                  │       │ id               │          │
│ id               │       │ title            │          │
│ watershed_id(FK) │       │ slug             │          │
│ indicator_type   │       │ partnerOrgs[]    │ ← plain  │
│ value            │       │ watershed_id(FK) │   text   │
│ unit             │       │ project_type     │   list   │
│ date             │       │ status           │          │
│ source           │       │ description      │          │
└──────────────────┘       └──────────────────┘          │
                                                         │
                           SalmonReturn ────────────────┘
```

### Key Relationships

- **Watershed → SalmonReturn**: One-to-many. Returns are per-watershed, per-species, per-year.
- **Watershed → EnvIndicatorReading**: One-to-many. Readings are per-watershed, per-indicator-type, per-date.
- **Watershed → Project**: One-to-many (projects are associated with a watershed).
- **Species → SalmonReturn**: One-to-many.
- **Project.partnerOrgs**: A plain string array of organization names (tribal nations, NGOs, agencies) — no join table or relational governance required.

### Enums / Lookup Values

```typescript
// Species
type SalmonSpecies = 'chinook' | 'coho' | 'chum' | 'pink' | 'sockeye' | 'steelhead';

// Indicator types
type IndicatorType = 'water_temp' | 'streamflow' | 'dissolved_oxygen' | 'habitat_quality' | 'impervious_surface';

// Project types
type ProjectType = 'habitat_restoration' | 'monitoring' | 'climate_adaptation' | 'youth_education' | 'hatchery' | 'research';
```

---

## 6. Reusable Component Library

### Dashboard Components

| Component | Purpose | Props (key) |
|---|---|---|
| `<SalmonMetricCard>` | At-a-glance stat with label, value, trend arrow, and tooltip | `label`, `value`, `unit`, `trend`, `tooltipText`, `href` |
| `<IndicatorChart>` | Time-series line/area chart for any indicator | `data[]`, `title`, `xLabel`, `yLabel`, `source`, `interpretation` |
| `<WatershedSelector>` | Dropdown or map-based watershed picker | `watersheds[]`, `selected`, `onChange` |
| `<SpeciesFilter>` | Pill/chip buttons to filter by salmon species | `species[]`, `selected`, `onChange` |
| `<MiniDashboard>` | Compact version of key metrics for embedding on other pages | `watershedId`, `speciesId` |
| `<StatusBadge>` | Color-coded badge: healthy / caution / concern | `status`, `label` |

### Education Components

| Component | Purpose | Props (key) |
|---|---|---|
| `<LearningModuleCard>` | Card for the Learn index grid | `title`, `description`, `estimatedTime`, `gradeLevel`, `href` |
| `<KeyTakeaways>` | Boxed summary of key points | `takeaways[]` |
| `<EducatorResources>` | Collapsible section with lesson plans and activities | `resources[]` |

### Stewardship Components

| Component | Purpose | Props (key) |
|---|---|---|
| `<ProjectCard>` | Card for stewardship project grid | `project` (object with title, partnerOrgs, type, location, excerpt) |
| `<ProjectFilterBar>` | Filter by project type, watershed | `filters`, `onChange` |

### Shared / Layout Components

| Component | Purpose |
|---|---|
| `<SiteHeader>` | Global nav, logo, responsive menu |
| `<SiteFooter>` | Links, land acknowledgment, attribution |
| `<PageHeader>` | Reusable page title + subtitle + breadcrumbs |
| `<InfoTooltip>` | "What does this mean?" help icon with popover |
| `<SkipToContent>` | Accessibility skip link |
| `<Card>` | Base card component |
| `<StatusBadge>` | Color-coded status indicator |

---

## 7. Data Layer Architecture

### The Adapter Pattern

All data access goes through adapters that return consistent TypeScript interfaces, regardless of the data source.

```
UI Component
    ↓ calls
Adapter Function (e.g., getSalmonReturns())
    ↓ internally delegates to
Data Source (seeded JSON → live API)
```

### Phase Progression

| Phase | Data Source | Adapter Behavior |
|---|---|---|
| **Phase 1 (Current)** | Pre-seeded JSON (`lib/data/real/salmon-returns.json`) + live USGS API | Adapter reads local JSON for WDFW data; calls USGS NWIS at runtime for temps |
| **Phase 2** | PostgreSQL via Prisma | Adapter queries the database |
| **Phase 3** | Fully live APIs (WDFW, USGS, StreamNet) + cache | Adapter fetches from external APIs with caching/fallback |

The UI never knows or cares which phase we're in. Components call the same functions and get the same shaped data.

### Known/Target Data Sources

| Data Type | Potential Sources | Status |
|---|---|---|
| Salmon returns (abundance) | WDFW SalmonScape / data.wa.gov (fgyz-n3uk) | ✅ Live (seeded JSON, 391 records) |
| Water temperature | USGS NWIS | ✅ Live (49 stations, real-time) |
| Streamflow | USGS NWIS | Available; not yet wired |
| Habitat quality | Puget Sound Partnership indicators, NOAA | Varies |
| Watershed boundaries | USGS NHD, WA Ecology | ✅ GeoJSON in `/public/data/` |

---

## 8. Tech Stack Rationale

See **CLAUDE.md** for the full stack specification. Key reasoning:

- **Next.js** over plain React: SEO matters for a public educational site. Server-side rendering is important for content-heavy pages. API routes eliminate the need for a separate backend.
- **Tailwind** over custom CSS: Faster to build consistently. The design system is in the utility classes.
- **Seeded JSON** over a live database (Phase 1): `npm run data:refresh` keeps data fresh without requiring a database server. Migration path to Postgres is clear when needed.

---

## 9. Design Tokens & Visual Direction

### Color Palette

Design intent: Earthy, natural, accessible. Inspired by Pacific Northwest landscapes.

```
Primary:     Deep Teal (#1B5E5E)     — trust, water, depth
Secondary:   Warm Terracotta (#B85C38) — earth, salmon, warmth
Accent:      River Stone (#5C7A7A)    — neutral, calm
Background:  Off-White (#FAF8F5)      — warm paper tone
Surface:     Soft Sand (#F0EBE3)      — card backgrounds
Text:        Charcoal (#2D2D2D)       — high contrast on light bg
Text-muted:  Slate (#6B7280)          — secondary text
Success:     Forest Green (#2D6A4F)   — healthy/positive indicators
Warning:     Amber (#D4A017)          — caution indicators
Danger:      Deep Red (#9B2226)       — concern indicators
```

### Typography

```
Headings:  Source Sans 3 (loaded via next/font/google)
Body:      Same family at regular weight
Scale:     Modular scale based on 1rem = 16px base
```

### Accessibility Notes

- All color pairings must meet WCAG AA contrast ratios (4.5:1 body text, 3:1 large text).
- Status colors (green/amber/red) must never be the *only* indicator — always pair with icons or text labels.
- Chart colors should be distinguishable in grayscale and for common color blindness types.

---

## 10. Content Strategy Notes

### Voice & Tone

- **Warm but not casual**: "Welcome to the Puget Salmon Health Dashboard" not "Hey! Let's check on the salmon 🐟"
- **Clear but not dumbed down**: Explain technical terms; don't avoid them entirely.
- **Honest about limitations**: "This data has limitations" is better than false precision.
- **Factual about partners**: Stewardship projects may name real partner organizations (including tribal nations) where that information is publicly documented. Don't fabricate affiliations or governance structures that don't exist.

---

## 11. Open Architecture Questions

| Question | Impact | Status |
|---|---|---|
| Should the dashboard support comparison views (e.g., two watersheds side by side)? | UI complexity | Open — probably Phase 2 |
| How will the site handle periods with no data (e.g., off-season for salmon returns)? | Dashboard UX | Open |
| Will there be user accounts or is this entirely public/anonymous? | Auth, personalization | Open — assume public-only for Phase 1 |
| What CMS/admin approach makes sense for updating project content without code changes? | M6 scope | Open — needs decision |
