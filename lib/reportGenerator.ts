import { area, circle } from "@turf/turf";
import { INCIDENT_TYPE_LABELS } from "./constants";
import type {
  EcosystemAlert,
  EmergencyReport,
  IncidentConfig,
  LatLngPoint,
  SeverityLevel,
} from "./types";

function computeAffectedAreaSqKm(point: LatLngPoint, radiusKm: number): number {
  const poly = circle([point.lng, point.lat], radiusKm, {
    steps: 64,
    units: "kilometers",
  });
  return Math.round((area(poly) / 1_000_000) * 10) / 10;
}

function computeSeverity(config: IncidentConfig): SeverityLevel {
  const { type, radiusKm, windSpeedKmh } = config;
  let score = 0;

  if (type === "oil_spill") score += 3;
  else if (type === "fauna_threat") score += 2;
  else score += 1;

  if (radiusKm >= 30) score += 3;
  else if (radiusKm >= 15) score += 2;
  else if (radiusKm >= 8) score += 1;

  if (windSpeedKmh >= 40) score += 2;
  else if (windSpeedKmh >= 20) score += 1;

  if (score >= 6) return "CRITICAL HAZARD";
  if (score >= 4) return "HIGH ALERT";
  return "MODERATE RISK";
}

function ecosystemFromSeverity(severity: SeverityLevel): EcosystemAlert {
  if (severity === "CRITICAL HAZARD") return "Rose";
  if (severity === "HIGH ALERT") return "Amber";
  return "Emerald";
}

function containmentResources(config: IncidentConfig): string[] {
  const boomLength = Math.max(2, Math.round(config.radiusKm * 0.8));
  const sorbentTons = Math.max(1, Math.round(config.radiusKm * 0.35 + config.windSpeedKmh * 0.05));

  switch (config.type) {
    case "oil_spill":
      return [
        `${boomLength} km of offshore containment booms`,
        `${sorbentTons} tons of oleophilic sorbent materials`,
        "2–4 mechanical skimmer vessels (Aktau Port staging)",
        "Aerial dispersant assessment team (weather-dependent)",
        "Shoreline clean-up crews for Mangystau coastal segments",
      ];
    case "plastic_waste":
      return [
        "Surface collection nets and debris intercept barriers",
        "Harbor patrol craft for nearshore recovery lanes",
        "Waste segregation staging at Aktau Port facilities",
        "UAV survey packages for floating debris density mapping",
        "Municipal haul trucks for recovered material transport",
      ];
    case "fauna_threat":
      return [
        "Marine mammal rescue kits and thermal blankets",
        "Quiet-zone marker buoys around haul-out sites",
        "Veterinary response unit (Caspian seal specialists)",
        "Low-noise patrol craft for perimeter enforcement",
        "Satellite telemetry tags for post-incident monitoring",
      ];
  }
}

function sealProtectionSteps(config: IncidentConfig): string[] {
  const bufferKm = Math.max(3, Math.round(config.radiusKm * 0.4));
  return [
    `Establish a ${bufferKm} km no-approach buffer around known Caspian seal haul-outs.`,
    "Suspend non-essential vessel traffic through habitat corridors until containment is verified.",
    "Deploy trained observers to document strandings and coordinate with rescue teams.",
    "Redirect booming operations away from ice-edge and pupping zones when present.",
    "Notify Ministry of Ecology wildlife desk and regional DCHS marine unit within 30 minutes.",
  ];
}

function buildOperationalReport(
  config: IncidentConfig,
  point: LatLngPoint,
  severity: SeverityLevel,
  affectedAreaSqKm: number
): string {
  const typeLabel = INCIDENT_TYPE_LABELS[config.type];
  const driftNote =
    config.windSpeedKmh >= 20
      ? `Prevailing winds from the ${config.windDirection} at ${config.windSpeedKmh} km/h indicate accelerated surface drift; prioritize downwind containment corridors.`
      : `Moderate winds from the ${config.windDirection} at ${config.windSpeedKmh} km/h suggest manageable drift; maintain standard boom geometry.`;

  return [
    `EMERGENCY OPERATIONAL BRIEF — CaspyAI Automated Assessment`,
    ``,
    `To: Department of Emergency Situations (DCHS), Mangystau Region; Ministry of Ecology and Natural Resources of the Republic of Kazakhstan`,
    `Subject: ${severity} — ${typeLabel} near Aktau / Caspian coastal zone`,
    ``,
    `Incident coordinates: ${point.lat.toFixed(4)}°N, ${point.lng.toFixed(4)}°E. Estimated spread radius: ${config.radiusKm} km. Modelled affected marine/coastal area: ${affectedAreaSqKm} km².`,
    ``,
    `${driftNote} Immediate objectives: (1) confirm source and trajectory, (2) deploy containment assets from Aktau Port, (3) protect Caspian seal habitat sectors, (4) establish public safety and fisheries advisories for Mangystau coastal waters.`,
    ``,
    `Recommended command posture: activate regional incident command under DCHS with Ministry of Ecology environmental liaison. Stage logistics at Aktau Port; coordinate offshore awareness with operators near Kashagan where trajectories may intersect shipping lanes. Reassess within 2 hours as wind and sea-state update.`,
  ].join("\n");
}

export function generateEmergencyReport(
  config: IncidentConfig,
  point: LatLngPoint
): EmergencyReport {
  const severity = computeSeverity(config);
  const affectedAreaSqKm = computeAffectedAreaSqKm(point, config.radiusKm);

  return {
    severity,
    affectedAreaSqKm,
    operationalReport: buildOperationalReport(config, point, severity, affectedAreaSqKm),
    containmentResources: containmentResources(config),
    sealProtectionSteps: sealProtectionSteps(config),
    ecosystemAlert: ecosystemFromSeverity(severity),
    generatedAt: new Date().toISOString(),
  };
}

export function estimateAreaSqKm(radiusKm: number): number {
  return Math.round(Math.PI * radiusKm * radiusKm * 10) / 10;
}
