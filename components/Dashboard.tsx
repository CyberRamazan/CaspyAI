"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { DEFAULT_CONFIG } from "@/lib/constants";
import {
  estimateAreaSqKm,
  generateEmergencyReport,
} from "@/lib/reportGenerator";
import { mergeReportLists } from "@/lib/reportTool";
import { fetchAllMapMarkers } from "@/lib/fetchMarkers";
import { filterMarkersNear } from "@/lib/markerUtils";
import { streamEmergencyReport } from "@/lib/reportStream";
import { useI18n } from "@/lib/i18n/I18nContext";
import type {
  DiscoveredAsset,
  EcosystemAlert,
  EmergencyReport,
  IncidentConfig,
  LatLngPoint,
} from "@/lib/types";
import type { AuthUser } from "@/lib/auth/types";

function MapLoadingFallback() {
  const { t } = useI18n();
  return (
    <div className="flex h-full min-h-0 flex-1 items-center justify-center bg-slate-950 text-sm text-slate-500">
      {t.common.loadingMap}
    </div>
  );
}

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <MapLoadingFallback />,
});

const DEFAULT_SIDEBAR_WIDTH = 380;
const MIN_SIDEBAR_WIDTH = 300;
const MAX_SIDEBAR_WIDTH = 560;

interface DashboardProps {
  user: AuthUser;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const { t, locale } = useI18n();
  const [config, setConfig] = useState<IncidentConfig>(DEFAULT_CONFIG);
  const [epicenter, setEpicenter] = useState<LatLngPoint | null>(null);
  const [report, setReport] = useState<EmergencyReport | null>(null);
  const [reportFallbackNotice, setReportFallbackNotice] = useState<string | null>(
    null
  );
  const [mapMarkers, setMapMarkers] = useState<DiscoveredAsset[]>([]);
  const [allMapMarkers, setAllMapMarkers] = useState<DiscoveredAsset[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(DEFAULT_SIDEBAR_WIDTH);
  const generateAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchAllMapMarkers()
      .then(setAllMapMarkers)
      .catch(() => setAllMapMarkers([]));
  }, []);

  useEffect(() => {
    if (!epicenter) {
      setMapMarkers(allMapMarkers);
      return;
    }
    setMapMarkers(filterMarkersNear(epicenter, allMapMarkers, 150));
  }, [epicenter, allMapMarkers]);

  const riskAreaSqKm = useMemo(() => {
    if (report) return report.affectedAreaSqKm;
    if (epicenter) return estimateAreaSqKm(config.radiusKm);
    return 0;
  }, [report, epicenter, config.radiusKm]);

  const ecosystemAlert: EcosystemAlert = report?.ecosystemAlert ?? "Amber";
  const activeIncidents = epicenter ? 1 : 0;

  const handleGenerate = useCallback(async () => {
    if (!epicenter) return;

    generateAbortRef.current?.abort();
    const controller = new AbortController();
    generateAbortRef.current = controller;

    setIsGenerating(true);
    setReport(null);
    setReportFallbackNotice(null);

    try {
      await streamEmergencyReport({
        config,
        epicenter,
        locale,
        signal: controller.signal,
        onBaseline: (shell) => {
          setReport(shell);
        },
        onText: (text) => {
          setReport((prev) => (prev ? { ...prev, operationalReport: text } : prev));
        },
        onLists: (partial) => {
          setReport((prev) => (prev ? mergeReportLists(prev, partial) : prev));
        },
        onComplete: (next) => {
          setReport(next);
        },
      });
      setMobileOpen(false);
    } catch (error) {
      if (controller.signal.aborted) return;
      setReport(generateEmergencyReport(config, epicenter, t));
      const detail =
        error instanceof Error ? error.message : t.dashboard.reportFallbackNotice;
      setReportFallbackNotice(
        detail.includes("ANTHROPIC_API_KEY")
          ? t.dashboard.reportFallbackNotice
          : `${t.dashboard.reportFallbackNotice} ${detail}`
      );
    } finally {
      if (generateAbortRef.current === controller) {
        generateAbortRef.current = null;
      }
      setIsGenerating(false);
    }
  }, [config, epicenter, locale, t]);

  useEffect(() => {
    return () => {
      generateAbortRef.current?.abort();
    };
  }, []);

  const handleMapClick = useCallback((point: LatLngPoint) => {
    generateAbortRef.current?.abort();
    setEpicenter(point);
    setReport(null);
    setReportFallbackNotice(null);
  }, []);

  const handleConfigChange = useCallback((next: IncidentConfig) => {
    generateAbortRef.current?.abort();
    setConfig(next);
    setReport(null);
    setReportFallbackNotice(null);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const handleResizeStart = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (collapsed) setCollapsed(false);
      setIsResizing(true);
      dragStartX.current = e.clientX;
      dragStartWidth.current = collapsed ? DEFAULT_SIDEBAR_WIDTH : sidebarWidth;
    },
    [collapsed, sidebarWidth]
  );

  useEffect(() => {
    if (!isResizing) return;

    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - dragStartX.current;
      const next = Math.min(
        MAX_SIDEBAR_WIDTH,
        Math.max(MIN_SIDEBAR_WIDTH, dragStartWidth.current + delta)
      );
      setSidebarWidth(next);
      if (collapsed) setCollapsed(false);
    };

    const onUp = () => setIsResizing(false);

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isResizing, collapsed]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-slate-950 text-slate-100 md:flex-row">
      <div className="z-[1100] flex shrink-0 items-center justify-between gap-2 border-b border-slate-800 bg-slate-950/95 px-3 py-2 backdrop-blur-md md:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-cyan-500/30">
            <Image
              src="/logo.png"
              alt="CaspyAI"
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              Caspy<span className="text-emerald-400">AI</span>
            </p>
            <p className="truncate text-[10px] text-slate-500">
              {t.dashboard.tagline}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher size="sm" />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-2.5 py-1.5 text-xs font-semibold text-cyan-200"
          >
            <Menu className="h-4 w-4" />
            {t.common.openControls}
          </button>
        </div>
      </div>

      <Sidebar
        config={config}
        onConfigChange={handleConfigChange}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        canGenerate={epicenter !== null}
        report={report}
        reportFallbackNotice={reportFallbackNotice}
        width={sidebarWidth}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        user={user}
        onLogout={onLogout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onResizeStart={handleResizeStart}
        isResizing={isResizing}
      />

      <div className="relative min-h-0 min-w-0 flex-1">
        <MapView
          epicenter={epicenter}
          radiusKm={config.radiusKm}
          onMapClick={handleMapClick}
          activeIncidents={activeIncidents}
          riskAreaSqKm={riskAreaSqKm}
          ecosystemAlert={ecosystemAlert}
          markers={mapMarkers}
        />
      </div>
    </div>
  );
}
