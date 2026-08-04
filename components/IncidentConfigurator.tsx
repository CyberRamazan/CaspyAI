"use client";

import type { IncidentConfig, IncidentType, WindDirection } from "@/lib/types";
import { INCIDENT_TYPE_LABELS, WIND_DIRECTIONS } from "@/lib/constants";
import { Loader2, Sparkles } from "lucide-react";

interface IncidentConfiguratorProps {
  config: IncidentConfig;
  onChange: (next: IncidentConfig) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
}

const INCIDENT_TYPES: IncidentType[] = [
  "oil_spill",
  "plastic_waste",
  "fauna_threat",
];

export default function IncidentConfigurator({
  config,
  onChange,
  onGenerate,
  isGenerating,
  canGenerate,
}: IncidentConfiguratorProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Incident Configurator
      </h2>

      <div className="mb-4 space-y-2">
        <p className="text-sm text-slate-300">Incident Type</p>
        <div className="flex flex-col gap-2">
          {INCIDENT_TYPES.map((type) => {
            const selected = config.type === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ ...config, type })}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  selected
                    ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                    : "border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                {INCIDENT_TYPE_LABELS[type]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="radius-slider" className="text-sm text-slate-300">
            Spread Area (km)
          </label>
          <span className="rounded-md border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-xs text-amber-300">
            {config.radiusKm} km
          </span>
        </div>
        <input
          id="radius-slider"
          type="range"
          min={1}
          max={50}
          step={1}
          value={config.radiusKm}
          onChange={(e) =>
            onChange({ ...config, radiusKm: Number(e.target.value) })
          }
          className="w-full accent-emerald-500"
        />
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="wind-speed" className="text-sm text-slate-300">
            Wind Speed (km/h)
          </label>
          <span className="rounded-md border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-xs text-slate-200">
            {config.windSpeedKmh} km/h
          </span>
        </div>
        <input
          id="wind-speed"
          type="range"
          min={0}
          max={80}
          step={1}
          value={config.windSpeedKmh}
          onChange={(e) =>
            onChange({ ...config, windSpeedKmh: Number(e.target.value) })
          }
          className="w-full accent-amber-500"
        />
      </div>

      <div className="mb-5">
        <p className="mb-2 text-sm text-slate-300">Wind Direction</p>
        <div className="grid grid-cols-4 gap-2">
          {WIND_DIRECTIONS.map((dir) => {
            const selected = config.windDirection === dir;
            return (
              <button
                key={dir}
                type="button"
                onClick={() =>
                  onChange({
                    ...config,
                    windDirection: dir as WindDirection,
                  })
                }
                className={`rounded-lg border py-2 text-sm font-medium transition-colors ${
                  selected
                    ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                    : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700"
                }`}
              >
                {dir}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={!canGenerate || isGenerating}
        aria-busy={isGenerating}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500/25 hover:shadow-[0_0_24px_rgba(16,185,129,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating Report…
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate Emergency AI Report
          </>
        )}
      </button>
      {!canGenerate && (
        <p className="mt-2 text-center text-xs text-slate-500">
          Click the map to set the incident epicenter first.
        </p>
      )}
    </section>
  );
}
