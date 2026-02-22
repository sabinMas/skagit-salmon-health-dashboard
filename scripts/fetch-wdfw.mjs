/**
 * scripts/fetch-wdfw.mjs
 *
 * Fetches WDFW Salmonid Population Indicators (Escapement) data from data.wa.gov,
 * filters to Puget Sound populations, parses into SalmonReturn[], and writes
 * to lib/data/real/salmon-returns.json.
 *
 * Run: node scripts/fetch-wdfw.mjs
 *  Or: npm run data:refresh
 *
 * Schema documented in docs/wdfw-schema.md
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname }            from 'node:path';
import { fileURLToPath }            from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Socrata API ───────────────────────────────────────────────────────────────

const BASE_URL  = 'https://data.wa.gov/resource/fgyz-n3uk.json';
const PAGE_SIZE = 5000;

// Data types to accept, in priority order (first match wins per population+year)
const TYPE_PRIORITY = ['TSAEJ', 'Spawner Fish', 'NOSAEJ', 'Escapement Fish'];

// ── Population → Watershed Slug ───────────────────────────────────────────────

const POPULATION_WATERSHED = {
  // ── Skagit ────────────────────────────────────────────────────────────────
  'Lower Skagit Chinook':                                         'skagit',
  'Upper Skagit Chinook':                                         'skagit',
  'Skagit Coho':                                                  'skagit',
  'Skagit Pink':                                                  'skagit',
  'Mainstem Skagit Fall Chum':                                    'skagit',
  'Skagit River Summer and Winter Steelhead':                     'skagit',
  'Lower Sauk Chinook':                                           'skagit',
  'Upper Sauk Chinook':                                           'skagit',
  'Sauk River Summer and Winter Steelhead':                       'skagit',
  'Suiattle Chinook':                                             'skagit',

  // ── Snohomish ─────────────────────────────────────────────────────────────
  'Skykomish Chinook':                                            'snohomish',
  'Snoqualmie Chinook':                                           'snohomish',
  'Snohomish Coho':                                               'snohomish',
  'Snohomish Even-Year Pink':                                     'snohomish',
  'Snohomish Odd-Year Pink':                                      'snohomish',
  'South Fork Skykomish Coho':                                    'snohomish',
  'North Fork Skykomish Summer Steelhead':                        'snohomish',
  'Snohomish-Skykomish Winter Steelhead':                         'snohomish',
  'Snoqualmie Winter Steelhead':                                  'snohomish',

  // ── Lake Washington / Cedar / Sammamish ───────────────────────────────────
  'Cedar Chinook':                                                'lake-washington',
  'Cedar Sockeye':                                                'lake-washington',
  'Cedar River Winter Steelhead':                                 'lake-washington',
  'Lake Washington Beach Spawning Sockeye':                       'lake-washington',
  'Lake Washington-Sammamish Tribs Sockeye':                      'lake-washington',
  'North Lake Washington and Lake Sammamish Winter Steelhead':    'lake-washington',
  'Sammamish Chinook':                                            'lake-washington',

  // ── Green / Duwamish ──────────────────────────────────────────────────────
  'Green River (Duwamish) Chinook':                               'green-duwamish',
  'Green River-Soos Creek Coho':                                  'green-duwamish',
  'Green River (Duwamish) Winter Steelhead':                      'green-duwamish',

  // ── Puyallup / White ──────────────────────────────────────────────────────
  'Puyallup Chinook':                                             'puyallup-white',
  'Puyallup Pink':                                                'puyallup-white',
  'Puyallup-Carbon Fall Chum':                                    'puyallup-white',
  'Puyallup/Carbon Winter Steelhead':                             'puyallup-white',
  'White River (Puyallup) Coho':                                  'puyallup-white',
  'White River (Puyallup) Winter Steelhead':                      'puyallup-white',

  // ── Nisqually ─────────────────────────────────────────────────────────────
  'Nisqually Chinook':                                            'nisqually',
  'Nisqually Coho':                                               'nisqually',
  'Nisqually Pink':                                               'nisqually',
  'Nisqually Winter Chum':                                        'nisqually',
  'Nisqually Winter Steelhead':                                   'nisqually',

  // ── Skokomish ─────────────────────────────────────────────────────────────
  'Skokomish Chinook':                                            'skokomish',
  'Skokomish Winter Steelhead':                                   'skokomish',
  'Upper Skokomish Late Fall Chum':                               'skokomish',

  // ── Stillaguamish ─────────────────────────────────────────────────────────
  'North Fork Stillaguamish Chinook':                             'stillaguamish',
  'South Fork Stillaguamish Chinook':                             'stillaguamish',
  'Stillaguamish Coho':                                           'stillaguamish',
  'Stillaguamish Fall Chum':                                      'stillaguamish',
  'Stillaguamish Pink':                                           'stillaguamish',
  'Stillaguamish Winter Steelhead':                               'stillaguamish',
  'Canyon Creek (Stillaguamish) Summer Steelhead':                'stillaguamish',

  // ── Nooksack ──────────────────────────────────────────────────────────────
  'North Fork Nooksack Chinook (including Middle Fork Nooksack River)': 'nooksack',
  'South Fork Nooksack Chinook':                                  'nooksack',
  'Nooksack Coho':                                                'nooksack',
  'Nooksack Fall Chum':                                           'nooksack',
  'Nooksack Pink':                                                'nooksack',
  'Nooksack Winter Steelhead':                                    'nooksack',
  'South Fork Nooksack Summer Steelhead':                         'nooksack',
};

// Watershed slug → numeric ID (must match lib/data/watersheds.ts order)
const WATERSHED_ID = {
  'skagit':          '1',
  'snohomish':       '2',
  'lake-washington': '3',
  'green-duwamish':  '4',
  'puyallup-white':  '5',
  'nisqually':       '6',
  'skokomish':       '7',
  'stillaguamish':   '8',
  'nooksack':        '9',
};

// WDFW species name → speciesId (must match lib/data/salmon-returns.ts)
const SPECIES_ID = {
  'Chinook':   '1',
  'Coho':      '2',
  'Chum':      '3',
  'Pink':      '4',
  'Sockeye':   '5',
  'Steelhead': '6',
};

// ── Fetch (paginated) ─────────────────────────────────────────────────────────

async function fetchPage(offset) {
  const where = [
    `abundance_qty IS NOT NULL`,
    `year >= '2010'`,
    `data_type IN ('TSAEJ','Spawner Fish','NOSAEJ','Escapement Fish')`,
  ].join(' AND ');

  const select = [
    'population_name', 'species', 'year',
    'abundance_qty', 'data_type',
    'escapement_methodology', 'last_update',
  ].join(',');

  const params = new URLSearchParams({
    '$where':  where,
    '$select': select,
    '$limit':  String(PAGE_SIZE),
    '$offset': String(offset),
    '$order':  'population_name,year',
  });

  const url = `${BASE_URL}?${params}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Socrata API ${res.status}: ${body}`);
  }
  return res.json();
}

async function fetchAll() {
  const all = [];
  let offset = 0;
  while (true) {
    process.stdout.write(`  Fetching rows ${offset}–${offset + PAGE_SIZE - 1}... `);
    const page = await fetchPage(offset);
    all.push(...page);
    console.log(`got ${page.length}`);
    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  return all;
}

// ── Parse ─────────────────────────────────────────────────────────────────────

function parse(rows) {
  // Keep only rows whose population maps to one of our 9 watersheds
  const psRows = rows.filter(r => POPULATION_WATERSHED[r.population_name]);

  // Group by population + year so we can pick the best data type
  const grouped = new Map();
  for (const row of psRows) {
    const key = `${row.population_name}||${row.year}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  }

  const results = [];
  for (const [key, candidates] of grouped) {
    // Pick first available preferred data type
    let best;
    for (const dtype of TYPE_PRIORITY) {
      best = candidates.find(r => r.data_type === dtype);
      if (best) break;
    }
    if (!best || best.abundance_qty == null) continue;

    const slug       = POPULATION_WATERSHED[best.population_name];
    const watershedId = WATERSHED_ID[slug];
    const speciesId   = SPECIES_ID[best.species];
    if (!watershedId || !speciesId) continue;  // unknown species (Bull Trout etc)

    const year          = parseInt(best.year, 10);
    const countEstimate = parseFloat(best.abundance_qty);
    if (isNaN(year) || isNaN(countEstimate) || countEstimate < 0) continue;

    results.push({
      id:            `${best.population_name}-${year}`,
      watershedId,
      speciesId,
      year,
      countEstimate: Math.round(countEstimate),
      method:        best.escapement_methodology ?? best.data_type,
      source:        'WDFW SPI (data.wa.gov/resource/fgyz-n3uk)',
      confidence:    year >= 2020 ? 'high' : year >= 2015 ? 'medium' : 'low',
    });
  }

  return results.sort(
    (a, b) => a.watershedId.localeCompare(b.watershedId) || a.year - b.year,
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('WDFW Escapement Data Fetch');
  console.log('Dataset : fgyz-n3uk (WDFW SPI Escapement)');
  console.log('Filter  : PS populations, year >= 2010, non-null abundance, TSAEJ/Spawner Fish/NOSAEJ\n');

  const outDir  = join(__dirname, '..', 'lib', 'data', 'real');
  mkdirSync(outDir, { recursive: true });

  console.log('Fetching from WDFW API...');
  const raw = await fetchAll();
  console.log(`\nTotal rows fetched (filtered by API): ${raw.length}`);

  console.log('\nParsing and mapping to Puget Sound watersheds...');
  const returns = parse(raw);
  console.log(`Puget Sound SalmonReturn records: ${returns.length}`);

  // Summary
  const byWs = {};
  for (const r of returns) {
    byWs[r.watershedId] = (byWs[r.watershedId] ?? 0) + 1;
  }
  const wsNames = Object.fromEntries(
    Object.entries(WATERSHED_ID).map(([slug, id]) => [id, slug])
  );
  console.log('\nRecords by watershed:');
  for (const [id, count] of Object.entries(byWs).sort()) {
    console.log(`  [${id}] ${wsNames[id]}: ${count} records`);
  }

  const speciesNames = Object.fromEntries(
    Object.entries(SPECIES_ID).map(([name, id]) => [id, name])
  );
  const bySp = {};
  for (const r of returns) bySp[r.speciesId] = (bySp[r.speciesId] ?? 0) + 1;
  console.log('\nRecords by species:');
  for (const [id, count] of Object.entries(bySp).sort()) {
    console.log(`  [${id}] ${speciesNames[id]}: ${count} records`);
  }

  const payload = {
    fetchedAt:   new Date().toISOString(),
    source:      'WDFW SPI Escapement — data.wa.gov/resource/fgyz-n3uk',
    recordCount: returns.length,
    returns,
  };

  const outPath = join(outDir, 'salmon-returns.json');
  const json    = JSON.stringify(payload, null, 2);
  writeFileSync(outPath, json);

  console.log(`\nWritten to: ${outPath}`);
  console.log(`File size : ${(json.length / 1024).toFixed(1)} KB`);
}

main().catch(err => {
  console.error('\nFetch failed:', err.message);
  process.exit(1);
});
