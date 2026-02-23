import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Why Salmon Matter | Learn | Puget Sound Salmon Health',
  description:
    'Salmon are a keystone species that feed forests, sustain food webs, support tribal cultures, and drive a multi-billion dollar economy. Learn why their decline affects all of us.',
};

export default function WhySalmonMatterPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/learn" className="text-primary hover:underline">Learn</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">Why Salmon Matter</span>
        </nav>

        {/* Module Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm bg-gray-200 px-3 py-1 rounded">20 minutes</span>
            <span className="text-sm bg-primary text-white px-3 py-1 rounded">Grades 7–12</span>
          </div>
          <PageHeader
            title="Why Salmon Matter"
            description="Salmon connect the ocean to the forest, sustain dozens of species, and have shaped the cultures, economies, and laws of the Pacific Northwest for thousands of years."
          />
        </div>

        {/* Content */}
        <div className="prose max-w-none mb-12 space-y-10">

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Keystone Species: One Animal, Many Ecosystems</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A <strong>keystone species</strong> is one whose presence shapes the entire ecosystem around it —
              like the central stone in an arch that holds all the other stones in place. Remove it, and the
              whole structure collapses. Salmon are one of the most powerful keystone species in the Pacific
              Northwest.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              At least <strong>137 species</strong> in the Pacific Northwest depend directly on salmon for food
              or nutrients — including bears, eagles, wolves, orca, river otters, and dozens of bird species.
              When salmon runs decline, the effects ripple outward through every part of the food web.
            </p>
            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded-r-lg">
              <p className="text-sm text-gray-800">
                <strong>The Puget Sound connection:</strong> Southern Resident orcas — listed as endangered
                since 2005 — depend almost exclusively on Chinook salmon. As Chinook runs have declined,
                orca populations have struggled to maintain their numbers. There are fewer than 75 individuals
                remaining.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Salmon Feed the Forest</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Here is something remarkable: salmon that grow up in the ocean bring marine nutrients back to
              freshwater streams and the surrounding forest when they return to spawn and die. Their decomposing
              bodies release nitrogen, phosphorus, and other nutrients into the stream water and soil.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Trees and plants within 150 meters of salmon streams have been found to contain{' '}
              <strong>measurable amounts of ocean-derived nitrogen</strong> in their tissues. In some Pacific
              Northwest forests, salmon nutrients account for up to 25% of the nitrogen in streamside
              vegetation. Bigger salmon runs mean larger trees, healthier riparian zones, and more shade
              over streams — which in turn keeps water cool enough for the next generation of salmon.
            </p>
            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
              <p className="text-sm text-gray-800">
                <strong>The cycle:</strong> Salmon eat ocean nutrients → salmon return and die in streams →
                nutrients feed streamside trees → trees shade streams → cold water supports salmon eggs.
                Breaking any link in this cycle weakens the whole system.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Economic Value: Billions of Dollars</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Pacific salmon support enormous economic activity across the Pacific Northwest:
            </p>
            <ul className="list-none space-y-3 mb-4">
              {[
                { label: 'Commercial fishing', detail: 'Puget Sound salmon fisheries have historically generated hundreds of millions of dollars annually in direct economic activity.' },
                { label: 'Sport fishing', detail: 'Recreational salmon fishing generates significant tourism and equipment spending throughout Washington state.' },
                { label: 'Tribal fisheries', detail: 'Under treaty rights affirmed in the 1974 Boldt Decision, tribes are entitled to 50% of the harvestable salmon in their usual and accustomed fishing areas. These fisheries are economically and culturally central to tribal communities.' },
                { label: 'Ecosystem services', detail: 'Beyond direct fishing, salmon support tourism, wildlife viewing, and a broader outdoor recreation economy across the region.' },
              ].map(({ label, detail }) => (
                <li key={label} className="flex gap-3 bg-gray-50 rounded-lg p-4">
                  <span className="shrink-0 text-primary font-bold mt-0.5">›</span>
                  <div>
                    <strong className="text-gray-800">{label}:</strong>{' '}
                    <span className="text-gray-700">{detail}</span>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-gray-700 leading-relaxed">
              The costs of decline are also measurable. Federal and state governments have spent billions
              of dollars on hatcheries, habitat restoration, and court-ordered culvert replacement precisely
              because salmon runs have dropped so severely that the ecosystem, the economy, and treaty
              obligations are all at risk.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Cultural Significance: Time Immemorial to Today</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For the Native Nations of Puget Sound, salmon are not simply a food source or economic
              resource — they are central to culture, spirituality, and identity. Salmon have sustained
              Coast Salish peoples for at least 10,000 years, and their relationship with the fish is
              embedded in language, ceremony, governance, and law.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              First Salmon ceremonies — practiced by many tribes — honor the return of the first salmon
              of the season and express gratitude for the continued relationship between humans and fish.
              These ceremonies reflect a worldview in which humans have responsibilities to the natural
              world, not just rights over it.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              When tribal leaders negotiated the 1855 Point Elliott and Medicine Creek treaties, they
              insisted on retaining the right to fish at their usual and accustomed grounds and stations —
              knowing that salmon were too central to their way of life to surrender. Those treaty rights,
              affirmed by federal courts repeatedly since 1974, are a legally binding recognition of this
              centuries-long relationship.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
              <p className="text-sm text-gray-800">
                <strong>Continuing today:</strong> Tribal hatchery programs, habitat restoration projects,
                and co-management of salmon populations are all expressions of ongoing tribal stewardship.
                See the <Link href="/stewardship" className="text-primary underline">Stewardship Projects</Link> page
                for documented examples in Puget Sound.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Threats to Puget Sound Salmon</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Chinook salmon in Puget Sound are listed as <strong>threatened under the Endangered Species Act</strong>,
              and several other species are also in decline. The causes are multiple and compounding:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {[
                { threat: 'Habitat loss', desc: 'Floodplains diked, wetlands filled, side channels blocked. Urban and agricultural development has reduced the complexity of salmon habitat across the region.' },
                { threat: 'Fish passage barriers', desc: 'Thousands of undersized or poorly designed culverts under roads block salmon from reaching upstream habitat. WSDOT is replacing hundreds under a federal court order.' },
                { threat: 'Water temperature', desc: 'Climate change is warming streams. Salmon eggs and juveniles have narrow temperature tolerance. Summer temperatures in many streams now regularly exceed safe thresholds.' },
                { threat: 'Hatchery and wild fish interactions', desc: 'Large hatchery programs can suppress wild population fitness through competition and interbreeding. Managing this balance is a central challenge in salmon recovery.' },
                { threat: 'Predation', desc: 'Harbor seal and sea lion populations have grown substantially since the Marine Mammal Protection Act. Predation at river mouths is a meaningful source of mortality in some systems.' },
                { threat: 'Contaminants', desc: 'Stormwater runoff from urban areas carries tire rubber chemicals, heavy metals, and other contaminants. Coho salmon die-offs in urban streams have been directly linked to stormwater.' },
              ].map(({ threat, desc }) => (
                <div key={threat} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-bold text-red-800 mb-1 text-sm">{threat}</h3>
                  <p className="text-sm text-gray-700">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Reasons for Hope</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The decline of Puget Sound salmon is severe — but recovery is possible, and there is evidence
              it is working in some places:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Nisqually River:</strong> After the removal of dikes and restoration of 1,100+ acres
                of estuary habitat, juvenile Chinook use of the delta increased substantially. The Nisqually is
                now considered one of the healthier Puget Sound Chinook populations.
              </li>
              <li>
                <strong>Culvert replacement:</strong> Every removed fish-passage barrier opens miles of
                previously inaccessible spawning habitat. Washington state has corrected hundreds of culverts
                under the Boldt Decision court order.
              </li>
              <li>
                <strong>Streamflow protections:</strong> Instream flow rules in some basins have improved low-flow
                conditions, reducing summer temperature stress on salmon.
              </li>
              <li>
                <strong>Coho recovery in some systems:</strong> Where urban stormwater treatment has improved,
                coho survival rates in some streams have increased.
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Recovery requires sustained, coordinated action across government agencies, tribes, landowners,
              and communities. The science is clear about what salmon need. The question is whether we will
              provide it.
            </p>
          </section>
        </div>

        {/* Key Takeaways */}
        <div className="bg-primary text-white rounded-lg p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">Key Takeaways</h2>
          <ul className="space-y-3">
            {[
              'Salmon are a keystone species — at least 137 other species depend on them directly.',
              'When salmon die in streams, their bodies fertilize the surrounding forest with ocean nutrients.',
              'Pacific salmon support major commercial, recreational, and tribal fisheries worth billions of dollars.',
              'For the Native Nations of Puget Sound, salmon are central to culture, ceremony, and treaty-protected rights.',
              'Chinook salmon in Puget Sound are listed as threatened under the Endangered Species Act due to habitat loss, warming water, barriers, and other stressors.',
              'Recovery is possible — targeted habitat restoration, culvert removal, and co-management are producing measurable results in some systems.',
            ].map((point) => (
              <li key={point} className="flex gap-3">
                <span className="shrink-0 text-white/60 mt-1">›</span>
                <span className="text-sm leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* For Educators */}
        <details className="mb-8 border border-gray-200 rounded-lg">
          <summary className="px-6 py-4 font-bold text-primary cursor-pointer hover:bg-gray-50 rounded-lg">
            For Educators — Discussion Questions & Activities
          </summary>
          <div className="px-6 pb-6 space-y-6">
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Discussion Questions</h3>
              <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-700">
                <li>What does it mean for a species to be a &quot;keystone species&quot;? Can you think of other keystone species in different ecosystems?</li>
                <li>How do salmon connect the ocean and the forest? Trace the nutrient cycle in your own words.</li>
                <li>Why did tribal leaders insist on keeping fishing rights in the 1855 treaties? What does this tell us about how they understood salmon?</li>
                <li>The ESA listing of Puget Sound Chinook happened in 1999. What obligations does this create for governments, businesses, and individuals?</li>
                <li>Of the six threats listed, which do you think is most urgent to address? What evidence would you need to support your position?</li>
              </ol>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Activities</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="shrink-0 text-primary">›</span>
                  <span><strong>Food web mapping:</strong> Have students map all 137 species that depend on salmon. Group by type (bird, mammal, fish, invertebrate). What would happen to each group if salmon disappeared?</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-primary">›</span>
                  <span><strong>Dashboard analysis:</strong> Use the <Link href="/dashboard" className="text-primary underline">Salmon Health Dashboard</Link> to compare Chinook population trends across two different watersheds. Identify which threats might explain the differences.</span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-primary">›</span>
                  <span><strong>Economic cost estimation:</strong> Research the cost of one major salmon recovery project (e.g., the Nisqually delta restoration or WSDOT culvert replacement). What is the cost per mile of habitat opened, or per fish added to the run?</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs text-gray-500">
                <strong>Standards alignment:</strong> NGSS MS-LS2-2, MS-LS2-4, HS-LS2-6, HS-LS2-7 (ecosystems, biodiversity).
                CCSS ELA-Literacy RH.6-8.7. Washington EALRs 4.2 (environmental and sustainability literacy).
              </p>
            </div>
          </div>
        </details>

        {/* Connections */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Link href="/dashboard" className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
            <p className="font-bold text-primary mb-1 text-sm">Explore the Data →</p>
            <p className="text-xs text-gray-600">See current salmon population trends for each Puget Sound watershed</p>
          </Link>
          <Link href="/stewardship" className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
            <p className="font-bold text-primary mb-1 text-sm">See the Projects →</p>
            <p className="text-xs text-gray-600">Real restoration and monitoring programs working on salmon recovery</p>
          </Link>
          <Link href="/learn/treaty-rights" className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
            <p className="font-bold text-primary mb-1 text-sm">Learn: Treaty Rights →</p>
            <p className="text-xs text-gray-600">The legal history that shapes salmon co-management today</p>
          </Link>
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Link href="/learn" className="text-primary hover:underline text-sm">← Back to Learn</Link>
          <Link href="/learn/treaty-rights" className="text-primary hover:underline text-sm">Next: Treaty Rights →</Link>
        </div>

      </div>
    </div>
  );
}
