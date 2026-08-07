import { area, circle } from "@turf/turf";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  findNearestRegion,
  formatRegionLabel,
} from "@/lib/caspianRegions";
import type { Dictionary } from "@/lib/i18n/types";
import type {
  EcosystemAlert,
  EmergencyReport,
  IncidentConfig,
  LatLngPoint,
  SeverityLevel,
} from "./types";

export function computeAffectedAreaSqKm(
  point: LatLngPoint,
  radiusKm: number
): number {
  const poly = circle([point.lng, point.lat], radiusKm, {
    steps: 64,
    units: "kilometers",
  });
  return Math.round((area(poly) / 1_000_000) * 10) / 10;
}

export function computeSeverity(config: IncidentConfig): SeverityLevel {
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

export function ecosystemFromSeverity(
  severity: SeverityLevel
): EcosystemAlert {
  if (severity === "CRITICAL HAZARD") return "Rose";
  if (severity === "HIGH ALERT") return "Amber";
  return "Emerald";
}

function containmentResources(
  config: IncidentConfig,
  copy: Dictionary["report"]
): string[] {
  const boomLength = Math.max(2, Math.round(config.radiusKm * 0.8));
  const sorbentTons = Math.max(
    1,
    Math.round(config.radiusKm * 0.35 + config.windSpeedKmh * 0.05)
  );

  switch (config.type) {
    case "oil_spill":
      return copy.resources.oil(boomLength, sorbentTons);
    case "plastic_waste":
      return copy.resources.plastic;
    case "fauna_threat":
      return copy.resources.fauna;
  }
}

function sealProtectionSteps(
  config: IncidentConfig,
  copy: Dictionary["report"]
): string[] {
  const bufferKm = Math.max(3, Math.round(config.radiusKm * 0.4));
  return copy.sealSteps(bufferKm);
}

function buildOperationalReport(
  config: IncidentConfig,
  point: LatLngPoint,
  severity: SeverityLevel,
  affectedAreaSqKm: number,
  t: Dictionary
): string {
  const typeLabel = t.incidentTypes[config.type];
  const severityLabel = t.severity[severity];
  const driftNote =
    config.windSpeedKmh >= 20
      ? t.report.driftHigh(config.windDirection, config.windSpeedKmh)
      : t.report.driftLow(config.windDirection, config.windSpeedKmh);

  return [
    t.report.briefTitle,
    "",
    t.report.toLine,
    t.report.subject(
      severityLabel,
      typeLabel,
      point.lat.toFixed(4),
      point.lng.toFixed(4)
    ),
    "",
    t.report.coordinates(
      point.lat.toFixed(4),
      point.lng.toFixed(4),
      config.radiusKm,
      affectedAreaSqKm
    ),
    "",
    `${driftNote} ${t.report.objectives}`,
    "",
    t.report.command,
  ].join("\n");
}

export function generateEmergencyReport(
  config: IncidentConfig,
  point: LatLngPoint,
  t: Dictionary
): EmergencyReport {
  const severity = computeSeverity(config);
  const affectedAreaSqKm = computeAffectedAreaSqKm(point, config.radiusKm);
  const regionName = formatRegionLabel(findNearestRegion(point));

  return {
    severity,
    affectedAreaSqKm,
    regionName,
    operationalReport: buildOperationalReport(
      config,
      point,
      severity,
      affectedAreaSqKm,
      t
    ),
    containmentResources: containmentResources(config, t.report),
    sealProtectionSteps: sealProtectionSteps(config, t.report),
    ecosystemAlert: ecosystemFromSeverity(severity),
    generatedAt: new Date().toISOString(),
    source: "template",
  };
}

export function estimateAreaSqKm(radiusKm: number): number {
  return Math.round(Math.PI * radiusKm * radiusKm * 10) / 10;
}

export function buildReportBaseline(
  config: IncidentConfig,
  point: LatLngPoint
): Pick<
  EmergencyReport,
  "severity" | "affectedAreaSqKm" | "ecosystemAlert" | "generatedAt"
> {
  const severity = computeSeverity(config);
  return {
    severity,
    affectedAreaSqKm: computeAffectedAreaSqKm(point, config.radiusKm),
    ecosystemAlert: ecosystemFromSeverity(severity),
    generatedAt: new Date().toISOString(),
  };
}

export function buildReportShell(
  config: IncidentConfig,
  point: LatLngPoint
): EmergencyReport {
  const regionName = formatRegionLabel(findNearestRegion(point));
  return {
    ...buildReportBaseline(config, point),
    regionName,
    operationalReport: "",
    containmentResources: [],
    sealProtectionSteps: [],
    source: "ai",
  };
}
