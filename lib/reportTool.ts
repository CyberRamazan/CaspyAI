import type { EmergencyReport } from "@/lib/types";

export const REPORT_TOOL_NAME = "submit_emergency_report";

export interface ReportListsInput {
  containmentResources: string[];
  sealProtectionSteps: string[];
}

export interface ReportToolInput extends ReportListsInput {
  operationalReport: string;
}

export const REPORT_LISTS_TOOL = {
  name: REPORT_TOOL_NAME,
  description:
    "Submit containment resources and seal protection steps after writing the operational brief",
  eager_input_streaming: true,
  input_schema: {
    type: "object" as const,
    properties: {
      containmentResources: {
        type: "array",
        description: "Exactly 3 tailored resource deployment items",
        items: { type: "string" },
        minItems: 3,
        maxItems: 3,
      },
      sealProtectionSteps: {
        type: "array",
        description: "Exactly 3 ecology or seal protection actions",
        items: { type: "string" },
        minItems: 3,
        maxItems: 3,
      },
    },
    required: ["containmentResources", "sealProtectionSteps"],
  },
};

/** @deprecated Use REPORT_LISTS_TOOL — kept for imports that expect REPORT_TOOL */
export const REPORT_TOOL = REPORT_LISTS_TOOL;

export const REPORT_MAX_TOKENS = 1024;

function filterStringArray(value: unknown[] | undefined): string[] {
  if (!value) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function isReportListsInput(value: unknown): value is ReportListsInput {
  if (!value || typeof value !== "object") return false;
  const input = value as Record<string, unknown>;
  if (
    !Array.isArray(input.containmentResources) ||
    input.containmentResources.length < 3 ||
    !input.containmentResources.every((item) => typeof item === "string")
  ) {
    return false;
  }
  if (
    !Array.isArray(input.sealProtectionSteps) ||
    input.sealProtectionSteps.length < 3 ||
    !input.sealProtectionSteps.every((item) => typeof item === "string")
  ) {
    return false;
  }
  return true;
}

export function parseReportListsInput(value: unknown): ReportListsInput | null {
  if (!isReportListsInput(value)) return null;
  const input = value as unknown as Record<string, unknown>;
  return {
    containmentResources: input.containmentResources as string[],
    sealProtectionSteps: input.sealProtectionSteps as string[],
  };
}

export function mergeReportLists(
  report: EmergencyReport,
  partial: Partial<ReportListsInput>
): EmergencyReport {
  return {
    ...report,
    containmentResources: partial.containmentResources
      ? filterStringArray(partial.containmentResources)
      : report.containmentResources,
    sealProtectionSteps: partial.sealProtectionSteps
      ? filterStringArray(partial.sealProtectionSteps)
      : report.sealProtectionSteps,
  };
}

export function finalizeReport(
  shell: EmergencyReport,
  operationalReport: string,
  lists: ReportListsInput
): EmergencyReport {
  return {
    ...shell,
    operationalReport,
    containmentResources: lists.containmentResources,
    sealProtectionSteps: lists.sealProtectionSteps,
    source: "ai",
  };
}
