import type { DiscoveredAsset, LatLngPoint } from "@/lib/types";

export async function fetchAllMapMarkers(
  signal?: AbortSignal
): Promise<DiscoveredAsset[]> {
  const response = await fetch("/api/markers", { signal });
  if (!response.ok) throw new Error("Failed to load map markers");
  const body = (await response.json()) as { markers: DiscoveredAsset[] };
  return body.markers;
}

export async function fetchMapMarkersNear(
  epicenter: LatLngPoint,
  signal?: AbortSignal
): Promise<DiscoveredAsset[]> {
  const params = new URLSearchParams({
    lat: String(epicenter.lat),
    lng: String(epicenter.lng),
    radiusKm: "150",
  });
  const response = await fetch(`/api/markers?${params}`, { signal });
  if (!response.ok) throw new Error("Failed to load map markers");
  const body = (await response.json()) as { markers: DiscoveredAsset[] };
  return body.markers;
}
