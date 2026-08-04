"use client";

import { LogOut } from "lucide-react";
import { getRoleMeta, type AuthUser } from "@/lib/auth/types";
import { useI18n } from "@/lib/i18n/I18nContext";

interface UserProfileProps {
  user: AuthUser;
  onLogout: () => void;
  collapsed?: boolean;
}

export default function UserProfile({
  user,
  onLogout,
  collapsed = false,
}: UserProfileProps) {
  const { t } = useI18n();
  const meta = getRoleMeta(user.role);
  const roleCopy = t.auth.roles[user.role];

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 border-t border-slate-800 px-2 py-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full border text-[10px] font-bold ${meta.badgeClass}`}
          title={`${user.name} · ${roleCopy.title}`}
        >
          {user.name.charAt(0)}
        </div>
        <button
          type="button"
          onClick={onLogout}
          aria-label={t.common.logOut}
          title={t.common.logOut}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 transition-colors hover:border-rose-500/40 hover:text-rose-300"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-slate-800 p-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-md">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-100">
              {user.name}
            </p>
            <p className="truncate text-xs text-slate-500">
              {roleCopy.organization}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.badgeClass}`}
          >
            {roleCopy.badge}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400">{roleCopy.title}</p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-rose-500/40 hover:text-rose-300"
        >
          <LogOut className="h-3.5 w-3.5" />
          {t.common.logOut}
        </button>
      </div>
    </div>
  );
}
