import type { Locale } from "@/lib/i18n/types";
import type { ReportListsInput } from "@/lib/reportTool";
import type { EmergencyReport, IncidentConfig, LatLngPoint } from "@/lib/types";

type StreamEvent =
  | { type: "baseline"; data: EmergencyReport }
  | { type: "text"; text: string }
  | { type: "lists"; data: Partial<ReportListsInput> }
  | { type: "complete"; data: EmergencyReport }
  | { type: "error"; message: string };

export interface StreamReportOptions {
  config: IncidentConfig;
  epicenter: LatLngPoint;
  locale: Locale;
  signal?: AbortSignal;
  onBaseline: (baseline: EmergencyReport) => void;
  onText: (text: string) => void;
  onLists: (partial: Partial<ReportListsInput>) => void;
  onComplete: (report: EmergencyReport) => void;
}

/** Coalesce rapid updates into at most one callback per animation frame. */
function createFrameBatcher(flush: (value: string) => void) {
  let pending: string | null = null;
  let frameId: number | null = null;

  const schedule = () => {
    if (frameId !== null) return;
    frameId = requestAnimationFrame(() => {
      frameId = null;
      if (pending !== null) {
        flush(pending);
        pending = null;
      }
    });
  };

  return {
    push(value: string) {
      pending = value;
      schedule();
    },
    flushNow() {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      if (pending !== null) {
        flush(pending);
        pending = null;
      }
    },
  };
}

export async function streamEmergencyReport(
  options: StreamReportOptions
): Promise<void> {
  const {
    epicenter,
    locale,
    signal,
    onBaseline,
    onText,
    onLists,
    onComplete,
  } = options;

  const response = await fetch("/api/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      config: options.config,
      epicenter,
      locale,
    }),
    signal,
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(errorBody?.error ?? "Report request failed");
  }

  if (!response.body) {
    throw new Error("Empty response stream");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const textBatcher = createFrameBatcher(onText);

  const handleEvent = (event: StreamEvent) => {
    switch (event.type) {
      case "baseline":
        onBaseline(event.data);
        break;
      case "text":
        textBatcher.push(event.text);
        break;
      case "lists":
        textBatcher.flushNow();
        onLists(event.data);
        break;
      case "complete":
        textBatcher.flushNow();
        onComplete(event.data);
        break;
      case "error":
        throw new Error(event.message);
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";

    for (const chunk of chunks) {
      const line = chunk
        .split("\n")
        .find((entry) => entry.startsWith("data: "));
      if (!line) continue;

      const payload = JSON.parse(line.slice(6)) as StreamEvent;
      handleEvent(payload);
    }
  }

  textBatcher.flushNow();
}
