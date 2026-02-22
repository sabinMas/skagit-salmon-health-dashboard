export interface TribeContent {
  salmonRelationship?: string;
  historicalPractices?: string;
  salmonToday?: string;
}

export interface Tribe {
  id: string;
  name: string;
  slug: string;
  displayName: string;
  languageName?: string;
  tagline: string;
  websiteUrl?: string;
  watershedIds?: string[];  // slugs matching lib/data/watersheds.ts
  content?: TribeContent;
}

const mockTribes: Tribe[] = [
  {
    id: '1',
    name: 'Tulalip Tribes',
    slug: 'tulalip',
    displayName: 'Tulalip Tribes',
    tagline: 'Stewarding salmon and watersheds in the Snohomish basin since time immemorial',
    watershedIds: ['snohomish'],
    content: {
      salmonRelationship:
        'The Tulalip Tribes — descendants of the Snohomish, Snoqualmie, Skykomish, and ' +
        'other Lushootseed-speaking peoples — have fished the Snohomish River basin and ' +
        'Puget Sound since time immemorial. Salmon is central to the Tulalip First Salmon ' +
        'Ceremony, which marks the return of the salmon each year with celebration, gratitude, ' +
        'and prayer. Every part of the fish is honored; nothing is wasted.',
      historicalPractices:
        'Tulalip ancestors developed sophisticated fishery management practices refined ' +
        'over thousands of years. Reef net fishing at precise tidal locations in the Salish ' +
        'Sea, weir fishing in upriver tributaries, and communal harvest protocols governed ' +
        'by village leaders ensured that enough fish returned to spawn each season. These ' +
        'practices embedded sustainability into culture long before the concept had a name.',
      salmonToday:
        'The Tulalip Tribes Natural Resources Department operates the Tulalip Hatchery on ' +
        'Tulalip Creek, conducts spawner surveys throughout the Snohomish basin, and leads ' +
        'habitat restoration projects in partnership with Snohomish County. The Tribe\'s ' +
        'Hatchery Enhancement Program integrates traditional ecological knowledge into ' +
        'hatchery management to improve Chinook survival and increase natural-origin spawning.',
    },
  },
  {
    id: '2',
    name: 'Muckleshoot Indian Tribe',
    slug: 'muckleshoot',
    displayName: 'Muckleshoot Indian Tribe',
    tagline: 'Protecting salmon habitat in the Green/Duwamish and White River watersheds',
    watershedIds: ['green'],
    content: {
      salmonRelationship:
        'The Muckleshoot people are the salmon people of the Green and White River watersheds. ' +
        'Salmon have shaped every aspect of Muckleshoot culture — from ceremonies and trade to ' +
        'diet and governance. The tribe\'s name itself is tied to the land and water of their ' +
        'homeland. For the Muckleshoot, salmon are not simply a food source; they are relatives, ' +
        'teachers, and the foundation of a way of life that has endured for thousands of years.',
      historicalPractices:
        'Muckleshoot ancestors fished the White and Green Rivers at locations passed down ' +
        'through generations, timing their harvest with the precise rhythms of natural salmon ' +
        'runs using knowledge accumulated over millennia. Fish preservation through smoking ' +
        'and drying sustained communities through winter and was a cornerstone of regional ' +
        'trade networks. Harvest was never indiscriminate — protocols ensured enough fish ' +
        'returned each year to sustain future generations.',
      salmonToday:
        'Today the Muckleshoot Indian Tribe operates the White River Hatchery and employs ' +
        'fisheries biologists and habitat restoration crews year-round. The Tribe\'s Youth ' +
        'Salmon Stewards program connects young Muckleshoot members with traditional salmon ' +
        'knowledge and modern water science — ensuring that the next generation carries both ' +
        'forward. The Tribe also actively monitors water temperature and flow in the Green River ' +
        'watershed to protect cold-water refugia critical for salmon survival.',
    },
  },
  {
    id: '3',
    name: 'Puyallup Tribe',
    slug: 'puyallup',
    displayName: 'Puyallup Tribe of Indians',
    tagline: 'Leading restoration efforts in the Puyallup River watershed',
    watershedIds: ['puyallup'],
    content: {
      salmonRelationship:
        'The Puyallup people have lived along the Puyallup River since time immemorial, ' +
        'with salmon at the heart of their culture, sustenance, and spiritual identity. ' +
        'The Puyallup River once supported some of the largest Chinook runs in Puget Sound, ' +
        'and restoring those runs is central to the Tribe\'s mission today. The Puyallup ' +
        'Tribe of Indians holds treaty-protected fishing rights affirmed by the 1854 Treaty ' +
        'of Medicine Creek and upheld by the 1974 Boldt Decision.',
      historicalPractices:
        'Traditional Puyallup fishing practices were governed by respected tribal leaders ' +
        'who ensured that harvests were taken only in sustainable quantities. Weirs, dip nets, ' +
        'and spears were used at established fishing sites. Salmon were smoked and dried for ' +
        'winter storage and traded with neighboring peoples. The Puyallup River delta, now ' +
        'heavily industrialized, was once a rich estuary providing critical rearing habitat ' +
        'for juvenile Chinook.',
      salmonToday:
        'The Puyallup Tribe is leading a watershed-scale Climate Adaptation Plan to maintain ' +
        'cold-water refugia and preserve spawning gravel as summer stream temperatures rise ' +
        'due to climate change. The Tribe works with regional partners to restore floodplain ' +
        'connectivity, remove fish passage barriers, and plant riparian vegetation to shade ' +
        'stream channels. Despite significant habitat challenges, the Tribe remains committed ' +
        'to recovering Puyallup River salmon for future generations.',
    },
  },
  {
    id: '4',
    name: 'Nisqually Indian Tribe',
    slug: 'nisqually',
    displayName: 'Nisqually Indian Tribe',
    tagline: 'Guardians of the Nisqually River and salmon populations',
    watershedIds: ['nisqually'],
    content: {
      salmonRelationship:
        'The Nisqually people have lived along the Nisqually River since time immemorial, ' +
        'with salmon at the center of their culture, diet, and spiritual practices. Nisqually ' +
        'leader Billy Frank Jr. was a tireless advocate for tribal treaty rights and salmon ' +
        'recovery, and was instrumental in the landmark 1974 Boldt Decision, which affirmed ' +
        'tribal treaty rights to half the harvestable salmon in Washington State.',
      historicalPractices:
        'Traditional Nisqually fishing used weir fishing, dip netting, and spear fishing — ' +
        'techniques refined over thousands of years that regulated harvest to ensure salmon ' +
        'populations could sustain themselves season after season. Nisqually fishers embedded ' +
        'traditional ecological knowledge into every harvest decision, reading the river, ' +
        'weather, and fish behavior to take only what the watershed could replenish.',
      salmonToday:
        'In 2009, the Nisqually Indian Tribe partnered with federal and state agencies to ' +
        'remove historic dikes at the Billy Frank Jr. Nisqually National Wildlife Refuge, ' +
        'reconnecting over 700 acres of the Nisqually River delta to tidal influence and ' +
        'restoring critical juvenile Chinook rearing habitat. This project is widely cited ' +
        'as one of the most successful estuary restorations in the Pacific Northwest and a ' +
        'model for salmon recovery partnerships.',
    },
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
