// Replaces GET /api/scrape in app.js
// Aggregates salmon data from multiple public sources in parallel.
// Uses Socrata resource endpoints (/resource/) which support SoQL filtering,
// keeping all responses well under the 2 MB Next.js ISR cache ceiling.

export const revalidate = 900;

// Escapement/SPI data — filtered to recent PS rows (docs/wdfw-schema.md strategy)
const ESCAPEMENT_PARAMS = new URLSearchParams({
  $where:  "year >= 2010 AND abundance_quantity IS NOT NULL AND data_type IN ('TSAEJ','Spawner Fish','NOSAEJ','Escapement Fish')",
  $select: "population_name,species,year,abundance_quantity,data_type,production_type,last_updated",
  $limit:  "5000",
  $order:  "year DESC",
});

const WDFW_ENDPOINTS: Record<string, string> = {
  escapement:   `https://data.wa.gov/resource/fgyz-n3uk.json?${ESCAPEMENT_PARAMS}`,
  populations:  "https://data.wa.gov/resource/ncqh-ypvf.json?$limit=2000",
  recoveryGoals:"https://data.wa.gov/resource/d8mu-pcf6.json?$limit=2000",
};

async function safeFetch(url: string): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  try {
    const res = await fetch(url, { next: { revalidate: 900 } });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    return { ok: true, data: await res.json() };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function GET() {
  const results: {
    wdfw: Record<string, unknown>;
    noaa: unknown;
    pugetsoundPartnership: unknown;
    errors: string[];
  } = {
    wdfw: {},
    noaa: null,
    pugetsoundPartnership: null,
    errors: [],
  };

  // WDFW supplemental endpoints
  await Promise.all(
    Object.entries(WDFW_ENDPOINTS).map(async ([key, url]) => {
      const r = await safeFetch(url);
      if (r.ok) {
        results.wdfw[key] = r.data;
      } else {
        results.errors.push(`wdfw.${key}: ${r.error}`);
      }
    })
  );

  // NOAA Fisheries content API
  const noaa = await safeFetch(
    "https://www.fisheries.noaa.gov/api/v1/content?api_key=anonymous&q=chinook+puget+sound&type=data&size=10"
  );
  if (noaa.ok) {
    results.noaa = noaa.data;
  } else {
    results.errors.push(`noaa: ${noaa.error}`);
  }

  // Puget Sound Partnership Vital Signs (WA open data)
  const psp = await safeFetch(
    "https://data.wa.gov/resource/rqgb-pnqn.json?$limit=1000"
  );
  if (psp.ok) {
    results.pugetsoundPartnership = psp.data;
  } else {
    results.errors.push(`pugetsoundPartnership: ${psp.error}`);
  }

  return Response.json(results);
}
