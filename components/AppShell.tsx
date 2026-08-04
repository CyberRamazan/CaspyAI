"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "@/components/LandingPage";
import AuthModal from "@/components/AuthModal";
import Dashboard from "@/components/Dashboard";
import { useAuth } from "@/lib/auth/AuthContext";
import { useI18n } from "@/lib/i18n/I18nContext";
import type { UserRole } from "@/lib/auth/types";

export default function AppShell() {
  const { user, isAuthenticated, isHydrated, login, demoLogin, logout } =
    useAuth();
  const { t, isHydrated: i18nHydrated } = useI18n();
  const [authOpen, setAuthOpen] = useState(false);

  const handleLaunch = () => {
    setAuthOpen(true);
  };

  const handleSelectRole = (role: UserRole) => {
    login(role);
    setAuthOpen(false);
  };

  const handleDemoLogin = () => {
    demoLogin();
    setAuthOpen(false);
  };

  const handleLogout = () => {
    logout();
    setAuthOpen(false);
  };

  if (!isHydrated || !i18nHydrated) {
    return (
      <div className="flex h-dvh items-center justify-center bg-slate-950 text-sm text-slate-500">
        {t.common.initializing}
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isAuthenticated && user ? (
          <motion.div
            key="dashboard"
            className="h-dvh"
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Dashboard user={user} onLogout={handleLogout} />
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <LandingPage onLaunch={handleLaunch} />
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        open={authOpen && !isAuthenticated}
        onClose={() => setAuthOpen(false)}
        onSelectRole={handleSelectRole}
        onDemoLogin={handleDemoLogin}
      />
    </>
  );
}
