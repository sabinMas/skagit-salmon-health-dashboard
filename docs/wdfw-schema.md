# WDFW Data Schema — M5.2a Exploration

> Completed: 2026-02-21
> Dataset: `fgyz-n3uk` (WDFW Escapement/SPI) on data.wa.gov

---

## Chosen Dataset

**`fgyz-n3uk`** — WDFW Salmonid Population Indicators (Escapement)
- URL: `https://data.wa.gov/api/views/fgyz-n3uk/rows.json`
- Total rows: ~24,592
- Updated regularly (checked 2026-02-21)

**Why this one and not `x25s-cxg8`?**
`x25s-cxg8` is the raw SPI database (100+ columns, NOSAIJ/TSAEJ statistical estimates,
many null records, `Publish: No` rows). The escapement dataset (`fgyz-n3uk`) is the
published/curated version — clean schema, direct counts, suitable for the dashboard.

---

## Schema (relevant columns only)

| Column | Type | Example | Notes |
|--------|------|---------|-------|
| `Population Name` | string | `"Green River (Duwamish) Chinook"` | Maps to our watershed slug |
| `Species` | string | `"Chinook"` | Clean species name |
| `Year` | integer | `2023` | Spawning year |
| `Abundance Quantity` | float | `4714.0` | The actual count; null if no survey |
| `Data Type` | string | `"Spawner Fish"` | See types below |
| `Production Type` | string | `"Natural"` / `"Composite"` | Natural vs hatchery origin |
| `Calculation Type` | string | `"Expanded"` | Methodology |
| `Escapement Methodology` | string | `"Trap Count"` | How counted |
| `Last Updated` | datetime | `"2023-05-15T22:28:54"` | For freshness indicator |

---

## Data Types (priority order for our adapter)

Use the **first available** type per population/year combination:

1. `TSAEJ` — Total Spawner Abundance, Expanded Jackknife (best: natural + hatchery, stats)
2. `Spawner Fish` — Direct spawner count (most rows: 1,086 PS rows with data)
3. `NOSAEJ` — Natural Origin Spawner Abundance, Expanded Jackknife (natural-origin only)
4. `Escapement Fish` — Basic escapement count (fallback)

**Do not use:** `HOSAEJ` (hatchery only), `Spawner Redds` (redd counts, different unit),
`NA`, `Unknown`.

---

## Year Coverage (Puget Sound Chinook)

Reliable for 2005–2023. Use **2010–2023** for the dashboard (avoids sparse early data).
2024 is partial (18 rows so far). 2025 barely started.

---

## Species Mapping (WDFW name → our speciesId)

| WDFW `Species` | Our `speciesId` | Our slug |
|----------------|-----------------|----------|
| `Chinook` | `'1'` | `chinook` |
| `Coho` | `'2'` | `coho` |
| `Chum` | `'3'` | `chum` |
| `Pink` | `'4'` | `pink` |
| `Sockeye` | `'5'` | `sockeye` |
| `Steelhead` | `'6'` | `steelhead` |
| `Bull Trout` | — | skip |
| `Cutthroat` | — | skip |

---

## Population Name → Watershed Slug Mapping

### skagit
- Lower Skagit Chinook
- Upper Skagit Chinook
- Skagit Coho
- Skagit Pink
- Mainstem Skagit Fall Chum
- Skagit River Summer and Winter Steelhead
- Lower Sauk Chinook *(Sauk River is a major Skagit tributary)*
- Upper Sauk Chinook
- Sauk River Summer and Winter Steelhead
- Suiattle Chinook *(Suiattle River enters Sauk→Skagit)*

### snohomish
- Skykomish Chinook *(Skykomish is the main stem of the Snohomish)*
- Snoqualmie Chinook *(Snoqualmie merges with Skykomish → Snohomish)*
- Snohomish Coho
- Snohomish Even-Year Pink
- Snohomish Odd-Year Pink
- South Fork Skykomish Coho
- North Fork Skykomish Summer Steelhead
- Snohomish-Skykomish Winter Steelhead
- Snoqualmie Winter Steelhead

### lake-washington
- Cedar Chinook
- Cedar Sockeye
- Cedar River Winter Steelhead
- Lake Washington Beach Spawning Sockeye
- Lake Washington-Sammamish Tribs Sockeye
- North Lake Washington and Lake Sammamish Winter Steelhead
- Sammamish Chinook

### green-duwamish
- Green River (Duwamish) Chinook
- Green River-Soos Creek Coho
- Green River (Duwamish) Winter Steelhead

### puyallup-white
- Puyallup Chinook
- Puyallup Pink
- Puyallup-Carbon Fall Chum
- Puyallup/Carbon Winter Steelhead
- White River (Puyallup) Coho
- White River (Puyallup) Winter Steelhead

### nisqually
- Nisqually Chinook
- Nisqually Coho
- Nisqually Pink
- Nisqually Winter Chum
- Nisqually Winter Steelhead

### skokomish
- Skokomish Chinook
- Skokomish Winter Steelhead
- Upper Skokomish Late Fall Chum

### stillaguamish
- North Fork Stillaguamish Chinook
- South Fork Stillaguamish Chinook
- Stillaguamish Coho
- Stillaguamish Fall Chum
- Stillaguamish Pink
- Stillaguamish Winter Steelhead
- Canyon Creek (Stillaguamish) Summer Steelhead

### nooksack
- North Fork Nooksack Chinook (including Middle Fork Nooksack River)
- South Fork Nooksack Chinook
- Nooksack Coho
- Nooksack Fall Chum
- Nooksack Pink
- Nooksack Winter Steelhead
- South Fork Nooksack Summer Steelhead

---

## Fetch Strategy for M5.2b

Instead of fetching all 24k rows (too large for ISR cache), use a **build-time seed script**:

```
scripts/fetch-wdfw.ts
  → fetch with $where filter (PS population names, years 2010+, valid data types)
  → estimated filtered result: ~3,000–4,000 rows
  → parse into SalmonReturn[]
  → write to lib/data/real/salmon-returns.json
  → getSalmonReturns() reads from this file
```

Socrata `$where` filter to use:
```
Year >= 2010 AND "Abundance Quantity" IS NOT NULL
AND "Data Type" IN ('TSAEJ','Spawner Fish','NOSAEJ','Escapement Fish')
```

Then filter in-code to PS population names from the mapping above.

**Estimated result:** ~3,000 rows × ~200 bytes = ~600KB JSON — well within ISR limits.
Refresh quarterly or on-demand via `npm run data:refresh`.

---

## Adapter Output Shape

Each WDFW row maps to our `SalmonReturn`:

```ts
{
  id:            `${populationName}-${year}`,
  watershedId:   lookupWatershedId(populationName),  // our '1'–'9'
  speciesId:     lookupSpeciesId(species),            // our '1'–'6'
  year:          parseInt(year),
  countEstimate: parseFloat(abundanceQuantity),
  method:        escapementMethodology ?? dataType,
  source:        'WDFW SPI (data.wa.gov/fgyz-n3uk)',
  confidence:    year >= 2020 ? 'high' : 'medium',
}
```
