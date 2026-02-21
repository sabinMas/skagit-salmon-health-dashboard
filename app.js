import express from "express";

const app = express();
const PORT = 3010;

/* =========================
   IN-MEMORY CACHE (15-min TTL)
   ========================= */
const cache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(key, data) {
  cache.set(key, { ts: Date.now(), data });
}

/* =========================
   STATIC FILES
   ========================= */
app.use(express.static("."));

/* =========================
   GET /api/wdfw
   Proxies WDFW SPI Socrata API — filters for Puget Sound Chinook
   ========================= */
app.get("/api/wdfw", async (req, res) => {
  const cached = getCached("wdfw");
  if (cached) return res.json(cached);

  try {
    const url =
      "https://data.wa.gov/api/views/x25s-cxg8/rows.json?$limit=50000";
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`WDFW API error: ${response.status} ${response.statusText}`);

    const raw = await response.json();

    // The Socrata rows.json format wraps data in { meta, data } when using rows.json
    // The client currently calls this expecting an array or the raw object — pass through
    // and let the client handle filtering, same as before.
    setCached("wdfw", raw);
    res.json(raw);
  } catch (err) {
    console.error("[/api/wdfw]", err.message);
    res.status(502).json({ error: err.message });
  }
});

/* =========================
   GET /api/usgs
   Proxies USGS NWIS instantaneous values for Puget Sound temperature stations
   Returns parsed array: [{ siteCode, siteName, latitude, longitude, temperature, dateTime }]
   ========================= */
app.get("/api/usgs", async (req, res) => {
  const cached = getCached("usgs");
  if (cached) return res.json(cached);

  try {
    const params = new URLSearchParams({
      format: "json",
      stateCd: "WA",
      parameterCd: "00010",
      siteStatus: "active",
      bBox: "-123.2,46.8,-121.5,48.5",
    });

    const response = await fetch(
      `https://waterservices.usgs.gov/nwis/iv/?${params}`
    );
    if (!response.ok)
      throw new Error(`USGS API error: ${response.status} ${response.statusText}`);

    const data = await response.json();

    const stations =
      data?.value?.timeSeries
        ?.map((station) => {
          try {
            const site = station.sourceInfo;
            const values =
              station.values && station.values[0] && station.values[0].value;
            if (!values || values.length === 0) return null;
            const latest = values[values.length - 1];
            const temperature = parseFloat(latest.value);
            if (isNaN(temperature)) return null;
            return {
              siteCode: site.siteCode[0].value,
              siteName: site.siteName,
              latitude: parseFloat(site.geoLocation.geogLocation.latitude),
              longitude: parseFloat(site.geoLocation.geogLocation.longitude),
              temperature,
              dateTime: latest.dateTime,
              streamName: site.siteName,
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean) ?? [];

    setCached("usgs", stations);
    res.json(stations);
  } catch (err) {
    console.error("[/api/usgs]", err.message);
    res.status(502).json({ error: err.message });
  }
});

/* =========================
   GET /api/barriers
   Proxies WSDOT ArcGIS REST API — fish passage barriers for Puget Sound
   ========================= */
app.get("/api/barriers", async (req, res) => {
  const cached = getCached("barriers");
  if (cached) return res.json(cached);

  try {
    const params = new URLSearchParams({
      where: "1=1",
      outFields:
        "Stream_Name,Road_Name,Barrier_Status_Desc,Source_Name,LinealGain_Meas,Species,FUCriteria_Desc",
      outSR: "4326",
      f: "json",
      returnGeometry: "true",
    });

    const response = await fetch(
      `https://data.wsdot.wa.gov/arcgis/rest/services/Shared/FishPassageData/MapServer/8/query?${params}`
    );
    if (!response.ok)
      throw new Error(`WSDOT API error: ${response.status} ${response.statusText}`);

    const data = await response.json();
    setCached("barriers", data);
    res.json(data);
  } catch (err) {
    console.error("[/api/barriers]", err.message);
    res.status(502).json({ error: err.message });
  }
});

/* =========================
   GET /api/scrape
   Aggregates salmon data from multiple public sources:
   - NOAA Fisheries SPS (Salmon Population Summaries)
   - Puget Sound Partnership Vital Signs (pugetsoundinfo.wa.gov)
   - WDFW escapement, populations, and recovery endpoints
   Returns a combined JSON object with data from each source.
   ========================= */
app.get("/api/scrape", async (req, res) => {
  const cached = getCached("scrape");
  if (cached) return res.json(cached);

  const results = {
    wdfw: {},
    noaa: null,
    pugetsoundPartnership: null,
    errors: [],
  };

  // WDFW supplemental endpoints (escapement, populations, recovery goals)
  const wdfwEndpoints = {
    escapement: "https://data.wa.gov/api/views/fgyz-n3uk/rows.json?$limit=50000",
    populations: "https://data.wa.gov/api/views/ncqh-ypvf/rows.json?$limit=50000",
    recoveryGoals: "https://data.wa.gov/api/views/d8mu-pcf6/rows.json?$limit=50000",
  };

  await Promise.allSettled(
    Object.entries(wdfwEndpoints).map(async ([key, url]) => {
      try {
        const r = await fetch(url);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        results.wdfw[key] = await r.json();
      } catch (err) {
        results.errors.push(`wdfw.${key}: ${err.message}`);
      }
    })
  );

  // NOAA Fisheries — Salmon Population Summary (SPS) data feed
  // Public JSON endpoint for multi-ESU population data
  try {
    const noaaUrl =
      "https://www.fisheries.noaa.gov/api/v1/content?&api_key=anonymous&q=chinook+puget+sound&type=data&size=10";
    const r = await fetch(noaaUrl, {
      headers: { Accept: "application/json" },
    });
    if (r.ok) {
      results.noaa = await r.json();
    } else {
      results.errors.push(`noaa: HTTP ${r.status}`);
    }
  } catch (err) {
    results.errors.push(`noaa: ${err.message}`);
  }

  // Puget Sound Partnership Vital Signs — Chinook spawner abundance
  // pugetsoundinfo.wa.gov publishes indicator data via WA state open data
  try {
    const pspUrl =
      "https://data.wa.gov/api/views/rqgb-pnqn/rows.json?$limit=1000";
    const r = await fetch(pspUrl);
    if (r.ok) {
      results.pugetsoundPartnership = await r.json();
    } else {
      results.errors.push(`pugetsoundPartnership: HTTP ${r.status}`);
    }
  } catch (err) {
    results.errors.push(`pugetsoundPartnership: ${err.message}`);
  }

  setCached("scrape", results);
  res.json(results);
});

/* =========================
   START SERVER
   ========================= */
app.listen(PORT, () => {
  console.log(`Puget Sound Salmon Health dashboard running at http://localhost:${PORT}`);
  console.log("API routes: /api/wdfw  /api/usgs  /api/barriers  /api/scrape");
});
