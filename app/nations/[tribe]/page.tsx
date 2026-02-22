import { notFound }              from 'next/navigation';
import Link                       from 'next/link';
import type { Metadata }          from 'next';
import { AttributionBanner }      from '@/components/nations/AttributionBanner';
import { ContentSection }         from '@/components/nations/ContentSection';
import { getTribeBySlug }         from '@/lib/data/tribes';
import { getProjects }            from '@/lib/data/projects';
import { getWatershedBySlug }     from '@/lib/data/watersheds';

// ── Types ─────────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ tribe: string }>;
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tribe: slug } = await params;
  const tribe = await getTribeBySlug(slug);
  if (!tribe) return { title: 'Nation Not Found' };
  return {
    title: `${tribe.displayName} | Nations | Puget Sound Salmon Health`,
    description: tribe.tagline,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function TribePage({ params }: PageProps) {
  const { tribe: slug } = await params;
  const tribe = await getTribeBySlug(slug);
  if (!tribe) notFound();

  // Projects led by this tribe
  const tribeProjects = getProjects({ tribeId: slug });

  // Watersheds linked to this tribe (for dashboard metric links)
  const watersheds = await Promise.all(
    (tribe.watershedIds ?? []).map((wId) => getWatershedBySlug(wId)),
  ).then((results) => results.filter(Boolean));

  const hasContent = !!(
    tribe.content?.salmonRelationship ||
    tribe.content?.historicalPractices ||
    tribe.content?.salmonToday
  );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/nations" className="text-primary hover:underline">Nations</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">{tribe.displayName}</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">{tribe.displayName}</h1>
          {tribe.languageName && (
            <p className="text-xl text-gray-600 italic mb-4">{tribe.languageName}</p>
          )}
          <p className="text-lg text-gray-700 leading-relaxed">{tribe.tagline}</p>
        </div>

        {/* Attribution Banner */}
        <AttributionBanner
          tribeName={tribe.displayName}
          reviewDate={hasContent ? 'Pending tribal review' : undefined}
        />

        {/* Our Relationship with Salmon */}
        <ContentSection
          title="Our Relationship with Salmon"
          tribeName={tribe.displayName}
          sectionType="introduction"
          showPlaceholder={!tribe.content?.salmonRelationship}
        >
          {tribe.content?.salmonRelationship && (
            <p className="text-gray-700 leading-relaxed">{tribe.content.salmonRelationship}</p>
          )}
        </ContentSection>

        {/* Historical Practices */}
        <ContentSection
          title="Historical Practices"
          tribeName={tribe.displayName}
          sectionType="historical-practices"
          showPlaceholder={!tribe.content?.historicalPractices}
        >
          {tribe.content?.historicalPractices && (
            <p className="text-gray-700 leading-relaxed">{tribe.content.historicalPractices}</p>
          )}
        </ContentSection>

        {/* Salmon Today */}
        <ContentSection
          title="Salmon in Our Community Today"
          tribeName={tribe.displayName}
          sectionType="salmon-today"
          showPlaceholder={!tribe.content?.salmonToday}
        >
          {tribe.content?.salmonToday && (
            <p className="text-gray-700 leading-relaxed">{tribe.content.salmonToday}</p>
          )}
        </ContentSection>

        {/* Watershed data links */}
        {watersheds.length > 0 && (
          <section className="mb-8 bg-surface border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-primary mb-2">
              Salmon in {tribe.displayName}&apos;s Waters
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              View current conditions and trends for the watershed
              {watersheds.length > 1 ? 's' : ''} within {tribe.displayName}&apos;s territory.
            </p>
            <div className="flex flex-wrap gap-3">
              {watersheds.map((ws) => ws && (
                <Link
                  key={ws.slug}
                  href={`/dashboard/${ws.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-primary text-primary text-sm font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  {ws.name} Watershed →
                </Link>
              ))}
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Full Dashboard
              </Link>
            </div>
          </section>
        )}

        {/* Fallback metric section for tribes without watershed data */}
        {watersheds.length === 0 && (
          <section className="mb-8 bg-surface border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-primary mb-2">
              Salmon in {tribe.displayName}&apos;s Waters
            </h2>
            <p className="text-gray-700 mb-4 text-sm">
              Watershed-specific data for {tribe.displayName}&apos;s territory will be linked
              here as data integration progresses.
            </p>
            <Link href="/dashboard" className="text-primary font-semibold hover:underline text-sm">
              View Full Dashboard Data →
            </Link>
          </section>
        )}

        {/* Stewardship Projects */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Stewardship Projects</h2>
          {tribeProjects.length > 0 ? (
            <div className="space-y-4">
              {tribeProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/stewardship/${project.slug}`}
                  className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-5 hover:border-primary hover:shadow-sm transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-primary mb-1 leading-snug">{project.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{project.excerpt}</p>
                  </div>
                  <span className="shrink-0 text-primary font-semibold text-sm mt-0.5">
                    View →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-600 text-sm">
                Project pages for {tribe.displayName}-led restoration and monitoring efforts
                will appear here as content is added.
              </p>
              <Link
                href="/stewardship"
                className="text-primary font-semibold hover:underline mt-4 inline-block text-sm"
              >
                View All Projects →
              </Link>
            </div>
          )}
        </section>

        {/* Learn More / External link */}
        <section className="bg-primary text-white rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">Learn More</h3>
          {tribe.websiteUrl ? (
            <p className="text-sm leading-relaxed">
              Visit{' '}
              <a
                href={tribe.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-200"
              >
                {tribe.displayName}&apos;s official website
              </a>{' '}
              for more information about their programs, governance, and initiatives.
            </p>
          ) : (
            <p className="text-sm leading-relaxed">
              For more information about {tribe.displayName}&apos;s salmon stewardship programs,
              please contact the Tribe directly.
            </p>
          )}
        </section>

        {/* Back nav */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <Link href="/nations" className="text-primary hover:underline text-sm">
            ← Back to Nations
          </Link>
        </div>

      </div>
    </div>
  );
}
