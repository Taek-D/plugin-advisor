import { NextResponse } from "next/server";
import { PLUGINS } from "@/lib/plugins";
import type { VersionInfo } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const versions: Record<string, VersionInfo> = {};

  const promises = ids.map(async (id) => {
    const plugin = PLUGINS[id];
    if (!plugin?.githubRepo) {
      versions[id] = {
        pluginId: id,
        latestVersion: null,
        publishedAt: null,
        releaseUrl: null,
      };
      return;
    }

    try {
      const res = await fetch(
        `https://api.github.com/repos/${plugin.githubRepo}/releases/latest`,
        {
          headers,
          next: { revalidate: 3600 },
        }
      );
      if (!res.ok) {
        versions[id] = {
          pluginId: id,
          latestVersion: null,
          publishedAt: null,
          releaseUrl: null,
        };
        return;
      }
      const data = await res.json();
      versions[id] = {
        pluginId: id,
        latestVersion: data.tag_name ?? null,
        publishedAt: data.published_at ?? null,
        releaseUrl: data.html_url ?? null,
      };
    } catch {
      versions[id] = {
        pluginId: id,
        latestVersion: null,
        publishedAt: null,
        releaseUrl: null,
      };
    }
  });

  await Promise.all(promises);
  return NextResponse.json({ versions });
}
