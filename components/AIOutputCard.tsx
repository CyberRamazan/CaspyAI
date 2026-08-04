"use client";

import type { EmergencyReport } from "@/lib/types";
import { AlertTriangle, FileText, PawPrint, Package } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

interface AIOutputCardProps {
  report: EmergencyReport | null;
}

function severityStyles(severity: EmergencyReport["severity"]): string {
  if (severity === "CRITICAL HAZARD") {
    return "border-rose-500/50 bg-rose-500/15 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.2)]";
  }
  if (severity === "HIGH ALERT") {
    return "border-amber-500/50 bg-amber-500/15 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]";
  }
  return "border-emerald-500/50 bg-emerald-500/15 text-emerald-300";
}

export default function AIOutputCard({ report }: AIOutputCardProps) {
  const { t } = useI18n();

  if (!report) {
    return (
      <section className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-4 backdrop-blur-md">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {t.dashboard.aiOutput}
        </h2>
        <p className="text-sm leading-relaxed text-slate-500">
          {t.dashboard.aiOutputEmpty}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {t.dashboard.aiOutput}
      </h2>

      <div
        className={`mb-3 flex items-center gap-2 rounded-lg border px-3 py-2 ${severityStyles(report.severity)}`}
      >
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span className="text-sm font-bold tracking-wide">
          {t.severity[report.severity]}
        </span>
      </div>

      <div className="mb-4 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
        <p className="text-xs text-slate-500">{t.dashboard.affectedArea}</p>
        <p className="font-mono text-lg text-slate-100">
          {report.affectedAreaSqKm.toLocaleString()}{" "}
          <span className="text-sm text-slate-400">km²</span>
        </p>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
          <FileText className="h-4 w-4 text-emerald-400" />
          {t.dashboard.operationalReport}
        </div>
        <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950/70 p-3 font-sans text-xs leading-relaxed text-slate-300">
          {report.operationalReport}
        </pre>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
          <Package className="h-4 w-4 text-amber-400" />
          {t.dashboard.containmentResources}
        </div>
        <ul className="space-y-1.5">
          {report.containmentResources.map((item) => (
            <li
              key={item}
              className="rounded-md border border-slate-800/80 bg-slate-950/40 px-2.5 py-1.5 text-xs text-slate-300"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
          <PawPrint className="h-4 w-4 text-rose-400" />
          {t.dashboard.sealProtection}
        </div>
        <ul className="space-y-1.5">
          {report.sealProtectionSteps.map((step) => (
            <li
              key={step}
              className="rounded-md border border-slate-800/80 bg-slate-950/40 px-2.5 py-1.5 text-xs text-slate-300"
            >
              {step}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
