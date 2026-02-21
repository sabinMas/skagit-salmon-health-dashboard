'use client';

interface Species {
  id: string;
  commonName: string;
  slug: string;
}

interface SpeciesFilterProps {
  species: Species[];
  selected: string;
  onChange: (value: string) => void;
}

export function SpeciesFilter({ species, selected, onChange }: SpeciesFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Filter by Species</label>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Species
        </button>
        {species.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange(s.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selected === s.slug
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s.commonName}
          </button>
        ))}
      </div>
    </div>
  );
}