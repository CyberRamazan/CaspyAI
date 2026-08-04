export type UserRole =
  | "dchs_operator"
  | "ecology_inspector"
  | "guest";

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  organization: string;
}

export interface RoleOption {
  role: UserRole;
  title: string;
  subtitle: string;
  badge: string;
  badgeClass: string;
}

export const ROLE_OPTIONS: RoleOption[] = [
  {
    role: "dchs_operator",
    title: "DCHS Operator",
    subtitle: "Emergency Services — Mangystau Regional Command",
    badge: "DCHS",
    badgeClass:
      "border-rose-500/40 bg-rose-500/15 text-rose-300 shadow-[0_0_16px_rgba(244,63,94,0.15)]",
  },
  {
    role: "ecology_inspector",
    title: "Ministry of Ecology Inspector",
    subtitle: "Environmental oversight & habitat compliance",
    badge: "Ecology",
    badgeClass:
      "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.15)]",
  },
  {
    role: "guest",
    title: "Guest / Public Viewer",
    subtitle: "Read-oriented briefing access for observers",
    badge: "Guest",
    badgeClass:
      "border-cyan-500/40 bg-cyan-500/15 text-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.15)]",
  },
];

const DEMO_PROFILES: Record<UserRole, Omit<AuthUser, "id" | "role">> = {
  dchs_operator: {
    name: "A. Nurbergen",
    organization: "DCHS Mangystau",
  },
  ecology_inspector: {
    name: "S. Toktarova",
    organization: "Ministry of Ecology",
  },
  guest: {
    name: "Public Viewer",
    organization: "CaspyAI Open Access",
  },
};

export function createUserForRole(role: UserRole): AuthUser {
  const profile = DEMO_PROFILES[role];
  return {
    id: `${role}-${Date.now()}`,
    role,
    name: profile.name,
    organization: profile.organization,
  };
}

export function getRoleOption(role: UserRole): RoleOption {
  return ROLE_OPTIONS.find((option) => option.role === role) ?? ROLE_OPTIONS[2];
}

export const AUTH_STORAGE_KEY = "caspyai-auth-user";
