import { readMarkerStore } from "@/lib/markerStore";
import { filterMarkersNear } from "@/lib/markerUtils";
import type { LatLngPoint } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radiusKm = Number.parseFloat(searchParams.get("radiusKm") ?? "150");

  const store = await readMarkerStore();

  if (lat === null || lng === null) {
    return Response.json({ markers: store.markers });
  }

  const epicenter: LatLngPoint = {
    lat: Number.parseFloat(lat),
    lng: Number.parseFloat(lng),
  };

  if (!Number.isFinite(epicenter.lat) || !Number.isFinite(epicenter.lng)) {
    return Response.json({ error: "Invalid lat/lng" }, { status: 400 });
  }

  const markers = filterMarkersNear(epicenter, store.markers, radiusKm);
  return Response.json({ markers });
}
