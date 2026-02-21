import Link from 'next/link';
import { SalmonMetricCard } from '@/components/dashboard/SalmonMetricCard';
import { getTribes } from '@/lib/data/tribes';
import { getWatersheds } from '@/lib/data/watersheds';
import { getSalmonReturns } from '@/lib/data/salmon-returns';

export default async function Home() {
  const tribes = await getTribes();
  const watersheds = await getWatersheds();
  const recentReturns = await getSalmonReturns(undefined, undefined, 2024, 2024);
  const totalReturns = recentReturns.reduce((sum, r) => sum + r.countEstimate, 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">How Are the Salmon?</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Tracking salmon health across Puget Sound — informed by science and guided by the
            knowledge of the Native Nations who have stewarded these waters since time immemorial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore the Dashboard
            </Link>
            <Link
              href="/nations"
              className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Meet the Nations
            </Link>
          </div>
        </div>
      </section>

      {/* At-a-Glance Pulse */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">At a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SalmonMetricCard
              label="Total Returns (2024)"
              value={totalReturns.toLocaleString()}
              unit="fish"
              trend="stable"
              tooltipText="Estimated total salmon returns across all monitored watersheds and species for 2024"
              href="/dashboard"
            />
            <SalmonMetricCard
              label="Watersheds Monitored"
              value={watersheds.length}
              tooltipText="Number of major watershed basins tracked in this dashboard"
              href="/dashboard"
            />
            <SalmonMetricCard
              label="Tribal Partners"
              value={tribes.length}
              tooltipText="Native Nations co-managing salmon recovery in Puget Sound"
              href="/nations"
            />
            <SalmonMetricCard
              label="Active Projects"
              value={5}
              tooltipText="Ongoing tribal-led stewardship and restoration projects"
              href="/stewardship"
            />
          </div>
        </div>
      </section>

      {/* Two-Pillar Introduction */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Data Pillar */}
          <div className="bg-surface border border-gray-200 rounded-lg p-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold mb-4 text-primary">The Data</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Real-time and historical data on salmon populations, water quality, stream
              temperatures, and habitat conditions across Puget Sound watersheds. Integrated from
              WDFW, USGS, and tribal monitoring programs.
            </p>
            <Link
              href="/dashboard"
              className="inline-block text-primary font-semibold hover:underline"
            >
              Explore Dashboard →
            </Link>
          </div>

          {/* Knowledge Holders Pillar */}
          <div className="bg-surface border border-gray-200 rounded-lg p-8">
            <div className="text-4xl mb-4">🌊</div>
            <h3 className="text-2xl font-bold mb-4 text-primary">The Knowledge Holders</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              The Native Nations of Puget Sound have cared for salmon and these waters for
              thousands of years. Their knowledge, leadership, and ongoing stewardship are central
              to salmon recovery. Learn about their work and vision.
            </p>
            <Link
              href="/nations"
              className="inline-block text-primary font-semibold hover:underline"
            >
              Meet the Nations →
            </Link>
          </div>
        </div>
      </section>

      {/* How to Use This Site */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            How to Use This Site
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">📈</div>
              <h4 className="text-xl font-semibold mb-2">Check the Data</h4>
              <p className="text-gray-700">
                See current salmon populations, water conditions, and long-term trends for your
                watershed.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📚</div>
              <h4 className="text-xl font-semibold mb-2">Learn the Story</h4>
              <p className="text-gray-700">
                Understand salmon ecology, treaty rights, and why salmon recovery matters to all of
                us.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h4 className="text-xl font-semibold mb-2">Hear from Nations</h4>
              <p className="text-gray-700">
                Learn directly from tribal partners about their stewardship and relationship with
                salmon.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
