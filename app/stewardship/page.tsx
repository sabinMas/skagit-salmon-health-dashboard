import { PageHeader }   from '@/components/ui/PageHeader';
import { ProjectList }  from '@/components/stewardship/ProjectList';
import { getProjects }  from '@/lib/data/projects';
import { getTribes }    from '@/lib/data/tribes';

export default async function StewardshipPage() {
  const [tribes] = await Promise.all([getTribes()]);
  const rawProjects = getProjects();

  // Resolve tribeIds → display names for each project
  const projects = rawProjects.map((project) => ({
    ...project,
    tribeNames: project.tribeIds.map((id) => {
      const found = tribes.find((t) => t.slug === id);
      return found?.displayName
        ?? id.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
    }),
  }));

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Stewardship & Projects"
          description="Tribal nations are leading salmon recovery through habitat restoration, monitoring, climate adaptation, and youth education."
        />

        <ProjectList projects={projects} />

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-gray-800 text-sm">
            <strong>Note:</strong> This is a curated selection of projects. Many more restoration,
            monitoring, and education initiatives are underway across Puget Sound. Detailed project
            stories, photos, and outcome data will be provided by tribal partners through the content
            workflow (M6).
          </p>
        </div>
      </div>
    </div>
  );
}
