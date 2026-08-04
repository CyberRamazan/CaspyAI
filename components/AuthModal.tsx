"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Shield, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { ROLE_OPTIONS, type UserRole } from "@/lib/auth/types";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
  onDemoLogin: () => void;
}

export default function AuthModal({
  open,
  onClose,
  onSelectRole,
  onDemoLogin,
}: AuthModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close authentication modal"
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 shadow-[0_0_60px_rgba(34,211,238,0.12)]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cyan-500/10 to-transparent" />

            <div className="relative border-b border-slate-800 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                    <Image
                      src="/logo.png"
                      alt="CaspyAI"
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-400/80">
                      Secure Access
                    </p>
                    <h2
                      id="auth-modal-title"
                      className="text-lg font-semibold text-slate-100"
                    >
                      Select Operational Role
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-slate-800 p-1.5 text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 p-5">
              {ROLE_OPTIONS.map((option) => (
                <button
                  key={option.role}
                  type="button"
                  onClick={() => onSelectRole(option.role)}
                  className="group flex w-full items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-left transition-all hover:border-cyan-500/40 hover:bg-slate-900 hover:shadow-[0_0_24px_rgba(34,211,238,0.1)]"
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-cyan-300 transition-colors group-hover:border-cyan-500/40">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-slate-100">
                        {option.title}
                      </span>
                      <span
                        className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${option.badgeClass}`}
                      >
                        {option.badge}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-400">
                      {option.subtitle}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-slate-800 p-5">
              <button
                type="button"
                onClick={onDemoLogin}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500/25 hover:shadow-[0_0_28px_rgba(16,185,129,0.25)]"
              >
                <Sparkles className="h-4 w-4" />
                One-Click Demo Login
              </button>
              <p className="mt-2 text-center text-xs text-slate-500">
                Instant DCHS Operator access for pitches and walkthroughs.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
