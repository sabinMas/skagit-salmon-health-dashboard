import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';

export default function StewardshipPage() {
  const projects = [
    {
      id: '1',
      title: 'Skagit River Estuary Restoration',
      tribes: ['Swinomish Indian Tribal Community'],
      type: 'Habitat Restoration',
      location: 'Skagit River Delta',
      description: 'Restoring tidal marsh habitat critical for juvenile Chinook salmon rearing.',
    },
    {
      id: '2',
      title: 'Temperature Monitoring Network',
      tribes: ['Tulalip Tribes', 'Stillaguamish Tribe'],
      type: 'Monitoring',
      location: 'Snohomish & Stillaguamish basins',
      description: 'Real-time stream temperature monitoring to track climate impacts on salmon.',
    },
    {
      id: '3',
      title: 'Youth Salmon Education Program',
      tribes: ['Muckleshoot Indian Tribe'],
      type: 'Education',
      location: 'Green River Watershed',
      description: 'Teaching tribal youth traditional ecological knowledge and modern science.',
    },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Stewardship & Projects"
          description="Tribal nations are leading salmon recovery through habitat restoration, monitoring, climate adaptation, and youth education."
        />

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="mb-3">
                  <span className="text-xs bg-accent text-white px-2 py-1 rounded">
                    {project.type}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Led by:</strong> {project.tribes.join(', ')}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Location:</strong> {project.location}
                </p>
                <p className="text-gray-700 text-sm">{project.description}</p>
                <div className="mt-4 text-primary font-semibold text-sm">
                  Learn More →
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-gray-800">
            <strong>Note:</strong> This is a curated selection of projects. Many more restoration,
            monitoring, and education initiatives are underway across Puget Sound. Project pages
            with detailed stories, photos, and outcomes coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
