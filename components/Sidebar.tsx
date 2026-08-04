"use client";

import Image from "next/image";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import IncidentConfigurator from "@/components/IncidentConfigurator";
import AIOutputCard from "@/components/AIOutputCard";
import type { EmergencyReport, IncidentConfig } from "@/lib/types";

interface SidebarProps {
  config: IncidentConfig;
  onConfigChange: (next: IncidentConfig) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
  report: EmergencyReport | null;
  width: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  config,
  onConfigChange,
  onGenerate,
  isGenerating,
  canGenerate,
  report,
  width,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <aside
      style={{ width: collapsed ? undefined : width }}
      className={`relative flex h-full shrink-0 flex-col border-r border-slate-800 bg-slate-950 transition-[width] duration-200 ease-out ${
        collapsed ? "w-[72px]" : ""
      } max-md:w-full max-md:max-h-[45vh]`}
    >
      <header
        className={`border-b border-slate-800 ${collapsed ? "px-2 py-3" : "px-4 py-3"}`}
      >
        <div
          className={`flex ${collapsed ? "flex-col items-center gap-3" : "items-start justify-between gap-2"}`}
        >
          <div
            className={`flex ${collapsed ? "flex-col items-center" : "items-center gap-3"} min-w-0`}
          >
            <div
              className={`relative shrink-0 overflow-hidden rounded-full border border-cyan-500/20 bg-slate-900 shadow-[0_0_24px_rgba(34,211,238,0.2)] ${
                collapsed ? "h-11 w-11" : "h-14 w-14"
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
            {!collapsed && (
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold tracking-tight text-slate-100">
                  Caspy<span className="text-emerald-400">AI</span>
                </h1>
                <p className="truncate text-xs text-slate-500">
                  Caspian Ecological Response
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand menu" : "Collapse menu"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 transition-colors hover:border-cyan-500/40 hover:text-cyan-300 max-md:hidden"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        {!collapsed && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-medium text-emerald-300">
              Live Monitoring Active
            </span>
          </div>
        )}

        {collapsed && (
          <div className="mt-3 flex justify-center" title="Live Monitoring Active">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
          </div>
        )}
      </header>

      {!collapsed && (
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <IncidentConfigurator
            config={config}
            onChange={onConfigChange}
            onGenerate={onGenerate}
            isGenerating={isGenerating}
            canGenerate={canGenerate}
          />
          <AIOutputCard report={report} />
        </div>
      )}

      {collapsed && (
        <div className="flex flex-1 flex-col items-center gap-3 px-2 py-4">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-3 text-[10px] font-medium uppercase tracking-wider text-slate-400 hover:border-cyan-500/30 hover:text-cyan-300"
            style={{ writingMode: "vertical-rl" }}
          >
            Expand Panel
          </button>
        </div>
      )}
    </aside>
  );
}
