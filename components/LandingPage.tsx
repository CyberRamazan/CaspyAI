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
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/I18nContext";

interface LandingPageProps {
  onLaunch: () => void;
}

export default function LandingPage({ onLaunch }: LandingPageProps) {
  const { t } = useI18n();

  const features = [
    {
      icon: Map,
      title: t.landing.features.gis.title,
      description: t.landing.features.gis.description,
    },
    {
      icon: Sparkles,
      title: t.landing.features.ai.title,
      description: t.landing.features.ai.description,
    },
    {
      icon: Fish,
      title: t.landing.features.seal.title,
      description: t.landing.features.seal.description,
    },
  ];

  const metrics = [
    { icon: Waves, label: t.landing.metrics.area },
    { icon: Satellite, label: t.landing.metrics.satellite },
    { icon: Radio, label: t.landing.metrics.reportSpeed },
  ];

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

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-4 sm:gap-3 sm:px-6 sm:py-5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-cyan-500/30 shadow-[0_0_24px_rgba(34,211,238,0.25)] sm:h-11 sm:w-11">
            <Image
              src="/logo.png"
              alt="CaspyAI"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </div>
          <span className="truncate text-base font-semibold tracking-tight sm:text-lg">
            Caspy<span className="text-emerald-400">AI</span>
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher size="sm" />
          <button
            type="button"
            onClick={onLaunch}
            className="rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-300 sm:px-3 sm:text-sm"
          >
            {t.common.signIn}
          </button>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto flex min-h-[calc(100dvh-4.5rem)] w-full max-w-6xl flex-col justify-center px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-6 md:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="mb-6 flex flex-wrap items-center gap-3 sm:mb-8 sm:gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-cyan-500/40 shadow-[0_0_48px_rgba(34,211,238,0.35)] sm:h-24 sm:w-24 md:h-28 md:w-28">
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
                  {t.landing.liveBadge}
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl md:text-7xl">
              Caspy<span className="text-emerald-400">AI</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:mt-5 sm:text-lg md:text-xl">
              {t.landing.subtitle}
            </p>

            <motion.button
              type="button"
              onClick={onLaunch}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-5 py-3.5 text-sm font-semibold text-cyan-200 shadow-[0_0_32px_rgba(34,211,238,0.2)] transition-colors hover:bg-cyan-500/25 sm:mt-8 sm:w-auto sm:px-6 sm:text-base"
            >
              {t.landing.launchCta}
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
            className="mt-12 grid gap-6 border-t border-slate-800/80 pt-8 sm:mt-16 sm:gap-8 sm:pt-10 md:grid-cols-3"
          >
            {features.map((feature, index) => {
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
            {metrics.map((metric) => {
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
          {t.landing.footer}
        </footer>
      </main>
    </div>
  );
}
