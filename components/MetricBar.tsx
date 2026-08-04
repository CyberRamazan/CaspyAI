"use client";

import { Activity, AlertCircle, Waves, Hexagon } from "lucide-react";
import type { EcosystemAlert } from "@/lib/types";
import { SEA_LEVEL_STATUS } from "@/lib/constants";

interface MetricBarProps {
  activeIncidents: number;
  riskAreaSqKm: number;
  ecosystemAlert: EcosystemAlert;
}

function alertColor(alert: EcosystemAlert): string {
  if (alert === "Rose") return "text-rose-300 border-rose-500/40 shadow-[0_0_16px_rgba(244,63,94,0.2)]";
  if (alert === "Amber") return "text-amber-300 border-amber-500/40 shadow-[0_0_16px_rgba(245,158,11,0.2)]";
  return "text-emerald-300 border-emerald-500/40";
}

export default function MetricBar({
  activeIncidents,
  riskAreaSqKm,
  ecosystemAlert,
}: MetricBarProps) {
  const metrics = [
    {
      key: "incidents",
      icon: Activity,
      iconClass: "text-emerald-400",
      text: `Active Incidents: ${activeIncidents}`,
      cardClass: "border-slate-800/90",
    },
    {
      key: "risk",
      icon: Hexagon,
      iconClass: "text-amber-400",
      text: `Risk Area: ${riskAreaSqKm.toLocaleString()} sq km`,
      cardClass: "border-slate-800/90",
    },
    {
      key: "sea",
      icon: Waves,
      iconClass: "text-sky-400",
      text: `Sea Level Status: ${SEA_LEVEL_STATUS}`,
      cardClass: "border-slate-800/90",
    },
    {
      key: "alert",
      icon: AlertCircle,
      iconClass: "",
      text: `Ecosystem Alert: ${ecosystemAlert}`,
      cardClass: alertColor(ecosystemAlert),
    },
  ];

  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 z-[1000] p-3 md:p-4">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.key}
              className={`pointer-events-auto flex items-center gap-2 rounded-xl border bg-slate-950/75 px-3 py-2.5 backdrop-blur-md ${metric.cardClass}`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${metric.iconClass}`} />
              <p className="text-xs font-semibold leading-snug text-slate-100 md:text-sm">
                {metric.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
