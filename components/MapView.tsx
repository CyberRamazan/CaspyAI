"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import HazardZone from "@/components/HazardZone";
import MetricBar from "@/components/MetricBar";
import { CASPIAN_CENTER, DEFAULT_ZOOM } from "@/lib/constants";
import type { DiscoveredAsset, EcosystemAlert, LatLngPoint } from "@/lib/types";

interface MapViewProps {
  epicenter: LatLngPoint | null;
  radiusKm: number;
  onMapClick: (point: LatLngPoint) => void;
  activeIncidents: number;
  riskAreaSqKm: number;
  ecosystemAlert: EcosystemAlert;
  markers?: DiscoveredAsset[];
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

function MapResizeFix() {
  const map = useMap();
  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 100);
    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [map]);
  return null;
}

function FlyToEpicenter({ epicenter }: { epicenter: LatLngPoint | null }) {
  const map = useMap();
  useEffect(() => {
    if (epicenter) {
      map.flyTo([epicenter.lat, epicenter.lng], 8, { duration: 0.8 });
    }
  }, [epicenter, map]);
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

export default function MapView({
  epicenter,
  radiusKm,
  onMapClick,
  activeIncidents,
  riskAreaSqKm,
  ecosystemAlert,
  markers = [],
}: MapViewProps) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  return (
    <div className="relative h-full min-h-0 w-full flex-1 bg-slate-950">
      <MetricBar
        activeIncidents={activeIncidents}
        riskAreaSqKm={riskAreaSqKm}
        ecosystemAlert={ecosystemAlert}
      />
      <MapContainer
        center={CASPIAN_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <ZoomControl position="bottomright" />
        <MapResizeFix />
        <FlyToEpicenter epicenter={epicenter} />
        <MapClickHandler onMapClick={onMapClick} />
        {epicenter && <HazardZone center={epicenter} radiusKm={radiusKm} />}
        {markers.map((asset) => (
          <Marker key={asset.id} position={[asset.lat, asset.lng]}>
            <Popup>
              <strong>{asset.name}</strong>
              <br />
              {asset.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
