#!/usr/bin/env node
/**
 * One-time / manual script: calls Claude and writes data/caspian-markers.json.
 * Run: node --env-file=.env scripts/seed-markers.mjs
 */
import fs from "fs/promises";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5-20250929";
const MARKERS_PATH = path.join(process.cwd(), "data", "caspian-markers.json");

const SEED_TOOL = {
  name: "submit_caspian_markers",
  description: "Submit Caspian Sea map markers",
  input_schema: {
    type: "object",
    properties: {
      markers: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            lat: { type: "number" },
            lng: { type: "number" },
            description: { type: "string" },
          },
          required: ["name", "lat", "lng", "description"],
        },
        minItems: 20,
        maxItems: 40,
      },
    },
    required: ["markers"],
  },
};

const PROMPT = `You are building a map database for the entire Caspian Sea.

Submit submit_caspian_markers with 25–35 real, ecologically and operationally important sites across ALL Caspian littoral states (Kazakhstan, Russia, Azerbaijan, Turkmenistan, Iran).

Include a balanced mix of:
- Major ports (Aktau, Atyrau, Astrakhan, Baku, Turkmenbashi, Bandar Anzali, etc.)
- Oil & gas infrastructure (Kashagan, Tengiz, ACG, offshore fields)
- Protected habitats (Caspian seal haul-outs, sturgeon spawning, wetlands)
- Coastal cities and fishing communities

Use accurate WGS84 lat/lng on the Caspian. Each marker needs name, lat, lng, and a one-line description.`;

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

function toAsset(marker, index) {
  return {
    id: `marker-${index}-${slugify(marker.name) || index}`,
    name: marker.name,
    lat: marker.lat,
    lng: marker.lng,
    description: marker.description,
  };
}

function dedupe(markers) {
  const seen = new Set();
  return markers.filter((m) => {
    const key = `${slugify(m.name)}|${m.lat.toFixed(3)}|${m.lng.toFixed(3)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });
  console.log(`Calling Claude (${MODEL}) to seed Caspian markers…`);

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    tools: [SEED_TOOL],
    tool_choice: { type: "tool", name: "submit_caspian_markers" },
    messages: [{ role: "user", content: PROMPT }],
  });

  const block = message.content.find(
    (b) => b.type === "tool_use" && b.name === "submit_caspian_markers"
  );

  if (!block || block.type !== "tool_use") {
    console.error("No tool result from Claude");
    process.exit(1);
  }

  const input = block.input;
  if (!input?.markers || !Array.isArray(input.markers)) {
    console.error("Invalid tool payload");
    process.exit(1);
  }

  const markers = dedupe(
    input.markers
      .filter(
        (m) =>
          typeof m.name === "string" &&
          typeof m.lat === "number" &&
          typeof m.lng === "number" &&
          typeof m.description === "string"
      )
      .map(toAsset)
  );

  await fs.mkdir(path.dirname(MARKERS_PATH), { recursive: true });
  await fs.writeFile(
    MARKERS_PATH,
    `${JSON.stringify({ markers }, null, 2)}\n`,
    "utf8"
  );

  console.log(`Wrote ${markers.length} markers to ${MARKERS_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
