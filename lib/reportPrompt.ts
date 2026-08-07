import {
  findNearestRegion,
  findNearbyRegions,
  formatRegionLabel,
} from "@/lib/caspianRegions";
import { formatMarkersForPrompt } from "@/lib/markerUtils";
import type { Locale } from "@/lib/i18n/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { DiscoveredAsset, IncidentConfig, LatLngPoint, SeverityLevel } from "@/lib/types";

const LOCALE_LANGUAGE: Record<Locale, string> = {
  en: "English",
  ru: "Russian",
  kk: "Kazakh",
};

export function buildReportPrompt(
  config: IncidentConfig,
  point: LatLngPoint,
  severity: SeverityLevel,
  affectedAreaSqKm: number,
  locale: Locale,
  mapMarkers: DiscoveredAsset[]
): string {
  const language = LOCALE_LANGUAGE[locale];
  const typeLabel = getDictionary(locale).incidentTypes[config.type];
  const nearest = findNearestRegion(point);
  const regionLabel = formatRegionLabel(nearest);
  const nearbyRegions = findNearbyRegions(point, 4)
    .map((r) => `${formatRegionLabel(r)} (${r.distanceKm} km)`)
    .join("; ");

  return [
    `You are CaspyAI, an emergency ecological analyst covering the entire Caspian Sea.`,
    `Write all content in ${language}.`,
    "",
    `Epicenter: ${point.lat.toFixed(4)}°N, ${point.lng.toFixed(4)}°E`,
    `Incident: ${typeLabel} | Radius: ${config.radiusKm} km | Area: ${affectedAreaSqKm} km²`,
    `Wind: ${config.windSpeedKmh} km/h from ${config.windDirection} | Severity: ${severity}`,
    "",
    `Nearest coastal city (computed — use this, do not change): ${regionLabel} (${nearest.distanceKm} km from epicenter)`,
    `Regional authority: ${nearest.authority}`,
    `Other cities by distance: ${nearbyRegions}`,
    "",
    "Mapped assets for this area (from caspian-markers.json):",
    formatMarkersForPrompt(mapMarkers),
    "",
    "Response format:",
    `1. Write the operational brief (~150 words) directly as your message text for ${regionLabel}. Reference mapped asset distances, drift, and threatened sites.`,
    "2. Then call submit_emergency_report with:",
    "   - containmentResources: exactly 3 items for this location and incident type",
    "   - sealProtectionSteps: exactly 3 items (local marine ecology if no seals nearby)",
    "Do NOT put the operational brief in the tool — write it as plain text only.",
  ].join("\n");
}
