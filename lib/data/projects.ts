// Real, publicly documented Puget Sound salmon stewardship projects.
// Sources: USFWS, WDFW, Puget Sound Partnership, WSDOT, tribal program websites.
// Adapter pattern per PLANNING.md §7 — swap for DB/CMS in M6; UI never changes.

import type { Project } from "@/types";

const PROJECTS: Project[] = [
  {
    id: "nisqually-delta-restoration",
    title: "Nisqually River Delta Estuary Restoration",
    slug: "nisqually-delta-restoration",
    partnerOrgs: [
      "Nisqually Indian Tribe",
      "Nisqually Land Trust",
      "U.S. Fish & Wildlife Service",
      "WDFW",
    ],
    watershedId: "nisqually",
    type: "habitat_restoration",
    status: "active",
    yearStarted: 2009,
    excerpt:
      "The largest estuary restoration in the Pacific Northwest: 1,100+ acres of tidal wetlands reconnected at the Billy Frank Jr. Nisqually National Wildlife Refuge since 2009, dramatically improving rearing habitat for juvenile Chinook.",
  },
  {
    id: "skagit-system-cooperative",
    title: "Skagit River System Cooperative Salmon Monitoring",
    slug: "skagit-system-cooperative",
    partnerOrgs: [
      "Upper Skagit Indian Tribe",
      "Sauk-Suiattle Indian Tribe",
      "Swinomish Indian Tribal Community",
      "WDFW",
    ],
    watershedId: "skagit",
    type: "monitoring",
    status: "active",
    yearStarted: 1976,
    excerpt:
      "The Skagit River System Cooperative — a joint fisheries management body formed by the Skagit-area tribes and the State — conducts long-term salmon escapement monitoring, habitat assessments, and recovery planning across the Skagit basin.",
  },
  {
    id: "cedar-river-sockeye-hatchery",
    title: "Cedar River Landsburg Mitigation Hatchery",
    slug: "cedar-river-sockeye-hatchery",
    partnerOrgs: ["City of Seattle", "Muckleshoot Indian Tribe"],
    watershedId: "lake-washington",
    type: "hatchery",
    status: "active",
    yearStarted: 1984,
    excerpt:
      "Operated jointly by Seattle Public Utilities and the Muckleshoot Indian Tribe to mitigate the impact of Landsburg Diversion Dam, the hatchery produces sockeye and Chinook supplementation stock for the Cedar River — supporting one of the largest remaining Lake Washington sockeye runs.",
  },
  {
    id: "wsdot-culvert-replacement",
    title: "WSDOT State Highway Culvert Replacement Program",
    slug: "wsdot-culvert-replacement",
    partnerOrgs: [
      "Washington State Department of Transportation",
      "WDFW",
      "Washington Tribes (21 co-plaintiffs)",
    ],
    watershedId: "nooksack",
    type: "habitat_restoration",
    status: "active",
    yearStarted: 2013,
    excerpt:
      "Under a federal court order affirmed by the U.S. Supreme Court in 2018, WSDOT is replacing hundreds of fish-blocking highway culverts statewide. Corrected culverts restore access to hundreds of miles of upstream spawning and rearing habitat.",
  },
  {
    id: "stillaguamish-chinook-recovery",
    title: "Stillaguamish Tribe Chinook Recovery Program",
    slug: "stillaguamish-chinook-recovery",
    partnerOrgs: ["Stillaguamish Tribe of Indians", "NOAA Fisheries", "WDFW"],
    watershedId: "stillaguamish",
    type: "hatchery",
    status: "active",
    yearStarted: 1997,
    excerpt:
      "The Stillaguamish Tribe operates the Portage Creek Acclimation Pond and coordinates habitat restoration, hatchery supplementation, and spawner surveys to rebuild the Stillaguamish wild Chinook population, one of the most depressed in Puget Sound.",
  },
  {
    id: "duwamish-alive",
    title: "Duwamish Alive Habitat Restoration",
    slug: "duwamish-alive",
    partnerOrgs: [
      "Duwamish Alive Coalition",
      "King County",
      "City of Seattle",
      "Muckleshoot Indian Tribe",
    ],
    watershedId: "green-duwamish",
    type: "habitat_restoration",
    status: "active",
    yearStarted: 2005,
    excerpt:
      "A community-led coalition restoring native riparian vegetation along the lower Duwamish River through volunteer planting events, invasive removal, and bank stabilization — improving water quality and juvenile salmon corridor conditions in an urbanized estuary.",
  },
  {
    id: "nooksack-salmon-enhancement",
    title: "Nooksack Salmon Enhancement Association Restoration",
    slug: "nooksack-salmon-enhancement",
    partnerOrgs: [
      "Nooksack Salmon Enhancement Association",
      "Nooksack Indian Tribe",
      "Whatcom Conservation District",
      "WDFW",
    ],
    watershedId: "nooksack",
    type: "youth_education",
    status: "active",
    yearStarted: 1990,
    excerpt:
      "NSEA engages schools, landowners, and volunteers in habitat restoration, water quality monitoring, and salmon-in-the-classroom programs across the Nooksack watershed, connecting communities to wild salmon recovery since 1990.",
  },
  {
    id: "skokomish-river-channel-restoration",
    title: "Skokomish River Channel & Estuary Restoration",
    slug: "skokomish-river-channel-restoration",
    partnerOrgs: [
      "Skokomish Tribe",
      "Mason County",
      "U.S. Army Corps of Engineers",
      "WDFW",
    ],
    watershedId: "skokomish",
    type: "habitat_restoration",
    status: "active",
    yearStarted: 2002,
    excerpt:
      "Decades of channelization and diking disconnected the Skokomish River from its floodplain. Ongoing restoration work — led by the Skokomish Tribe with federal and county partners — is re-establishing side-channel connectivity and estuary habitat critical for Hood Canal Chinook and chum.",
  },
  {
    id: "snohomish-wria7-salmon-recovery",
    title: "WRIA 7 Snohomish Basin Salmon Recovery Plan",
    slug: "snohomish-wria7-salmon-recovery",
    partnerOrgs: [
      "Snohomish County",
      "Tulalip Tribes",
      "Stillaguamish Tribe of Indians",
      "Puget Sound Salmon Recovery Council",
    ],
    watershedId: "snohomish",
    type: "research",
    status: "active",
    yearStarted: 2005,
    excerpt:
      "The WRIA 7 Steering Committee coordinates watershed-scale Chinook recovery planning across the Snohomish basin, prioritizing habitat projects, levee setbacks, and riparian buffer restoration informed by long-term population monitoring.",
  },
];

export function getProjects(options?: {
  type?: string;
  watershedId?: string;
}): Project[] {
  let results = PROJECTS;
  if (options?.type)
    results = results.filter((p) => p.type === options.type);
  if (options?.watershedId)
    results = results.filter((p) => p.watershedId === options.watershedId);
  return results;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
