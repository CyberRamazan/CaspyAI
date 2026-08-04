export type IncidentType = "oil_spill" | "plastic_waste" | "fauna_threat";

export type WindDirection = "N" | "S" | "E" | "W";

export type SeverityLevel = "CRITICAL HAZARD" | "HIGH ALERT" | "MODERATE RISK";

export type EcosystemAlert = "Rose" | "Amber" | "Emerald";

export interface LatLngPoint {
  lat: number;
  lng: number;
}

export interface IncidentConfig {
  type: IncidentType;
  radiusKm: number;
  windSpeedKmh: number;
  windDirection: WindDirection;
}

export interface EmergencyReport {
  severity: SeverityLevel;
  affectedAreaSqKm: number;
  operationalReport: string;
  containmentResources: string[];
  sealProtectionSteps: string[];
  ecosystemAlert: EcosystemAlert;
  generatedAt: string;
}

export interface MapMarkerDef {
  id: string;
  position: [number, number];
  name?: string;
  description?: string;
}
