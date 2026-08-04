import type { IncidentConfig, IncidentType, MapMarkerDef } from "./types";

export const AKTAU_CENTER: [number, number] = [43.65, 51.15];
export const DEFAULT_ZOOM = 7;

export const DEFAULT_CONFIG: IncidentConfig = {
  type: "oil_spill",
  radiusKm: 10,
  windSpeedKmh: 15,
  windDirection: "N",
};

export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
  oil_spill: "Oil Spill",
  plastic_waste: "Plastic Waste",
  fauna_threat: "Fauna Threat (Caspian Seal)",
};

export const MAP_MARKERS: MapMarkerDef[] = [
  {
    id: "aktau-port",
    name: "Aktau Port",
    position: [43.606, 51.229],
    description: "Primary maritime logistics hub for Mangystau coastal operations.",
  },
  {
    id: "seal-habitat",
    name: "Caspian Seal Habitat",
    position: [44.0, 50.5],
    description: "Protected haul-out and foraging zone for Pusa caspica.",
  },
  {
    id: "kashagan",
    name: "Kashagan Offshore Field",
    position: [46.3, 51.9],
    description: "Major offshore hydrocarbon complex in the northern Caspian.",
  },
];

export const SEA_LEVEL_STATUS = "-28.5m";

export const WIND_DIRECTIONS = ["N", "S", "E", "W"] as const;
