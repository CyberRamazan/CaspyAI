"use client";

import { AuthProvider } from "@/lib/auth/AuthContext";
import { I18nProvider } from "@/lib/i18n/I18nContext";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>{children}</AuthProvider>
    </I18nProvider>
  );
}
