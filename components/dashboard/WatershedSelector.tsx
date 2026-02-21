'use client';

interface Watershed {
  id: string;
  name: string;
  slug: string;
}

interface WatershedSelectorProps {
  watersheds: Watershed[];
  selected: string;
  onChange: (value: string) => void;
}

export function WatershedSelector({
  watersheds,
  selected,
  onChange,
}: WatershedSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="watershed-select" className="text-sm font-medium text-gray-700">
        Select Watershed
      </label>
      <select
        id="watershed-select"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        <option value="all">All Puget Sound</option>
        {watersheds.map((w) => (
          <option key={w.id} value={w.slug}>
            {w.name}
          </option>
        ))}
      </select>
    </div>
  );
}