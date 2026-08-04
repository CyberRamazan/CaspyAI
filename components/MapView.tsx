"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import HazardZone from "@/components/HazardZone";
import MetricBar from "@/components/MetricBar";
import { AKTAU_CENTER, DEFAULT_ZOOM, MAP_MARKERS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/I18nContext";
import type { EcosystemAlert, LatLngPoint } from "@/lib/types";

interface MapViewProps {
  epicenter: LatLngPoint | null;
  radiusKm: number;
  onMapClick: (point: LatLngPoint) => void;
  activeIncidents: number;
  riskAreaSqKm: number;
  ecosystemAlert: EcosystemAlert;
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (point: LatLngPoint) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

const MARKER_COPY_KEY = {
  "aktau-port": "aktauPort",
  "seal-habitat": "sealHabitat",
  kashagan: "kashagan",
} as const;

export default function MapView({
  epicenter,
  radiusKm,
  onMapClick,
  activeIncidents,
  riskAreaSqKm,
  ecosystemAlert,
}: MapViewProps) {
  const { t } = useI18n();

  useEffect(() => {
    fixLeafletIcons();
  }, []);

  return (
    <div className="relative h-full min-h-[420px] w-full flex-1 bg-slate-950">
      <MetricBar
        activeIncidents={activeIncidents}
        riskAreaSqKm={riskAreaSqKm}
        ecosystemAlert={ecosystemAlert}
      />
      <MapContainer
        center={AKTAU_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapClickHandler onMapClick={onMapClick} />
        {epicenter && <HazardZone center={epicenter} radiusKm={radiusKm} />}
        {MAP_MARKERS.map((marker) => {
          const key = MARKER_COPY_KEY[marker.id as keyof typeof MARKER_COPY_KEY];
          const copy = t.markers[key];
          return (
            <Marker key={marker.id} position={marker.position}>
              <Popup>
                <strong>{copy.name}</strong>
                <br />
                {copy.description}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
