export type UserRole = "dchs_operator" | "ecology_inspector" | "guest";

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
}

export interface RoleOptionMeta {
  role: UserRole;
  badgeClass: string;
}

export const ROLE_OPTIONS: RoleOptionMeta[] = [
  {
    role: "dchs_operator",
    badgeClass:
      "border-rose-500/40 bg-rose-500/15 text-rose-300 shadow-[0_0_16px_rgba(244,63,94,0.15)]",
  },
  {
    role: "ecology_inspector",
    badgeClass:
      "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.15)]",
  },
  {
    role: "guest",
    badgeClass:
      "border-cyan-500/40 bg-cyan-500/15 text-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.15)]",
  },
];

const DEMO_NAMES: Record<UserRole, string> = {
  dchs_operator: "A. Nurbergen",
  ecology_inspector: "S. Toktarova",
  guest: "Public Viewer",
};

export function createUserForRole(role: UserRole): AuthUser {
  return {
    id: `${role}-${Date.now()}`,
    role,
    name: DEMO_NAMES[role],
  };
}

export function getRoleMeta(role: UserRole): RoleOptionMeta {
  return ROLE_OPTIONS.find((option) => option.role === role) ?? ROLE_OPTIONS[2];
}

export const AUTH_STORAGE_KEY = "caspyai-auth-user";
