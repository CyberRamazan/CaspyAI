import fs from "fs/promises";
import path from "path";
import type { DiscoveredAsset } from "@/lib/types";
import { mergeMarkerLists } from "@/lib/markerUtils";

export interface MarkerStoreFile {
  markers: DiscoveredAsset[];
}

const MARKERS_PATH = path.join(process.cwd(), "data", "caspian-markers.json");

export async function readMarkerStore(): Promise<MarkerStoreFile> {
  try {
    const raw = await fs.readFile(MARKERS_PATH, "utf8");
    const parsed = JSON.parse(raw) as MarkerStoreFile;
    if (!Array.isArray(parsed.markers)) return { markers: [] };
    return { markers: parsed.markers };
  } catch {
    return { markers: [] };
  }
}

export async function appendMarkersToStore(
  incoming: DiscoveredAsset[]
): Promise<DiscoveredAsset[]> {
  const store = await readMarkerStore();
  const merged = mergeMarkerLists(store.markers, incoming);
  await fs.mkdir(path.dirname(MARKERS_PATH), { recursive: true });
  await fs.writeFile(
    MARKERS_PATH,
    `${JSON.stringify({ markers: merged }, null, 2)}\n`,
    "utf8"
  );
  return merged;
}
