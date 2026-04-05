import { NextRequest, NextResponse } from "next/server";
import {
  getAdminCookieName,
  getAdminSessionSecret,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { PLUGINS } from "@/lib/plugins";
import {
  addCustomPlugin,
  getCustomPlugins,
} from "@/lib/plugin-store";
import type { Plugin, PluginCategory } from "@/lib/types";

function isAuthorized(request: NextRequest): boolean {
  return verifyAdminSessionToken(
    request.cookies.get(getAdminCookieName())?.value,
    getAdminSessionSecret()
  );
}

type PluginWithMeta = Plugin & {
  isCustom: boolean;
  isDeleted: boolean;
};

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { added, deleted } = await getCustomPlugins();
    const deletedSet = new Set(deleted);

    const result: PluginWithMeta[] = [];

    for (const [id, plugin] of Object.entries(PLUGINS)) {
      result.push({ ...plugin, isCustom: false, isDeleted: deletedSet.has(id) });
    }

    for (const custom of added) {
      result.push({ ...custom, isCustom: true, isDeleted: false });
    }

    return NextResponse.json({ plugins: result });
  } catch {
    return NextResponse.json(
      { error: "플러그인 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

const VALID_CATEGORIES: PluginCategory[] = [
  "orchestration",
  "workflow",
  "code-quality",
  "testing",
  "documentation",
  "data",
  "security",
  "integration",
  "ui-ux",
  "devops",
];

function isPluginCategory(value: unknown): value is PluginCategory {
  return typeof value === "string" && (VALID_CATEGORIES as string[]).includes(value);
}

function parsePluginBody(body: unknown): { ok: true; data: Plugin } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "요청 본문이 올바르지 않습니다." };
  }

  const b = body as Record<string, unknown>;

  if (typeof b.id !== "string" || !b.id.trim()) {
    return { ok: false, error: "id는 필수입니다." };
  }
  if (typeof b.name !== "string" || !b.name.trim()) {
    return { ok: false, error: "name은 필수입니다." };
  }
  if (typeof b.tag !== "string" || !b.tag.trim()) {
    return { ok: false, error: "tag는 필수입니다." };
  }
  if (typeof b.color !== "string" || !b.color.trim()) {
    return { ok: false, error: "color는 필수입니다." };
  }
  if (!isPluginCategory(b.category)) {
    return { ok: false, error: "category가 올바르지 않습니다." };
  }
  if (typeof b.desc !== "string" || !b.desc.trim()) {
    return { ok: false, error: "desc는 필수입니다." };
  }
  if (typeof b.url !== "string" || !b.url.trim()) {
    return { ok: false, error: "url은 필수입니다." };
  }

  const toStringArray = (v: unknown): string[] => {
    if (Array.isArray(v)) return v.filter((x) => typeof x === "string") as string[];
    return [];
  };

  const plugin: Plugin = {
    id: b.id.trim(),
    name: b.name.trim(),
    tag: b.tag.trim(),
    color: b.color.trim(),
    category: b.category,
    desc: b.desc.trim(),
    longDesc: typeof b.longDesc === "string" ? b.longDesc : "",
    url: b.url.trim(),
    githubRepo: typeof b.githubRepo === "string" && b.githubRepo.trim() ? b.githubRepo.trim() : null,
    install: toStringArray(b.install),
    features: toStringArray(b.features),
    conflicts: toStringArray(b.conflicts),
    keywords: toStringArray(b.keywords),
    officialStatus: "community",
    verificationStatus: "unverified",
    difficulty: "intermediate",
    prerequisites: [],
    requiredSecrets: [],
    platformSupport: ["windows", "mac", "linux"],
    installMode: "safe-copy",
    maintenanceStatus: "active",
    bestFor: [],
    avoidFor: [],
    type: "mcp",
  };

  return { ok: true, data: plugin };
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: unknown = await request.json();
    const parsed = parsePluginBody(body);

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { added } = await getCustomPlugins();
    const existingIds = new Set([
      ...Object.keys(PLUGINS),
      ...added.map((p) => p.id),
    ]);

    if (existingIds.has(parsed.data.id)) {
      return NextResponse.json(
        { error: `플러그인 ID "${parsed.data.id}"가 이미 존재합니다.` },
        { status: 409 }
      );
    }

    const plugin = await addCustomPlugin(parsed.data);
    return NextResponse.json({ plugin }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "플러그인을 추가하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
