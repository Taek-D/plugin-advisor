import type {
  AdminSuggestionPatch,
  PluginSuggestion,
  PluginSuggestionPayload,
  PluginSuggestionStatus,
} from "./types";

export const PLUGIN_SUGGESTION_STATUSES: PluginSuggestionStatus[] = [
  "pending",
  "hold",
  "approved",
  "rejected",
];

export type PluginSuggestionFilters = {
  query?: string;
  status?: PluginSuggestionStatus | "all";
};

type ParseSuccess<T> = {
  ok: true;
  data: T;
};

type ParseFailure = {
  ok: false;
  error: string;
};

function readOptionalText(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

function normalizeSourcePage(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) return undefined;
  return trimmed.slice(0, 200);
}

export function isPluginSuggestionStatus(
  value: unknown
): value is PluginSuggestionStatus {
  return (
    typeof value === "string" &&
    PLUGIN_SUGGESTION_STATUSES.includes(value as PluginSuggestionStatus)
  );
}

export function parseSuggestionRepositoryUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  try {
    const parsed = new URL(value.trim());
    if (parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export function normalizeGitHubRepo(repositoryUrl: string): string | null {
  try {
    const parsed = new URL(repositoryUrl);
    const hostname = parsed.hostname.toLowerCase();
    if (hostname !== "github.com" && hostname !== "www.github.com") {
      return null;
    }

    const [owner, repoCandidate] = parsed.pathname
      .split("/")
      .filter(Boolean);

    if (!owner || !repoCandidate) return null;

    const repo = repoCandidate.replace(/\.git$/i, "");
    if (!repo) return null;

    return `${owner}/${repo}`.toLowerCase();
  } catch {
    return null;
  }
}

export function parsePluginSuggestionPayload(
  input: unknown
): ParseSuccess<PluginSuggestionPayload> | ParseFailure {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "제안 정보를 읽을 수 없습니다." };
  }

  const candidate = input as Record<string, unknown>;
  const repositoryUrl = parseSuggestionRepositoryUrl(candidate.repositoryUrl);
  const reason = readOptionalText(candidate.reason, 2000);

  if (!repositoryUrl) {
    return { ok: false, error: "https 형식의 저장소 URL이 필요합니다." };
  }

  if (!reason) {
    return { ok: false, error: "왜 이 플러그인을 제안하는지 적어주세요." };
  }

  return {
    ok: true,
    data: {
      repositoryUrl,
      reason,
      pluginName: readOptionalText(candidate.pluginName, 120),
      submitterName: readOptionalText(candidate.submitterName, 120),
      contact: readOptionalText(candidate.contact, 200),
      sourcePage: normalizeSourcePage(candidate.sourcePage),
    },
  };
}

export function parseAdminSuggestionPatch(
  input: unknown
): ParseSuccess<AdminSuggestionPatch> | ParseFailure {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "수정 정보를 읽을 수 없습니다." };
  }

  const candidate = input as Record<string, unknown>;
  const status = candidate.status;

  if (!isPluginSuggestionStatus(status)) {
    return { ok: false, error: "유효한 검토 상태가 아닙니다." };
  }

  return {
    ok: true,
    data: {
      status,
      adminNotes: readOptionalText(candidate.adminNotes, 2000),
    },
  };
}

export function filterPluginSuggestions(
  suggestions: PluginSuggestion[],
  filters: PluginSuggestionFilters
): PluginSuggestion[] {
  const query = filters.query?.trim().toLowerCase();
  const status = filters.status;

  const filtered = suggestions.filter((item) => {
    if (status && status !== "all" && item.status !== status) {
      return false;
    }

    if (!query) return true;

    return [
      item.plugin_name,
      item.repository_url,
      item.normalized_repo,
      item.reason,
    ]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(query));
  });

  return filtered.sort((left, right) => {
    const rank = (statusValue: PluginSuggestionStatus) => {
      switch (statusValue) {
        case "pending":
          return 0;
        case "hold":
          return 1;
        case "approved":
          return 2;
        case "rejected":
          return 3;
      }
    };

    const rankDiff = rank(left.status) - rank(right.status);
    if (rankDiff !== 0) return rankDiff;

    return (
      new Date(right.created_at).getTime() -
      new Date(left.created_at).getTime()
    );
  });
}
