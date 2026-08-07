import Anthropic from "@anthropic-ai/sdk";
import {
  buildReportShell,
  computeAffectedAreaSqKm,
  computeSeverity,
} from "@/lib/reportGenerator";
import { readMarkerStore } from "@/lib/markerStore";
import { filterMarkersNear } from "@/lib/markerUtils";
import { buildReportPrompt } from "@/lib/reportPrompt";
import {
  finalizeReport,
  parseReportListsInput,
  REPORT_LISTS_TOOL,
  REPORT_MAX_TOKENS,
  REPORT_TOOL_NAME,
} from "@/lib/reportTool";
import type { IncidentConfig, LatLngPoint } from "@/lib/types";
import type { Locale } from "@/lib/i18n/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_MODEL =
  process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5-20250929";

interface ReportRequestBody {
  config: IncidentConfig;
  epicenter: LatLngPoint;
  locale: Locale;
}

function sseLine(payload: unknown): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

function extractText(message: Anthropic.Message): string {
  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 503 }
    );
  }

  let body: ReportRequestBody;
  try {
    body = (await request.json()) as ReportRequestBody;
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { config, epicenter, locale } = body;
  if (!config || !epicenter || !locale) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const severity = computeSeverity(config);
  const affectedAreaSqKm = computeAffectedAreaSqKm(epicenter, config.radiusKm);
  const shell = buildReportShell(config, epicenter);
  const store = await readMarkerStore();
  const mapMarkers = filterMarkersNear(epicenter, store.markers, 150);
  const prompt = buildReportPrompt(
    config,
    epicenter,
    severity,
    affectedAreaSqKm,
    locale,
    mapMarkers
  );

  const encoder = new TextEncoder();
  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(sseLine({ type: "baseline", data: shell }))
      );

      try {
        const anthropicStream = client.messages.stream({
          model: DEFAULT_MODEL,
          max_tokens: REPORT_MAX_TOKENS,
          tools: [REPORT_LISTS_TOOL],
          tool_choice: { type: "auto" },
          messages: [{ role: "user", content: prompt }],
        });

        anthropicStream.on("text", (_delta, textSnapshot) => {
          controller.enqueue(
            encoder.encode(sseLine({ type: "text", text: textSnapshot }))
          );
        });

        anthropicStream.on("inputJson", (_partialJson, jsonSnapshot) => {
          if (!jsonSnapshot || typeof jsonSnapshot !== "object") return;
          controller.enqueue(
            encoder.encode(
              sseLine({ type: "lists", data: jsonSnapshot as object })
            )
          );
        });

        const message = await anthropicStream.finalMessage();
        const operationalReport = extractText(message).trim();

        const toolBlock = message.content.find(
          (block) =>
            block.type === "tool_use" && block.name === REPORT_TOOL_NAME
        );

        if (!toolBlock || toolBlock.type !== "tool_use") {
          throw new Error("Model did not return a report tool result");
        }

        const lists = parseReportListsInput(toolBlock.input);
        if (!lists) {
          throw new Error("Invalid report tool payload");
        }

        if (!operationalReport) {
          throw new Error("Model did not return an operational brief");
        }

        const report = finalizeReport(shell, operationalReport, lists);
        controller.enqueue(
          encoder.encode(sseLine({ type: "complete", data: report }))
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Report generation failed";
        controller.enqueue(
          encoder.encode(sseLine({ type: "error", message }))
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
