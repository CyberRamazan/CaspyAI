import type { DiscoveredAsset, LatLngPoint } from "@/lib/types";

export interface RawMarker {
  name: string;
  lat: number;
  lng: number;
  description: string;
}

function slugify(value: string | undefined | null): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

export function parseCoordinate(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

export function normalizeRawMarker(value: unknown): RawMarker | null {
  if (!value || typeof value !== "object") return null;
  const marker = value as Record<string, unknown>;
  const lat = parseCoordinate(marker.lat);
  const lng = parseCoordinate(marker.lng);
  if (
    typeof marker.name !== "string" ||
    lat === null ||
    lng === null ||
    typeof marker.description !== "string"
  ) {
    return null;
  }
  return {
    name: marker.name,
    lat,
    lng,
    description: marker.description,
  };
}

export function toDiscoveredAsset(
  marker: RawMarker,
  index?: number
): DiscoveredAsset {
  const slug = slugify(marker.name) || String(index ?? 0);
  return {
    id: `marker-${slug}-${marker.lat.toFixed(2)}-${marker.lng.toFixed(2)}`,
    name: marker.name,
    lat: marker.lat,
    lng: marker.lng,
    description: marker.description,
  };
}

export function normalizeMarkers(
  raw: Array<RawMarker | unknown>
): DiscoveredAsset[] {
  return raw
    .map(normalizeRawMarker)
    .filter((marker): marker is RawMarker => marker !== null)
    .map((marker, index) => toDiscoveredAsset(marker, index));
}

export function formatMarkersForPrompt(markers: DiscoveredAsset[]): string {
  if (markers.length === 0) return "No mapped assets on file for this area.";
  return markers
    .map(
      (m) =>
        `- ${m.name} (${m.lat.toFixed(4)}°N, ${m.lng.toFixed(4)}°E): ${m.description}`
    )
    .join("\n");
}

export function markerDedupeKey(marker: DiscoveredAsset): string {
  return `${slugify(marker.name)}|${marker.lat.toFixed(3)}|${marker.lng.toFixed(3)}`;
}

export function mergeMarkerLists(
  existing: DiscoveredAsset[],
  incoming: DiscoveredAsset[]
): DiscoveredAsset[] {
  const seen = new Set(existing.map(markerDedupeKey));
  const merged = [...existing];
  for (const marker of incoming) {
    const key = markerDedupeKey(marker);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(marker);
  }
  return merged;
}

export function haversineKm(a: LatLngPoint, b: LatLngPoint): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function filterMarkersNear(
  epicenter: LatLngPoint,
  markers: DiscoveredAsset[],
  radiusKm: number
): DiscoveredAsset[] {
  return markers
    .map((marker) => ({
      marker,
      distanceKm: haversineKm(epicenter, { lat: marker.lat, lng: marker.lng }),
    }))
    .filter((entry) => entry.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .map((entry) => entry.marker);
}
