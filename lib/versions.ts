import type { VersionInfo } from "./types";

const CACHE_KEY = "plugin-advisor-versions";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

type CacheEntry = {
  data: Record<string, VersionInfo>;
  timestamp: number;
};

function readCache(): CacheEntry | null {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  try {
    return JSON.parse(cached) as CacheEntry;
  } catch {
    return null;
  }
}

function pickVersions(
  data: Record<string, VersionInfo>,
  pluginIds: string[]
): Record<string, VersionInfo> {
  return pluginIds.reduce<Record<string, VersionInfo>>((acc, id) => {
    if (data[id]) acc[id] = data[id];
    return acc;
  }, {});
}

export async function fetchVersions(
  pluginIds: string[]
): Promise<Record<string, VersionInfo>> {
  if (typeof window === "undefined" || pluginIds.length === 0) return {};

  const uniqueIds = Array.from(new Set(pluginIds));
  const cache = readCache();
  const cachedData =
    cache && Date.now() - cache.timestamp < CACHE_DURATION ? cache.data : {};
  const missingIds = uniqueIds.filter((id) => !cachedData[id]);

  if (!missingIds.length) {
    return pickVersions(cachedData, uniqueIds);
  }

  try {
    const params = new URLSearchParams({ ids: missingIds.join(",") });
    const res = await fetch(`/api/versions?${params.toString()}`);
    if (!res.ok) return pickVersions(cachedData, uniqueIds);

    const { versions } = (await res.json()) as {
      versions: Record<string, VersionInfo>;
    };

    const merged = { ...cachedData, ...versions };
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: merged, timestamp: Date.now() })
    );
    return pickVersions(merged, uniqueIds);
  } catch {
    return pickVersions(cachedData, uniqueIds);
  }
}
