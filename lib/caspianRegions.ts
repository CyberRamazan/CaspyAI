import { distance, point } from "@turf/turf";
import type { LatLngPoint } from "@/lib/types";

export interface CaspianRegion {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  authority: string;
}

export interface DetectedRegion extends CaspianRegion {
  distanceKm: number;
}

/** Major Caspian coastal cities used for nearest-region lookup */
export const CASPIAN_REGIONS: CaspianRegion[] = [
  {
    id: "aktau",
    name: "Aktau",
    country: "Kazakhstan",
    lat: 43.656,
    lng: 51.168,
    authority: "DCHS Mangystau",
  },
  {
    id: "atyrau",
    name: "Atyrau",
    country: "Kazakhstan",
    lat: 47.117,
    lng: 51.883,
    authority: "DCHS Atyrau Region",
  },
  {
    id: "astrakhan",
    name: "Astrakhan",
    country: "Russia",
    lat: 46.348,
    lng: 48.034,
    authority: "EMERCOM Astrakhan Oblast",
  },
  {
    id: "makhachkala",
    name: "Makhachkala",
    country: "Russia",
    lat: 42.985,
    lng: 47.505,
    authority: "EMERCOM Dagestan",
  },
  {
    id: "baku",
    name: "Baku",
    country: "Azerbaijan",
    lat: 40.409,
    lng: 49.867,
    authority: "Ministry of Emergency Situations (Azerbaijan)",
  },
  {
    id: "turkmenbashi",
    name: "Turkmenbashi",
    country: "Turkmenistan",
    lat: 40.017,
    lng: 52.967,
    authority: "Ministry of Defence (Turkmenistan EM)",
  },
  {
    id: "bandar-anzali",
    name: "Bandar Anzali",
    country: "Iran",
    lat: 37.473,
    lng: 49.458,
    authority: "Iranian Red Crescent / Port Authority",
  },
  {
    id: "gorgan",
    name: "Gorgan",
    country: "Iran",
    lat: 36.842,
    lng: 54.443,
    authority: "Golestan Province Emergency Office",
  },
  {
    id: "fort-shevchenko",
    name: "Fort Shevchenko",
    country: "Kazakhstan",
    lat: 44.507,
    lng: 50.263,
    authority: "DCHS Mangystau (Tupkaragan District)",
  },
  {
    id: "kuryk",
    name: "Kuryk",
    country: "Kazakhstan",
    lat: 43.183,
    lng: 51.683,
    authority: "DCHS Mangystau",
  },
];

export function findNearestRegion(epicenter: LatLngPoint): DetectedRegion {
  const epicenterPoint = point([epicenter.lng, epicenter.lat]);

  let nearest = CASPIAN_REGIONS[0];
  let minDist = Infinity;

  for (const region of CASPIAN_REGIONS) {
    const dist = distance(epicenterPoint, point([region.lng, region.lat]), {
      units: "kilometers",
    });
    if (dist < minDist) {
      minDist = dist;
      nearest = region;
    }
  }

  return {
    ...nearest,
    distanceKm: Math.round(minDist * 10) / 10,
  };
}

export function formatRegionLabel(region: DetectedRegion): string {
  return `${region.name}, ${region.country}`;
}

export function findNearbyRegions(
  epicenter: LatLngPoint,
  limit = 3
): Array<DetectedRegion & { distanceKm: number }> {
  const epicenterPoint = point([epicenter.lng, epicenter.lat]);

  return CASPIAN_REGIONS.map((region) => ({
    ...region,
    distanceKm:
      Math.round(
        distance(epicenterPoint, point([region.lng, region.lat]), {
          units: "kilometers",
        }) * 10
      ) / 10,
  }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}
