import { NextRequest, NextResponse } from "next/server";
import { PLUGINS } from "@/lib/plugins";
import { checkRateLimit, cleanupExpiredEntries } from "@/lib/rate-limit";
import type { VersionInfo } from "@/lib/types";

// Server-side in-memory cache (persists across requests within same instance)
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const versionCache = new Map<string, { data: VersionInfo; expiresAt: number }>();

function emptyVersion(id: string): VersionInfo {
  return { pluginId: id, latestVersion: null, publishedAt: null, releaseUrl: null };
}

export async function GET(request: NextRequest) {
  cleanupExpiredEntries();
  const { allowed } = checkRateLimit(request, {
    name: "versions",
    maxRequests: 15,
    windowMs: 60_000,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "요청이 너무 많아요. 잠시 후 다시 시도해 주세요." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const versions: Record<string, VersionInfo> = {};
  const now = Date.now();

  // Serve from cache where possible
  const uncached: string[] = [];
  for (const id of ids) {
    const cached = versionCache.get(id);
    if (cached && cached.expiresAt > now) {
      versions[id] = cached.data;
    } else {
      uncached.push(id);
    }
  }

  // Fetch only uncached IDs
  const promises = uncached.map(async (id) => {
    const plugin = PLUGINS[id];
    if (!plugin?.githubRepo) {
      const v = emptyVersion(id);
      versions[id] = v;
      versionCache.set(id, { data: v, expiresAt: now + CACHE_TTL });
      return;
    }

    try {
      const res = await fetch(
        `https://api.github.com/repos/${plugin.githubRepo}/releases/latest`,
        { headers }
      );
      if (!res.ok) {
        const v = emptyVersion(id);
        versions[id] = v;
        versionCache.set(id, { data: v, expiresAt: now + CACHE_TTL / 4 });
        return;
      }
      const data = await res.json();
      const v: VersionInfo = {
        pluginId: id,
        latestVersion: data.tag_name ?? null,
        publishedAt: data.published_at ?? null,
        releaseUrl: data.html_url ?? null,
      };
      versions[id] = v;
      versionCache.set(id, { data: v, expiresAt: now + CACHE_TTL });
    } catch {
      const v = emptyVersion(id);
      versions[id] = v;
      versionCache.set(id, { data: v, expiresAt: now + CACHE_TTL / 4 });
    }
  });

  await Promise.all(promises);
  return NextResponse.json({ versions });
}
