export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  slug: string;
  icon: string;
}

const mockSpecies: Species[] = [
  { id: '1', commonName: 'Chinook', scientificName: 'Oncorhynchus tshawytscha', slug: 'chinook', icon: '🐟' },
  { id: '2', commonName: 'Coho', scientificName: 'Oncorhynchus kisutch', slug: 'coho', icon: '🐟' },
  { id: '3', commonName: 'Chum', scientificName: 'Oncorhynchus keta', slug: 'chum', icon: '🐟' },
  { id: '4', commonName: 'Pink', scientificName: 'Oncorhynchus gorbuscha', slug: 'pink', icon: '🐟' },
  { id: '5', commonName: 'Sockeye', scientificName: 'Oncorhynchus nerka', slug: 'sockeye', icon: '🐟' },
  { id: '6', commonName: 'Steelhead', scientificName: 'Oncorhynchus mykiss', slug: 'steelhead', icon: '🐟' },
];

export async function getSpecies(): Promise<Species[]> {
  return mockSpecies;
}

export async function getSpeciesById(id: string): Promise<Species | undefined> {
  return mockSpecies.find((s) => s.id === id);
}

export async function getSpeciesBySlug(slug: string): Promise<Species | undefined> {
  return mockSpecies.find((s) => s.slug === slug);
}