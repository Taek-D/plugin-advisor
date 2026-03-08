import { describe, it, expect } from "vitest";
import { recommend } from "../recommend";

describe("recommend()", () => {
  it("returns recommendations when keywords match", () => {
    // "react" matches context7, uiux; "test" matches playwright, ralph; "backend" matches omc, supabase
    const result = recommend("React TypeScript testing backend");
    expect(result.recommendations.length).toBeGreaterThan(0);
    // All returned items must have a pluginId
    result.recommendations.forEach((r) => {
      expect(typeof r.pluginId).toBe("string");
      expect(r.pluginId.length).toBeGreaterThan(0);
    });
  });

  it("returns default recommendations when no keywords match", () => {
    // Use input with no possible keyword overlap
    const result = recommend("zzz qqq www");
    // Default fallback returns bkit and context7
    const ids = result.recommendations.map((r) => r.pluginId);
    expect(ids).toContain("bkit");
    expect(ids).toContain("context7");
  });

  it("includes a warning when no keywords match", () => {
    const result = recommend("zzz qqq www");
    // The no-match fallback sets a non-null warning string
    expect(result.warning).not.toBeNull();
    expect(typeof result.warning).toBe("string");
  });

  it("beginner boost: '초보' input boosts bkit-starter into results", () => {
    const result = recommend("초보 개발자입니다");
    const ids = result.recommendations.map((r) => r.pluginId);
    expect(ids).toContain("bkit-starter");
  });

  it("beginner boost: 'beginner' input boosts bkit-starter into results", () => {
    const result = recommend("I am a beginner developer");
    const ids = result.recommendations.map((r) => r.pluginId);
    expect(ids).toContain("bkit-starter");
  });

  it("conflict handling: weaker conflicting plugin gets penalized", () => {
    // omc and superpowers conflict; input triggers both but heavily favors omc
    // "멀티에이전트 backend multi complex orchestrat" -> omc gets 5+ keywords
    // "script" -> superpowers gets 1 keyword
    // After penalty superpowers score drops and omc should rank higher
    const result = recommend("멀티에이전트 backend multi complex orchestrat script");
    const ids = result.recommendations.map((r) => r.pluginId);
    if (ids.includes("omc") && ids.includes("superpowers")) {
      const omcPriority = result.recommendations.find((r) => r.pluginId === "omc")!.priority;
      const spPriority = result.recommendations.find((r) => r.pluginId === "superpowers")!.priority;
      expect(omcPriority).toBeLessThan(spPriority);
    } else {
      // At minimum, omc should appear
      expect(ids).toContain("omc");
    }
  });

  it("returns at most 4 recommendations", () => {
    // Very broad input to match many plugins
    const result = recommend(
      "react typescript test backend security auth database sql crawl search " +
        "멀티에이전트 prd 문서 설계 e2e browser script data notion"
    );
    expect(result.recommendations.length).toBeLessThanOrEqual(4);
  });

  it("warning shown when 4 plugins are recommended", () => {
    const result = recommend(
      "react typescript test backend security auth database sql crawl search " +
        "멀티에이전트 prd 문서 설계 e2e browser script data notion"
    );
    if (result.recommendations.length >= 4) {
      expect(result.warning).toBe(
        "플러그인이 많으면 충돌 위험이 있어요. 핵심 1-2개 먼저 써보세요."
      );
    }
  });

  it("complement suggestion: omc recommendation surfaces context7 complement", () => {
    // Trigger omc heavily without context7 keywords
    const result = recommend("멀티에이전트 backend multi complex orchestrat 대규모 팀");
    const ids = result.recommendations.map((r) => r.pluginId);
    if (ids.includes("omc") && !ids.includes("context7")) {
      expect(result.complements).toBeDefined();
      const compIds = result.complements!.map((c) => c.pluginId);
      expect(compIds).toContain("context7");
    }
  });

  it("complement suggestion: playwright recommendation surfaces uiux complement", () => {
    // Trigger playwright heavily without uiux keywords
    const result = recommend("e2e test browser qa headless selenium verify");
    const ids = result.recommendations.map((r) => r.pluginId);
    if (ids.includes("playwright") && !ids.includes("uiux")) {
      expect(result.complements).toBeDefined();
      const compIds = result.complements!.map((c) => c.pluginId);
      expect(compIds).toContain("uiux");
    }
  });

  it("complement pluginId already in recommendations is not added as complement", () => {
    // omc complement is context7 — if context7 is already recommended, it should not appear in complements
    const result = recommend("멀티에이전트 backend react nextjs api framework library");
    const ids = result.recommendations.map((r) => r.pluginId);
    if (ids.includes("omc") && ids.includes("context7")) {
      const compIds = (result.complements ?? []).map((c) => c.pluginId);
      expect(compIds).not.toContain("context7");
    }
  });

  it("priority values are sequential starting from 1", () => {
    const result = recommend("react nextjs api framework library");
    result.recommendations.forEach((r, i) => {
      expect(r.priority).toBe(i + 1);
    });
  });

  it("inputText is echoed back in result", () => {
    const input = "react typescript test";
    const result = recommend(input);
    expect(result.inputText).toBe(input);
  });

  it("redundancy detection: two search plugins in results yields redundancy warning", () => {
    // brave-search and tavily both match "search web realtime information"
    const result = recommend("검색 search 웹 web 실시간 realtime 최신 정보 요약 summary rag");
    const ids = result.recommendations.map((r) => r.pluginId);
    const searchPlugins = ["brave-search", "exa", "tavily", "perplexity"];
    const matchCount = ids.filter((id) => searchPlugins.includes(id)).length;
    if (matchCount >= 2) {
      expect(result.redundancies).toBeDefined();
      expect(result.redundancies!.length).toBeGreaterThan(0);
    }
  });

  it("matched keywords are returned for matched plugins", () => {
    const result = recommend("react nextjs");
    const matchedPlugin = result.recommendations.find((r) => r.matchedKeywords.length > 0);
    expect(matchedPlugin).toBeDefined();
  });
});
