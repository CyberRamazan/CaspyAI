"use client";

import { Activity, AlertCircle, Waves, Hexagon } from "lucide-react";
import type { EcosystemAlert } from "@/lib/types";
import { SEA_LEVEL_STATUS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/I18nContext";

interface MetricBarProps {
  activeIncidents: number;
  riskAreaSqKm: number;
  ecosystemAlert: EcosystemAlert;
}

function alertColor(alert: EcosystemAlert): string {
  if (alert === "Rose")
    return "text-rose-300 border-rose-500/40 shadow-[0_0_16px_rgba(244,63,94,0.2)]";
  if (alert === "Amber")
    return "text-amber-300 border-amber-500/40 shadow-[0_0_16px_rgba(245,158,11,0.2)]";
  return "text-emerald-300 border-emerald-500/40";
}

export default function MetricBar({
  activeIncidents,
  riskAreaSqKm,
  ecosystemAlert,
}: MetricBarProps) {
  const { t } = useI18n();

  const metrics = [
    {
      key: "incidents",
      icon: Activity,
      iconClass: "text-emerald-400",
      label: t.dashboard.activeIncidents,
      value: String(activeIncidents),
      cardClass: "border-slate-800/90",
    },
    {
      key: "risk",
      icon: Hexagon,
      iconClass: "text-amber-400",
      label: t.dashboard.riskArea,
      value: `${riskAreaSqKm.toLocaleString()} ${t.common.sqKm}`,
      cardClass: "border-slate-800/90",
    },
    {
      key: "sea",
      icon: Waves,
      iconClass: "text-sky-400",
      label: t.dashboard.seaLevel,
      value: SEA_LEVEL_STATUS,
      cardClass: "border-slate-800/90",
    },
    {
      key: "alert",
      icon: AlertCircle,
      iconClass: "",
      label: t.dashboard.ecosystemAlert,
      value: t.ecosystemAlerts[ecosystemAlert],
      cardClass: alertColor(ecosystemAlert),
    },
  ];

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] px-2 pt-2 md:p-4">
      {/* Mobile: horizontal scroll chips */}
      <div className="pointer-events-auto -mx-2 flex gap-2 overflow-x-auto px-2 pb-1 scrollbar-none md:hidden">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.key}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg border bg-slate-950/85 px-2.5 py-1.5 backdrop-blur-md ${metric.cardClass}`}
            >
              <Icon className={`h-3.5 w-3.5 shrink-0 ${metric.iconClass}`} />
              <div className="leading-tight">
                <p className="text-[9px] uppercase tracking-wide text-slate-500">
                  {metric.label}
                </p>
                <p className="whitespace-nowrap text-[11px] font-semibold text-slate-100">
                  {metric.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: 4-column grid */}
      <div className="mx-auto hidden max-w-5xl grid-cols-4 gap-3 md:grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.key}
              className={`pointer-events-auto flex items-center gap-2 rounded-xl border bg-slate-950/75 px-3 py-2.5 backdrop-blur-md ${metric.cardClass}`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${metric.iconClass}`} />
              <p className="text-sm font-semibold leading-snug text-slate-100">
                {metric.label}: {metric.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
