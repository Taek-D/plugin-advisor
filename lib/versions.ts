import type { VersionInfo } from "./types";

const CACHE_KEY = "plugin-advisor-versions";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

type CacheEntry = {
  data: Record<string, VersionInfo>;
  timestamp: number;
};

export async function fetchVersions(
  pluginIds: string[]
): Promise<Record<string, VersionInfo>> {
  if (typeof window === "undefined") return {};

  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const entry = JSON.parse(cached) as CacheEntry;
      if (Date.now() - entry.timestamp < CACHE_DURATION) {
        return entry.data;
      }
    } catch {
      // ignore
    }
  }

  try {
    const res = await fetch(`/api/versions?ids=${pluginIds.join(",")}`);
    if (!res.ok) return {};
    const { versions } = (await res.json()) as {
      versions: Record<string, VersionInfo>;
    };
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: versions, timestamp: Date.now() })
    );
    return versions;
  } catch {
    return {};
  }
}
