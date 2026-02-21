'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PageHeader }        from '@/components/ui/PageHeader';
import { SalmonMetricCard }  from '@/components/dashboard/SalmonMetricCard';
import { WatershedSelector } from '@/components/dashboard/WatershedSelector';
import { SpeciesFilter }     from '@/components/dashboard/SpeciesFilter';
import { IndicatorChart }    from '@/components/dashboard/IndicatorChart';
import type { ChartDataPoint } from '@/components/dashboard/IndicatorChart';
import { getWatersheds }     from '@/lib/data/watersheds';
import { getSalmonReturns }  from '@/lib/data/salmon-returns';
import type { Watershed }    from '@/lib/data/watersheds';

// ── Leaflet map (window-dependent — ssr:false) ────────────────────────────────
const WatershedMap = dynamic(
  () => import('@/components/dashboard/WatershedMap').then((m) => m.WatershedMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full mb-8 bg-gray-100 animate-pulse rounded-lg border border-gray-200"
        style={{ height: '380px' }}
      />
    ),
  },
);

// ── Static data ───────────────────────────────────────────────────────────────

interface Species { id: string; commonName: string; slug: string; }

const SPECIES: Species[] = [
  { id: '1', commonName: 'Chinook',   slug: 'chinook'   },
  { id: '2', commonName: 'Coho',      slug: 'coho'      },
  { id: '3', commonName: 'Chum',      slug: 'chum'      },
  { id: '4', commonName: 'Pink',      slug: 'pink'      },
  { id: '5', commonName: 'Sockeye',   slug: 'sockeye'   },
  { id: '6', commonName: 'Steelhead', slug: 'steelhead' },
];

// Synthetic environmental time-series (replaced by USGS real data in M5)
const TEMP_DATA: ChartDataPoint[] = [
  { year: 2015, value: 11.8 }, { year: 2016, value: 12.3 },
  { year: 2017, value: 11.6 }, { year: 2018, value: 12.9 },
  { year: 2019, value: 13.4 }, { year: 2020, value: 12.7 },
  { year: 2021, value: 13.8 }, { year: 2022, value: 14.2 },
  { year: 2023, value: 13.9 }, { year: 2024, value: 14.5 },
];

const FLOW_DATA: ChartDataPoint[] = [
  { year: 2015, value: 8.4 }, { year: 2016, value: 9.1 },
  { year: 2017, value: 10.3 }, { year: 2018, value: 7.8 },
  { year: 2019, value: 8.9 }, { year: 2020, value: 9.6 },
  { year: 2021, value: 6.9 }, { year: 2022, value: 7.4 },
  { year: 2023, value: 8.3 }, { year: 2024, value: 7.9 },
];

// ── Aggregation helper ────────────────────────────────────────────────────────

function aggregateByYear(
  returns: Awaited<ReturnType<typeof getSalmonReturns>>,
): ChartDataPoint[] {
  const byYear = new Map<number, number>();
  for (const r of returns) {
    byYear.set(r.year, (byYear.get(r.year) ?? 0) + r.countEstimate);
  }
  return Array.from(byYear.entries())
    .map(([year, value]) => ({ year, value }))
    .sort((a, b) => a.year - b.year);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [selectedWatershed, setSelectedWatershed] = useState('all');
  const [selectedSpecies,   setSelectedSpecies]   = useState('all');
  const [watersheds,  setWatersheds]  = useState<Watershed[]>([]);
  const [chartData,   setChartData]   = useState<ChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [pageLoading,  setPageLoading]  = useState(true);

  // Load watershed list once
  useEffect(() => {
    getWatersheds().then((data) => {
      setWatersheds(data);
      setPageLoading(false);
    });
  }, []);

  // Re-fetch + aggregate salmon return data whenever filters change
  useEffect(() => {
    if (!watersheds.length) return;

    async function loadChart() {
      setChartLoading(true);

      const ws = selectedWatershed === 'all'
        ? undefined
        : watersheds.find((w) => w.slug === selectedWatershed)?.id;

      const sp = selectedSpecies === 'all'
        ? undefined
        : SPECIES.find((s) => s.slug === selectedSpecies)?.id;

      const returns = await getSalmonReturns(ws, sp);
      setChartData(aggregateByYear(returns));
      setChartLoading(false);
    }

    loadChart();
  }, [selectedWatershed, selectedSpecies, watersheds]);

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard…</div>
      </div>
    );
  }

  // ── Derived display values ──
  const selectedWatershedName = selectedWatershed === 'all'
    ? 'All Puget Sound'
    : (watersheds.find((w) => w.slug === selectedWatershed)?.name ?? selectedWatershed);

  const selectedSpeciesName = selectedSpecies === 'all'
    ? 'All Species'
    : (SPECIES.find((s) => s.slug === selectedSpecies)?.commonName ?? selectedSpecies);

  const chartTitle = `${selectedSpeciesName} Returns — ${selectedWatershedName}`;

  const latestReturn = chartData.at(-1);
  const prevReturn   = chartData.at(-2);
  const trend: 'up' | 'down' | 'stable' =
    !latestReturn || !prevReturn ? 'stable'
    : latestReturn.value > prevReturn.value ? 'up'
    : latestReturn.value < prevReturn.value ? 'down'
    : 'stable';

  const fiveYearPct = (() => {
    const five = chartData.find((d) => d.year === 2019);
    if (!latestReturn || !five) return null;
    const pct = ((latestReturn.value - five.value) / five.value) * 100;
    return `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%`;
  })();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Salmon Health Dashboard"
          description="Current conditions and trends across Puget Sound watersheds."
        />

        {/* Interactive watershed map */}
        <WatershedMap
          watersheds={watersheds}
          selected={selectedWatershed}
          onChange={setSelectedWatershed}
        />
        <p className="text-xs text-gray-400 -mt-6 mb-8 pl-1">
          Click a watershed polygon to filter the dashboard. Use the dropdown below to select by name.
        </p>

        {/* Filter bar — syncs with map; accessible keyboard fallback */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 sticky top-20 z-10 shadow-sm">
          <div className="grid md:grid-cols-2 gap-6">
            <WatershedSelector
              watersheds={watersheds}
              selected={selectedWatershed}
              onChange={setSelectedWatershed}
            />
            <SpeciesFilter
              species={SPECIES}
              selected={selectedSpecies}
              onChange={setSelectedSpecies}
            />
          </div>
          {/* Basin detail link — appears only when a specific watershed is selected */}
          {selectedWatershed !== 'all' && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Viewing: <strong className="text-primary">{selectedWatershedName}</strong>
              </span>
              <a
                href={`/dashboard/${selectedWatershed}`}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Explore {selectedWatershedName} basin in detail →
              </a>
            </div>
          )}
        </div>

        {/* At-a-Glance Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">
            Current Status
            <span className="text-base font-normal text-gray-500 ml-3">
              {selectedWatershedName} · {selectedSpeciesName}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SalmonMetricCard
              label="Latest Return Estimate (2024)"
              value={latestReturn ? `${(latestReturn.value / 1000).toFixed(1)}k` : '—'}
              unit="fish"
              trend={trend}
              tooltipText="Estimated number of salmon returning to spawn (2024). Aggregated across selected watershed and species."
            />
            <SalmonMetricCard
              label="5-Year Change (2019–2024)"
              value={fiveYearPct ?? '—'}
              trend={fiveYearPct?.startsWith('+') ? 'up' : fiveYearPct?.startsWith('-') ? 'down' : 'stable'}
              tooltipText="Percentage change in estimated returns compared to 5 years ago."
            />
            <SalmonMetricCard
              label="Stream Temperature (2024)"
              value="14.5"
              unit="°C"
              trend="up"
              tooltipText="Late-summer stream temperature. Currently within safe range — above 18°C causes physiological stress for salmon. Rising trend is a concern. (Mock data — USGS integration in M5)"
            />
          </div>
        </div>

        {/* Primary chart — salmon returns */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-primary">{chartTitle}</h2>
          <IndicatorChart
            data={chartData}
            title={chartTitle}
            unit="fish"
            color="#1b5e5e"
            height={340}
            loading={chartLoading}
            variant="area"
            interpretation="This chart shows estimated annual salmon returns based on WDFW spawner surveys. Upward trends suggest improving habitat or ocean conditions. Downward trends may reflect climate impacts, habitat loss, or reduced hatchery output."
            source="WDFW Salmonid Population Indicators (SPI) — Mock Data (Phase 1)"
          />
        </div>

        {/* Environmental indicators */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Environmental Indicators</h2>
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Late-Summer Stream Temperature
              </h3>
              <IndicatorChart
                data={TEMP_DATA}
                title="Late-Summer Stream Temperature"
                unit="°C"
                color="#ea580c"
                height={220}
                variant="line"
                interpretation="Temperatures above 18°C are physiologically stressful for salmon. Rising late-summer temperatures are a primary climate impact on salmon survival."
                source="USGS NWIS — Mock Data (real-time integration in M5)"
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Annual Streamflow
              </h3>
              <IndicatorChart
                data={FLOW_DATA}
                title="Annual Streamflow"
                unit="kcfs"
                color="#0ea5e9"
                height={220}
                variant="line"
                interpretation="Lower flows reduce the amount of habitat available to spawning and rearing salmon, and increase water temperatures. Drought years show sharp declines."
                source="USGS NWIS — Mock Data (real-time integration in M5)"
              />
            </div>

          </div>
        </div>

        {/* Data Sources */}
        <details className="bg-surface border border-gray-200 rounded-lg p-6">
          <summary className="cursor-pointer font-semibold text-lg text-primary hover:underline">
            Data Sources & Methods
          </summary>
          <div className="mt-4 space-y-2 text-gray-700 text-sm">
            <p><strong>Salmon Returns:</strong> WDFW Salmonid Population Indicators (SPI) Database</p>
            <p><strong>Water Temperature:</strong> USGS National Water Information System (NWIS)</p>
            <p><strong>Streamflow:</strong> USGS NWIS Real-time Data</p>
            <p><strong>Watershed Boundaries:</strong> USGS Watershed Boundary Dataset</p>
            <p className="text-gray-500 mt-4">
              <strong>Note:</strong> This dashboard currently displays mock data generated for demonstration purposes. Live data integration is planned for Phase 2 (M5 milestone).
            </p>
          </div>
        </details>

      </div>
    </div>
  );
}
