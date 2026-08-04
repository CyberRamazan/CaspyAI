import type {
  EcosystemAlert,
  IncidentType,
  SeverityLevel,
} from "@/lib/types";
import type { UserRole } from "@/lib/auth/types";

export type Locale = "en" | "ru" | "kk";

export const LOCALES: Locale[] = ["en", "ru", "kk"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  kk: "KK",
};

export const LOCALE_STORAGE_KEY = "caspyai-locale";

export interface Dictionary {
  common: {
    initializing: string;
    loadingMap: string;
    signIn: string;
    logOut: string;
    expandSidebar: string;
    collapseSidebar: string;
    expandPanel: string;
    liveMonitoring: string;
    km: string;
    kmh: string;
    sqKm: string;
  };
  landing: {
    liveBadge: string;
    subtitle: string;
    launchCta: string;
    features: {
      gis: { title: string; description: string };
      ai: { title: string; description: string };
      seal: { title: string; description: string };
    };
    metrics: {
      area: string;
      satellite: string;
      reportSpeed: string;
    };
    footer: string;
  };
  auth: {
    secureAccess: string;
    title: string;
    close: string;
    demoLogin: string;
    demoHint: string;
    roles: Record<
      UserRole,
      { title: string; subtitle: string; badge: string; organization: string }
    >;
  };
  dashboard: {
    tagline: string;
    incidentConfigurator: string;
    incidentType: string;
    spreadArea: string;
    windSpeed: string;
    windDirection: string;
    generateReport: string;
    generatingReport: string;
    mapHint: string;
    aiOutput: string;
    aiOutputEmpty: string;
    affectedArea: string;
    operationalReport: string;
    containmentResources: string;
    sealProtection: string;
    activeIncidents: string;
    riskArea: string;
    seaLevel: string;
    ecosystemAlert: string;
    resizeSidebar: string;
  };
  incidentTypes: Record<IncidentType, string>;
  severity: Record<SeverityLevel, string>;
  ecosystemAlerts: Record<EcosystemAlert, string>;
  markers: {
    aktauPort: { name: string; description: string };
    sealHabitat: { name: string; description: string };
    kashagan: { name: string; description: string };
  };
  report: {
    briefTitle: string;
    toLine: string;
    subject: (severity: string, typeLabel: string) => string;
    coordinates: (
      lat: string,
      lng: string,
      radiusKm: number,
      area: number
    ) => string;
    driftHigh: (dir: string, speed: number) => string;
    driftLow: (dir: string, speed: number) => string;
    objectives: string;
    command: string;
    resources: {
      oil: (boomKm: number, sorbentTons: number) => string[];
      plastic: string[];
      fauna: string[];
    };
    sealSteps: (bufferKm: number) => string[];
  };
}
