"use client";

import Image from "next/image";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import IncidentConfigurator from "@/components/IncidentConfigurator";
import AIOutputCard from "@/components/AIOutputCard";
import UserProfile from "@/components/UserProfile";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { AuthUser } from "@/lib/auth/types";
import { useI18n } from "@/lib/i18n/I18nContext";
import type { EmergencyReport, IncidentConfig } from "@/lib/types";
import type { MouseEvent as ReactMouseEvent } from "react";

interface SidebarProps {
  config: IncidentConfig;
  onConfigChange: (next: IncidentConfig) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
  report: EmergencyReport | null;
  reportFallbackNotice?: string | null;
  width: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  user: AuthUser;
  onLogout: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onResizeStart?: (e: ReactMouseEvent<HTMLDivElement>) => void;
  isResizing?: boolean;
}

export default function Sidebar({
  config,
  onConfigChange,
  onGenerate,
  isGenerating,
  canGenerate,
  report,
  reportFallbackNotice = null,
  width,
  collapsed,
  onToggleCollapse,
  user,
  onLogout,
  mobileOpen,
  onMobileClose,
  onResizeStart,
  isResizing = false,
}: SidebarProps) {
  const { t } = useI18n();

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label={t.common.closeControls}
          className="fixed inset-0 z-[1150] bg-slate-950/70 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        style={collapsed ? undefined : { width }}
        className={`relative flex h-full shrink-0 flex-col border-r border-slate-800 bg-slate-950 transition-[width,transform] duration-300 ease-out max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-[1200] max-md:h-dvh max-md:w-[min(92vw,360px)] max-md:shadow-2xl ${
          mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
        } ${collapsed ? "md:w-[72px]" : ""}`}
      >
        <header className="border-b border-slate-800 px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`relative shrink-0 overflow-hidden rounded-full border border-cyan-500/20 bg-slate-900 shadow-[0_0_24px_rgba(34,211,238,0.2)] ${
                  collapsed ? "h-11 w-11 md:h-11 md:w-11" : "h-12 w-12 md:h-14 md:w-14"
                }`}
              >
                <Image
                  src="/logo.png"
                  alt="CaspyAI"
                  fill
                  sizes="56px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className={`min-w-0 ${collapsed ? "md:hidden" : ""}`}>
                <h1 className="truncate text-lg font-bold tracking-tight text-slate-100 md:text-xl">
                  Caspy<span className="text-emerald-400">AI</span>
                </h1>
                <p className="truncate text-xs text-slate-500">
                  {t.dashboard.tagline}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label={
                  collapsed ? t.common.expandSidebar : t.common.collapseSidebar
                }
                title={
                  collapsed ? t.common.expandSidebar : t.common.collapseSidebar
                }
                className="hidden h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 transition-colors hover:border-cyan-500/40 hover:text-cyan-300 md:flex"
              >
                {collapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={onMobileClose}
                aria-label={t.common.closeControls}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 md:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            className={`mt-3 flex flex-wrap items-center gap-2 ${collapsed ? "md:justify-center" : ""}`}
          >
            <div
              className={`inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 ${collapsed ? "md:hidden" : ""}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-medium text-emerald-300">
                {t.common.liveMonitoring}
              </span>
            </div>
            {collapsed && (
              <span
                className="relative hidden h-2.5 w-2.5 md:inline-flex"
                title={t.common.liveMonitoring}
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
            )}
            <LanguageSwitcher size="sm" />
          </div>
        </header>

        <div
          className={`flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4 ${collapsed ? "hidden md:hidden" : "flex"} max-md:flex`}
        >
          <IncidentConfigurator
            config={config}
            onChange={onConfigChange}
            onGenerate={onGenerate}
            isGenerating={isGenerating}
            canGenerate={canGenerate}
          />
          <AIOutputCard
            report={report}
            isGenerating={isGenerating}
            fallbackNotice={reportFallbackNotice}
          />
        </div>

        {collapsed && (
          <div className="hidden flex-1 flex-col items-center gap-3 px-2 py-4 md:flex">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-3 text-[10px] font-medium uppercase tracking-wider text-slate-400 hover:border-cyan-500/30 hover:text-cyan-300"
              style={{ writingMode: "vertical-rl" }}
            >
              {t.common.expandPanel}
            </button>
          </div>
        )}

        {/* Full profile on mobile always; collapsed rail on desktop when collapsed */}
        <div className={collapsed ? "md:hidden" : ""}>
          <UserProfile user={user} onLogout={onLogout} collapsed={false} />
        </div>
        {collapsed && (
          <div className="hidden md:block">
            <UserProfile user={user} onLogout={onLogout} collapsed />
          </div>
        )}

        {onResizeStart && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label={t.dashboard.resizeSidebar}
            onMouseDown={onResizeStart}
            onDoubleClick={onToggleCollapse}
            className={`absolute right-0 top-0 z-20 hidden h-full w-1.5 translate-x-1/2 cursor-col-resize touch-none md:block ${
              isResizing
                ? "bg-cyan-400/50"
                : "bg-transparent hover:bg-cyan-500/40"
            }`}
          >
            <div className="absolute left-1/2 top-1/2 h-10 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-600/80" />
          </div>
        )}
      </aside>
    </>
  );
}
