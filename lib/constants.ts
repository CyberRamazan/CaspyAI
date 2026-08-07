import type { IncidentConfig } from "./types";

/** Center of the Caspian Sea — not tied to any single city */
export const CASPIAN_CENTER: [number, number] = [42.0, 52.0];
export const DEFAULT_ZOOM = 6;

export const DEFAULT_CONFIG: IncidentConfig = {
  type: "oil_spill",
  radiusKm: 10,
  windSpeedKmh: 15,
  windDirection: "N",
};

export const SEA_LEVEL_STATUS = "-28.5m";

export const WIND_DIRECTIONS = ["N", "S", "E", "W"] as const;

/** Map markers are stored in data/caspian-markers.json */
