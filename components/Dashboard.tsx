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
import Sidebar from "@/components/Sidebar";
import { DEFAULT_CONFIG } from "@/lib/constants";
import {
  estimateAreaSqKm,
  generateEmergencyReport,
} from "@/lib/reportGenerator";
import { useI18n } from "@/lib/i18n/I18nContext";
import type {
  EcosystemAlert,
  EmergencyReport,
  IncidentConfig,
  LatLngPoint,
} from "@/lib/types";
import type { AuthUser } from "@/lib/auth/types";

function MapLoadingFallback() {
  const { t } = useI18n();
  return (
    <div className="flex h-full min-h-[420px] flex-1 items-center justify-center bg-slate-950 text-sm text-slate-500">
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
const COLLAPSED_WIDTH = 72;

interface DashboardProps {
  user: AuthUser;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const { t, locale } = useI18n();
  const [config, setConfig] = useState<IncidentConfig>(DEFAULT_CONFIG);
  const [epicenter, setEpicenter] = useState<LatLngPoint | null>(null);
  const [report, setReport] = useState<EmergencyReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [collapsed, setCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(DEFAULT_SIDEBAR_WIDTH);

  const riskAreaSqKm = useMemo(() => {
    if (report) return report.affectedAreaSqKm;
    if (epicenter) return estimateAreaSqKm(config.radiusKm);
    return 0;
  }, [report, epicenter, config.radiusKm]);

  const ecosystemAlert: EcosystemAlert = report?.ecosystemAlert ?? "Amber";
  const activeIncidents = epicenter ? 1 : 0;

  const handleGenerate = useCallback(async () => {
    if (!epicenter) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const next = generateEmergencyReport(config, epicenter, t);
    setReport(next);
    setIsGenerating(false);
  }, [config, epicenter, t]);

  // Re-localize an existing report when language changes
  useEffect(() => {
    if (!epicenter || !report) return;
    setReport(generateEmergencyReport(config, epicenter, t));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only refresh copy on locale change
  }, [locale]);

  const handleMapClick = useCallback((point: LatLngPoint) => {
    setEpicenter(point);
    setReport(null);
  }, []);

  const handleConfigChange = useCallback((next: IncidentConfig) => {
    setConfig(next);
    setReport(null);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const handleResizeStart = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (collapsed) {
        setCollapsed(false);
      }
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

    const onUp = () => {
      setIsResizing(false);
    };

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

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-slate-950 text-slate-100 md:flex-row">
      <div className="relative flex max-md:w-full md:h-full">
        <Sidebar
          config={config}
          onConfigChange={handleConfigChange}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          canGenerate={epicenter !== null}
          report={report}
          width={sidebarWidth}
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
          user={user}
          onLogout={onLogout}
        />

        <div
          role="separator"
          aria-orientation="vertical"
          aria-label={t.dashboard.resizeSidebar}
          aria-valuenow={collapsed ? COLLAPSED_WIDTH : sidebarWidth}
          aria-valuemin={MIN_SIDEBAR_WIDTH}
          aria-valuemax={MAX_SIDEBAR_WIDTH}
          onMouseDown={handleResizeStart}
          onDoubleClick={handleToggleCollapse}
          className={`absolute right-0 top-0 z-20 hidden h-full w-1.5 -translate-x-1/2 cursor-col-resize touch-none md:block ${
            isResizing ? "bg-cyan-400/50" : "bg-transparent hover:bg-cyan-500/40"
          }`}
        >
          <div className="absolute left-1/2 top-1/2 h-10 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-600/80" />
        </div>
      </div>

      <MapView
        epicenter={epicenter}
        radiusKm={config.radiusKm}
        onMapClick={handleMapClick}
        activeIncidents={activeIncidents}
        riskAreaSqKm={riskAreaSqKm}
        ecosystemAlert={ecosystemAlert}
      />
    </div>
  );
}
