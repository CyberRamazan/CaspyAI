import type { Dictionary } from "@/lib/i18n/types";

export const en: Dictionary = {
  common: {
    initializing: "Initializing CaspyAI…",
    loadingMap: "Loading Caspian operations map…",
    signIn: "Sign in",
    logOut: "Log Out",
    expandSidebar: "Expand sidebar",
    collapseSidebar: "Collapse sidebar",
    expandPanel: "Expand Panel",
    openControls: "Controls",
    closeControls: "Close",
    liveMonitoring: "Live Monitoring Active",
    km: "km",
    kmh: "km/h",
    sqKm: "sq km",
  },
  landing: {
    liveBadge: "Live Caspian Monitoring",
    subtitle:
      "AI-Powered Ecological Intelligence & Emergency Response for the Caspian Sea",
    launchCta: "Launch Operations Center",
    features: {
      gis: {
        title: "Interactive GIS Threat Modeling",
        description:
          "Place spill epicenters on the Caspian map and model expanding hazard zones with wind-aware spread analysis.",
      },
      ai: {
        title: "Automated AI Emergency Briefs",
        description:
          "Generate DCHS / Ministry-ready operational reports with severity, containment resources, and response posture.",
      },
      seal: {
        title: "Caspian Seal Fauna Protection",
        description:
          "Protect Pusa caspica habitats with buffer guidance, quiet-zone protocols, and wildlife liaison steps.",
      },
    },
    metrics: {
      area: "50,000 km² Monitored Area",
      satellite: "Real-Time Satellite Sync",
      reportSpeed: "0.8s AI Report Generation",
    },
    footer:
      "Caspian Sea Eco-Intelligence — Secure. Predict. Protect. · Aktau & Mangystau coastal operations",
  },
  auth: {
    secureAccess: "Secure Access",
    title: "Select Operational Role",
    close: "Close authentication modal",
    demoLogin: "One-Click Demo Login",
    demoHint: "Instant DCHS Operator access for pitches and walkthroughs.",
    roles: {
      dchs_operator: {
        title: "DCHS Operator",
        subtitle: "Emergency Services — Mangystau Regional Command",
        badge: "DCHS",
        organization: "DCHS Mangystau",
      },
      ecology_inspector: {
        title: "Ministry of Ecology Inspector",
        subtitle: "Environmental oversight & habitat compliance",
        badge: "Ecology",
        organization: "Ministry of Ecology",
      },
      guest: {
        title: "Guest / Public Viewer",
        subtitle: "Read-oriented briefing access for observers",
        badge: "Guest",
        organization: "CaspyAI Open Access",
      },
    },
  },
  dashboard: {
    tagline: "Caspian Ecological Response",
    incidentConfigurator: "Incident Configurator",
    incidentType: "Incident Type",
    spreadArea: "Spread Area (km)",
    windSpeed: "Wind Speed (km/h)",
    windDirection: "Wind Direction",
    generateReport: "Generate Emergency AI Report",
    generatingReport: "Generating Report…",
    mapHint: "Click the map to set the incident epicenter first.",
    aiOutput: "AI Output",
    aiOutputEmpty:
      "Configure the incident, place an epicenter on the map, then generate an emergency AI report for DCHS and Ministry of Ecology response teams.",
    affectedArea: "Affected Area",
    operationalReport: "Operational Report",
    containmentResources: "Containment Resources",
    sealProtection: "Caspian Seal Protection",
    activeIncidents: "Active Incidents",
    riskArea: "Risk Area",
    seaLevel: "Sea Level Status",
    ecosystemAlert: "Ecosystem Alert",
    resizeSidebar: "Resize sidebar",
    aiGenerated: "Claude analysis",
    templateFallback: "Template fallback",
    aiAnalyzing: "Identifying nearby ports, infrastructure, and habitats for this location…",
    reportFallbackNotice:
      "AI unavailable — showing template report.",
    detectedRegion: "Detected region",
  },
  incidentTypes: {
    oil_spill: "Oil Spill",
    plastic_waste: "Plastic Waste",
    fauna_threat: "Fauna Threat (Caspian Seal)",
  },
  severity: {
    "CRITICAL HAZARD": "CRITICAL HAZARD",
    "HIGH ALERT": "HIGH ALERT",
    "MODERATE RISK": "MODERATE RISK",
  },
  ecosystemAlerts: {
    Rose: "Rose",
    Amber: "Amber",
    Emerald: "Emerald",
  },
  markers: {
    aktauPort: {
      name: "Aktau Port",
      description:
        "Primary maritime logistics hub for Mangystau coastal operations.",
    },
    sealHabitat: {
      name: "Caspian Seal Habitat",
      description: "Protected haul-out and foraging zone for Pusa caspica.",
    },
    kashagan: {
      name: "Kashagan Offshore Field",
      description:
        "Major offshore hydrocarbon complex in the northern Caspian.",
    },
  },
  report: {
    briefTitle: "EMERGENCY OPERATIONAL BRIEF — CaspyAI Automated Assessment",
    toLine:
      "To: Regional Department of Emergency Situations (DCHS); Ministry of Ecology and Natural Resources of the Republic of Kazakhstan",
    subject: (severity, typeLabel, lat, lng) =>
      `Subject: ${severity} — ${typeLabel} at ${lat}°N, ${lng}°E (Caspian Sea)`,
    coordinates: (lat, lng, radiusKm, area) =>
      `Incident coordinates: ${lat}°N, ${lng}°E. Estimated spread radius: ${radiusKm} km. Modelled affected marine/coastal area: ${area} km².`,
    driftHigh: (dir, speed) =>
      `Prevailing winds from the ${dir} at ${speed} km/h indicate accelerated surface drift; prioritize downwind containment corridors.`,
    driftLow: (dir, speed) =>
      `Moderate winds from the ${dir} at ${speed} km/h suggest manageable drift; maintain standard boom geometry.`,
    objectives:
      "Immediate objectives: (1) confirm source and trajectory, (2) deploy containment assets from the nearest port, (3) protect threatened habitats and coastal communities, (4) establish public safety and fisheries advisories for affected waters.",
    command:
      "Recommended command posture: activate regional incident command under local DCHS with Ministry of Ecology environmental liaison. Stage logistics at the nearest port; coordinate with nearby offshore operators where trajectories may intersect shipping lanes. Reassess within 2 hours as wind and sea-state update.",
    resources: {
      oil: (boomKm, sorbentTons) => [
        `${boomKm} km of offshore containment booms`,
        `${sorbentTons} tons of oleophilic sorbent materials`,
        "2–4 mechanical skimmer vessels (Aktau Port staging)",
        "Aerial dispersant assessment team (weather-dependent)",
        "Shoreline clean-up crews for Mangystau coastal segments",
      ],
      plastic: [
        "Surface collection nets and debris intercept barriers",
        "Harbor patrol craft for nearshore recovery lanes",
        "Waste segregation staging at Aktau Port facilities",
        "UAV survey packages for floating debris density mapping",
        "Municipal haul trucks for recovered material transport",
      ],
      fauna: [
        "Marine mammal rescue kits and thermal blankets",
        "Quiet-zone marker buoys around haul-out sites",
        "Veterinary response unit (Caspian seal specialists)",
        "Low-noise patrol craft for perimeter enforcement",
        "Satellite telemetry tags for post-incident monitoring",
      ],
    },
    sealSteps: (bufferKm) => [
      `Establish a ${bufferKm} km no-approach buffer around known Caspian seal haul-outs.`,
      "Suspend non-essential vessel traffic through habitat corridors until containment is verified.",
      "Deploy trained observers to document strandings and coordinate with rescue teams.",
      "Redirect booming operations away from ice-edge and pupping zones when present.",
      "Notify Ministry of Ecology wildlife desk and regional DCHS marine unit within 30 minutes.",
    ],
  },
};
