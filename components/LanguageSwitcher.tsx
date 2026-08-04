"use client";

import { useI18n } from "@/lib/i18n/I18nContext";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/types";

interface LanguageSwitcherProps {
  className?: string;
  size?: "sm" | "md";
}

export default function LanguageSwitcher({
  className = "",
  size = "md",
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-slate-800 bg-slate-950/70 p-0.5 ${className}`}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((code: Locale) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={`rounded-md font-semibold tracking-wide transition-colors ${
              size === "sm" ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5 text-xs"
            } ${
              active
                ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {LOCALE_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
