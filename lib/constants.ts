import type { IncidentConfig, MapMarkerDef } from "./types";

export const AKTAU_CENTER: [number, number] = [43.65, 51.15];
export const DEFAULT_ZOOM = 7;

export const DEFAULT_CONFIG: IncidentConfig = {
  type: "oil_spill",
  radiusKm: 10,
  windSpeedKmh: 15,
  windDirection: "N",
};

export const MAP_MARKERS: Omit<MapMarkerDef, "name" | "description">[] = [
  {
    id: "aktau-port",
    position: [43.606, 51.229],
  },
  {
    id: "seal-habitat",
    position: [44.0, 50.5],
  },
  {
    id: "kashagan",
    position: [46.3, 51.9],
  },
];

export const SEA_LEVEL_STATUS = "-28.5m";

export const WIND_DIRECTIONS = ["N", "S", "E", "W"] as const;
