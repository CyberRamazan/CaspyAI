"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  Fish,
  Map,
  Radio,
  Satellite,
  Sparkles,
  Waves,
} from "lucide-react";

interface LandingPageProps {
  onLaunch: () => void;
}

const FEATURES = [
  {
    icon: Map,
    title: "Interactive GIS Threat Modeling",
    description:
      "Place spill epicenters on the Caspian map and model expanding hazard zones with wind-aware spread analysis.",
  },
  {
    icon: Sparkles,
    title: "Automated AI Emergency Briefs",
    description:
      "Generate DCHS / Ministry-ready operational reports with severity, containment resources, and response posture.",
  },
  {
    icon: Fish,
    title: "Caspian Seal Fauna Protection",
    description:
      "Protect Pusa caspica habitats with buffer guidance, quiet-zone protocols, and wildlife liaison steps.",
  },
];

const METRICS = [
  { icon: Waves, label: "50,000 km² Monitored Area" },
  { icon: Satellite, label: "Real-Time Satellite Sync" },
  { icon: Radio, label: "0.8s AI Report Generation" },
];

export default function LandingPage({ onLaunch }: LandingPageProps) {
  return (
    <div className="relative min-h-dvh overflow-y-auto bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(16,185,129,0.1),_transparent_45%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          }}
        />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-full border border-cyan-500/30 shadow-[0_0_24px_rgba(34,211,238,0.25)]">
            <Image
              src="/logo.png"
              alt="CaspyAI"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Caspy<span className="text-emerald-400">AI</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onLaunch}
          className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
        >
          Sign in
        </button>
      </header>

      <main className="relative z-10">
        <section className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-6xl flex-col justify-center px-6 pb-16 pt-6 md:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="mb-8 flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border border-cyan-500/40 shadow-[0_0_48px_rgba(34,211,238,0.35)] md:h-28 md:w-28">
                <Image
                  src="/logo.png"
                  alt="CaspyAI emblem"
                  fill
                  sizes="112px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-xs font-medium text-emerald-300">
                  Live Caspian Monitoring
                </span>
              </div>
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-slate-50 md:text-7xl">
              Caspy<span className="text-emerald-400">AI</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
              AI-Powered Ecological Intelligence & Emergency Response for the
              Caspian Sea
            </p>

            <motion.button
              type="button"
              onClick={onLaunch}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-6 py-3.5 text-base font-semibold text-cyan-200 shadow-[0_0_32px_rgba(34,211,238,0.2)] transition-colors hover:bg-cyan-500/25"
            >
              Launch Operations Center
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
            className="mt-16 grid gap-8 border-t border-slate-800/80 pt-10 md:grid-cols-3"
          >
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 + index * 0.08 }}
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-100">
                    {feature.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="border-y border-slate-800/80 bg-slate-900/40 backdrop-blur-md"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
            {METRICS.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <Icon className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="font-medium">{metric.label}</span>
                </div>
              );
            })}
          </div>
        </motion.section>

        <footer className="mx-auto w-full max-w-6xl px-6 py-8 text-xs text-slate-500">
          Caspian Sea Eco-Intelligence — Secure. Predict. Protect. · Aktau &
          Mangystau coastal operations
        </footer>
      </main>
    </div>
  );
}
