import { describe, expect, it } from "vitest";
import {
  filterPluginSuggestions,
  normalizeGitHubRepo,
  parseAdminSuggestionPatch,
  parsePluginSuggestionPayload,
} from "../plugin-suggestions";
import type { PluginSuggestion } from "../types";

describe("plugin suggestion helpers", () => {
  it("accepts a valid suggestion payload and normalizes GitHub repos", () => {
    const parsed = parsePluginSuggestionPayload({
      repositoryUrl: "https://github.com/OpenAI/Codex",
      reason: "이 플러그인은 작업 흐름에 도움이 될 것 같아요.",
      pluginName: "Codex Helper",
    });

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    expect(parsed.data.repositoryUrl).toBe("https://github.com/OpenAI/Codex");
    expect(normalizeGitHubRepo(parsed.data.repositoryUrl)).toBe("openai/codex");
  });

  it("rejects non-https repository urls", () => {
    const parsed = parsePluginSuggestionPayload({
      repositoryUrl: "http://github.com/openai/codex",
      reason: "이유",
    });

    expect(parsed.ok).toBe(false);
  });

  it("requires a non-empty reason", () => {
    const parsed = parsePluginSuggestionPayload({
      repositoryUrl: "https://github.com/openai/codex",
      reason: "   ",
    });

    expect(parsed.ok).toBe(false);
  });

  it("accepts only valid admin patch statuses", () => {
    const valid = parseAdminSuggestionPatch({
      status: "approved",
      adminNotes: "좋은 후보라서 검토 통과",
    });
    const invalid = parseAdminSuggestionPatch({
      status: "published",
    });

    expect(valid.ok).toBe(true);
    expect(invalid.ok).toBe(false);
  });

  it("filters suggestions by status and text query", () => {
    const suggestions: PluginSuggestion[] = [
      {
        id: "1",
        created_at: "2026-03-09T00:00:00.000Z",
        status: "approved",
        plugin_name: "Agency Agents",
        repository_url: "https://github.com/msitarzewski/agency-agents",
        normalized_repo: "msitarzewski/agency-agents",
        reason: "역할 기반 에이전트 구성이 좋아요.",
        submitter_name: null,
        contact: null,
        source_page: "/plugins",
        admin_notes: null,
        reviewed_at: "2026-03-09T01:00:00.000Z",
      },
      {
        id: "2",
        created_at: "2026-03-10T00:00:00.000Z",
        status: "pending",
        plugin_name: "fireauto",
        repository_url: "https://github.com/imgompanda/fireauto",
        normalized_repo: "imgompanda/fireauto",
        reason: "출시 준비용 워크플로가 좋아요.",
        submitter_name: "kim",
        contact: "kim@example.com",
        source_page: "/plugins/fireauto",
        admin_notes: null,
        reviewed_at: null,
      },
    ];

    const filtered = filterPluginSuggestions(suggestions, {
      status: "pending",
      query: "imgompanda",
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("2");
  });
});
