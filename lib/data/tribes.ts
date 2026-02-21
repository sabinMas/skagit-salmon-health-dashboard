export interface Tribe {
  id: string;
  name: string;
  slug: string;
  displayName: string;
  languageName?: string;
  tagline: string;
  websiteUrl?: string;
}

const mockTribes: Tribe[] = [
  {
    id: '1',
    name: 'Tulalip Tribes',
    slug: 'tulalip',
    displayName: 'Tulalip Tribes',
    tagline: 'Stewarding salmon and watersheds in the Snohomish basin since time immemorial',
  },
  {
    id: '2',
    name: 'Muckleshoot Indian Tribe',
    slug: 'muckleshoot',
    displayName: 'Muckleshoot Indian Tribe',
    tagline: 'Protecting salmon habitat in the Green/Duwamish and White River watersheds',
  },
  {
    id: '3',
    name: 'Puyallup Tribe',
    slug: 'puyallup',
    displayName: 'Puyallup Tribe of Indians',
    tagline: 'Leading restoration efforts in the Puyallup River watershed',
  },
  {
    id: '4',
    name: 'Nisqually Indian Tribe',
    slug: 'nisqually',
    displayName: 'Nisqually Indian Tribe',
    tagline: 'Guardians of the Nisqually River and salmon populations',
  },
  {
    id: '5',
    name: 'Skokomish Indian Tribe',
    slug: 'skokomish',
    displayName: 'Skokomish Indian Tribe',
    tagline: 'Restoring salmon runs in Hood Canal watersheds',
  },
  {
    id: '6',
    name: 'Stillaguamish Tribe',
    slug: 'stillaguamish',
    displayName: 'Stillaguamish Tribe of Indians',
    tagline: 'Protecting salmon in the Stillaguamish River basin',
  },
  {
    id: '7',
    name: 'Snoqualmie Tribe',
    slug: 'snoqualmie',
    displayName: 'Snoqualmie Indian Tribe',
    tagline: 'Traditional stewards of the Snoqualmie River watershed',
  },
  {
    id: '8',
    name: 'Suquamish Tribe',
    slug: 'suquamish',
    displayName: 'Suquamish Tribe',
    tagline: 'Caring for salmon across Central Puget Sound waters',
  },
  {
    id: '9',
    name: 'Lummi Nation',
    slug: 'lummi',
    displayName: 'Lummi Nation',
    tagline: 'Salmon people protecting Nooksack River and northern waters',
  },
];

export async function getTribes(): Promise<Tribe[]> {
  return mockTribes;
}

export async function getTribeBySlug(slug: string): Promise<Tribe | undefined> {
  return mockTribes.find((t) => t.slug === slug);
}