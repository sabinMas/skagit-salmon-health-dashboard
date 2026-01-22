/* =========================
   DATA SOURCES (your files)
   ========================= */
const WATERSHED_GEOJSON_PATH = "data/puget-sound-watersheds.geojson";
const WATERSHED_CSV_PATH = "data/cleaned_puget_sound_watershed_data_final.csv";

/* =========================
   HELPERS
   ========================= */

// Very small CSV parser (works for your simple, comma-separated file)
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(",").map((v) => v.trim());
    const row = {};
    headers.forEach((h, idx) => (row[h] = values[idx]));
    rows.push(row);
  }
  return rows;
}

function toNumber(v) {
  if (v === null || v === undefined || v === "") return NaN;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

function normalizeName(name) {
  return (name || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[–—]/g, "-")
    .trim();
}

// Color watersheds by population health status
function getPopulationColor(population, target) {
  // If missing target, make it neutral gray
  if (!Number.isFinite(population) || !Number.isFinite(target) || target <= 0)
    return "#95a5a6";

  const percentOfTarget = (population / target) * 100;
  if (percentOfTarget < 5) return "#8b0000"; // critical
  if (percentOfTarget < 10) return "#e74c3c"; // endangered
  if (percentOfTarget < 15) return "#f39c12"; // threatened
  return "#2ecc71"; // stable
}

function statusLabel(population, target) {
  if (!Number.isFinite(population) || !Number.isFinite(target) || target <= 0)
    return "Data unavailable";
  const pct = (population / target) * 100;
  if (pct < 5) return "Critical";
  if (pct < 10) return "Endangered";
  if (pct < 15) return "Threatened";
  return "Stable";
}

/* =========================
   LEAFLET MAP
   ========================= */

const map = L.map("map").setView([48.35, -122.15], 8);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
  maxZoom: 19,
}).addTo(map);

/* =========================
   HABITAT ZONES (still sample)
   ========================= */

// Keep your sample habitat zones as-is
const habitatZones = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Upper Skagit", suitability: "optimal" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.05, 48.4],
            [-122.0, 48.38],
            [-121.98, 48.3],
            [-122.03, 48.28],
            [-122.05, 48.4],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Sauk River Confluence", suitability: "marginal" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-122.15, 48.32],
            [-122.1, 48.3],
            [-122.08, 48.22],
            [-122.13, 48.2],
            [-122.15, 48.32],
          ],
        ],
      },
    },
  ],
};

function getHabitatColor(suitability) {
  if (suitability === "optimal") return "#2ecc71";
  if (suitability === "marginal") return "#f39c12";
  return "#e74c3c";
}

L.geoJSON(habitatZones, {
  style: function (feature) {
    return {
      color: getHabitatColor(feature.properties.suitability),
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.4,
    };
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<strong>" +
        feature.properties.name +
        "</strong><br>" +
        "Suitability: " +
        feature.properties.suitability,
    );
  },
}).addTo(map);

/* =========================
   LEGEND
   ========================= */

const legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  const div = L.DomUtil.create("div", "info");
  div.style.background = "white";
  div.style.padding = "10px";
  div.style.borderRadius = "5px";
  div.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)";
  div.innerHTML = `
    <h4 style="margin: 0 0 10px 0; color: #1a5f7a;">Spawning Habitat</h4>
    <p style="margin: 5px 0;"><i style="background: #2ecc71; width: 18px; height: 18px; display: inline-block; border-radius: 3px;"></i> Optimal</p>
    <p style="margin: 5px 0;"><i style="background: #f39c12; width: 18px; height: 18px; display: inline-block; border-radius: 3px;"></i> Marginal</p>
    <p style="margin: 5px 0;"><i style="background: #e74c3c; width: 18px; height: 18px; display: inline-block; border-radius: 3px;"></i> Unsuitable</p>
  `;
  return div;
};
legend.addTo(map);

/* =========================
   LOAD + JOIN YOUR REAL DATA
   ========================= */

Promise.all([
  fetch(WATERSHED_GEOJSON_PATH).then((r) => r.json()),
  fetch(WATERSHED_CSV_PATH).then((r) => r.text()),
])
  .then(([geo, csvText]) => {
    const csvRows = parseCSV(csvText);

    // Build a lookup from watershed name -> data row
    const csvByName = {};
    csvRows.forEach((r) => {
      const key = normalizeName(r.Watershed);
      csvByName[key] = {
        watershed: r.Watershed,
        latestYearPop: toNumber(r.LatestYear_pop),
        population: toNumber(r.Population),
        latestYearTarget: toNumber(r.LatestYear_target),
        recoveryTarget: toNumber(r.RecoveryTarget),
      };
    });

    // Attach CSV data to each GeoJSON feature by matching name
    geo.features.forEach((f) => {
      const geoName =
        f.properties?.name || f.properties?.watershed || f.properties?.NAME;
      const key = normalizeName(geoName);

      const match = csvByName[key];

      // Keep existing geometry; standardize properties for the rest of the script
      f.properties = f.properties || {};
      f.properties.name = geoName || f.properties.name || "Unknown Watershed";

      if (match) {
        f.properties.latest_year_pop = match.latestYearPop;
        f.properties.population = match.population;
        f.properties.latest_year_target = match.latestYearTarget;
        f.properties.recovery_target = match.recoveryTarget;
      } else {
        // No match in CSV (still render, but gray)
        f.properties.latest_year_pop = NaN;
        f.properties.population = NaN;
        f.properties.latest_year_target = NaN;
        f.properties.recovery_target = NaN;
      }
    });

    // Draw watersheds (replaces your sample Skagit polygon)
    const watershedLayer = L.geoJSON(geo, {
      style: (feature) => {
        const pop = feature.properties.population;
        const target = feature.properties.recovery_target;
        return {
          color: "#1a5f7a",
          weight: 2,
          opacity: 0.85,
          fillOpacity: 0.35,
          fillColor: getPopulationColor(pop, target),
        };
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties.name;
        const yearPop = feature.properties.latest_year_pop;
        const pop = feature.properties.population;
        const yearTarget = feature.properties.latest_year_target;
        const target = feature.properties.recovery_target;

        const pct =
          Number.isFinite(pop) && Number.isFinite(target) && target > 0
            ? ((pop / target) * 100).toFixed(1) + "%"
            : "—";

        layer.bindPopup(`
          <strong>${name}</strong><br>
          <strong>Population:</strong> ${
            Number.isFinite(pop) ? pop.toLocaleString() : "—"
          } ${Number.isFinite(yearPop) ? `(Year ${yearPop})` : ""}<br>
          <strong>Recovery Target:</strong> ${
            Number.isFinite(target) ? target.toLocaleString() : "—"
          } ${Number.isFinite(yearTarget) ? `(Year ${yearTarget})` : ""}<br>
          <strong>Status:</strong> ${statusLabel(pop, target)} (${pct})
        `);
      },
    }).addTo(map);

    // Fit map to watersheds
    try {
      map.fitBounds(watershedLayer.getBounds(), { padding: [20, 20] });
    } catch (e) {
      // no-op if bounds fail
    }

    /* =========================
       REGIONAL STATUS CARD
       ========================= */

    // Use ONLY watersheds that have numeric values
    const valid = geo.features.filter(
      (f) =>
        Number.isFinite(f.properties.population) &&
        Number.isFinite(f.properties.recovery_target) &&
        f.properties.recovery_target > 0,
    );

    const totalPop = valid.reduce((sum, f) => sum + f.properties.population, 0);
    const totalTarget = valid.reduce(
      (sum, f) => sum + f.properties.recovery_target,
      0,
    );

    const percentOfTarget =
      totalTarget > 0 ? ((totalPop / totalTarget) * 100).toFixed(1) : "—";
    const gap = totalTarget - totalPop;

    // Find most/least endangered among valid
    const ranked = [...valid].sort((a, b) => {
      const ap = a.properties.population / a.properties.recovery_target;
      const bp = b.properties.population / b.properties.recovery_target;
      return ap - bp;
    });

    const mostEnd = ranked[0];
    const leastEnd = ranked[ranked.length - 1];

    const mostEndPct = (
      (mostEnd.properties.population / mostEnd.properties.recovery_target) *
      100
    ).toFixed(1);

    const leastEndPct = (
      (leastEnd.properties.population / leastEnd.properties.recovery_target) *
      100
    ).toFixed(1);

    document.getElementById("status-content").innerHTML = `
      <p><strong>Puget Sound Region (${valid.length} watersheds with data)</strong></p>
      <p style="margin-top: 0.75rem;"><strong>Total Population:</strong> ${totalPop.toLocaleString()} spawning adults</p>
      <p><strong>Recovery Target:</strong> ${totalTarget.toLocaleString()}</p>
      <p><strong>Regional Status:</strong> ${percentOfTarget}% of target</p>
      <p style="color: #e74c3c; background: #ffe6e6; padding: 0.5rem; border-radius: 4px; margin-top: 0.75rem;">
        ⚠️ <strong>Critical Gap:</strong> ${gap.toLocaleString()} additional spawners needed
      </p>
      <p style="font-size: 0.85rem; margin-top: 0.75rem; color: #666;">
        📉 <strong>Most Endangered:</strong> ${mostEnd.properties.name} (${mostEndPct}% of target)<br>
        📈 <strong>Least Endangered:</strong> ${leastEnd.properties.name} (${leastEndPct}% of target)
      </p>
    `;

    /* =========================
       WATERSHED COMPARISON CHART
       ========================= */

    const chartLabels = valid.map((f) => f.properties.name);
    const chartPops = valid.map((f) => f.properties.population);
    const chartTargets = valid.map((f) => f.properties.recovery_target);

    const ctx = document.getElementById("watershedChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Current Population",
            data: chartPops,
            backgroundColor: "rgba(231, 76, 60, 0.7)",
            borderColor: "#e74c3c",
            borderWidth: 1,
          },
          {
            label: "Recovery Target",
            data: chartTargets,
            backgroundColor: "rgba(46, 204, 113, 0.3)",
            borderColor: "#2ecc71",
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: true, position: "top" },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                const v = ctx.raw;
                return `${ctx.dataset.label}: ${Number(v).toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: false,
            ticks: { color: "#666" },
          },
          y: {
            ticks: { color: "#666" },
          },
        },
      },
    });
  })
  .catch((err) => {
    console.error("Failed to load watershed data:", err);
    document.getElementById("status-content").innerHTML = `
      <p style="color:#e74c3c;"><strong>Error:</strong> Could not load watershed data files.</p>
      <p style="font-size:0.9rem;color:#666;">Check that these exist and paths are correct:</p>
      <ul style="font-size:0.9rem;color:#666;margin-left:1.25rem;">
        <li>${WATERSHED_GEOJSON_PATH}</li>
        <li>${WATERSHED_CSV_PATH}</li>
      </ul>
    `;
  });
