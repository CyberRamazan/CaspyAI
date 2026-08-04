"use client";

import { useMemo } from "react";
import { Polygon } from "react-leaflet";
import { circle } from "@turf/turf";
import type { LatLngExpression } from "leaflet";
import type { LatLngPoint } from "@/lib/types";

interface HazardZoneProps {
  center: LatLngPoint;
  radiusKm: number;
}

export default function HazardZone({ center, radiusKm }: HazardZoneProps) {
  const positions = useMemo(() => {
    const poly = circle([center.lng, center.lat], radiusKm, {
      steps: 64,
      units: "kilometers",
    });
    const ring = poly.geometry.coordinates[0];
    return ring.map(([lng, lat]) => [lat, lng] as LatLngExpression);
  }, [center.lat, center.lng, radiusKm]);

  return (
    <Polygon
      positions={positions}
      pathOptions={{
        color: "#f97316",
        weight: 2,
        opacity: 0.9,
        fillColor: "#ef4444",
        fillOpacity: 0.35,
        className: "hazard-zone-pulse",
      }}
    />
  );
}
