export interface Watershed {
  id: string;
  name: string;
  slug: string;
  region: string;
  areaSqKm: number;
}

const mockWatersheds: Watershed[] = [
  { id: '1', name: 'Skagit River', slug: 'skagit', region: 'North Sound', areaSqKm: 8134 },
  { id: '2', name: 'Snohomish River', slug: 'snohomish', region: 'Central Sound', areaSqKm: 4851 },
  { id: '3', name: 'Lake Washington/Cedar/Sammamish', slug: 'lake-washington', region: 'Central Sound', areaSqKm: 1265 },
  { id: '4', name: 'Green/Duwamish River', slug: 'green-duwamish', region: 'Central Sound', areaSqKm: 1945 },
  { id: '5', name: 'Puyallup/White River', slug: 'puyallup-white', region: 'South Sound', areaSqKm: 2406 },
  { id: '6', name: 'Nisqually River', slug: 'nisqually', region: 'South Sound', areaSqKm: 1979 },
  { id: '7', name: 'Skokomish River', slug: 'skokomish', region: 'Hood Canal', areaSqKm: 623 },
  { id: '8', name: 'Stillaguamish River', slug: 'stillaguamish', region: 'North Sound', areaSqKm: 1791 },
  { id: '9', name: 'Nooksack River', slug: 'nooksack', region: 'North Sound', areaSqKm: 2145 },
];

export async function getWatersheds(): Promise<Watershed[]> {
  return mockWatersheds;
}

export async function getWatershedBySlug(slug: string): Promise<Watershed | undefined> {
  return mockWatersheds.find((w) => w.slug === slug);
}