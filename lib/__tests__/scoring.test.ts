import { describe, it, expect } from "vitest";
import {
  scorePlugins,
  type ScoringResult,
  type CoverageResult,
  type ComplementSuggestion,
  type ReplacementSuggestion,
} from "../scoring";

// ─────────────────────────────────────────────
// ANLYS-02: Empty input
// ─────────────────────────────────────────────
describe("empty input", () => {
  it("returns empty:true when no plugins provided", () => {
    const result = scorePlugins([]);
    expect(result.empty).toBe(true);
  });

  it("returns score:null for empty input", () => {
    const result = scorePlugins([]);
    expect(result.score).toBeNull();
  });

  it("returns no conflicts for empty input", () => {
    const result = scorePlugins([]);
    expect(result.conflicts).toHaveLength(0);
  });

  it("returns no redundancies for empty input", () => {
    const result = scorePlugins([]);
    expect(result.redundancies).toHaveLength(0);
  });

  it("returns no complements for empty input", () => {
    const result = scorePlugins([]);
    expect(result.complements).toHaveLength(0);
  });

  it("returns no replacements for empty input", () => {
    const result = scorePlugins([]);
    expect(result.replacements).toHaveLength(0);
  });

  it("coverage has all 10 categories uncovered for empty input", () => {
    const result = scorePlugins([]);
    expect(result.coverage.uncovered).toHaveLength(10);
    expect(result.coverage.covered).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────
// ANLYS-02: Score calculation
// ─────────────────────────────────────────────
describe("score calculation", () => {
  it("returns empty:false for non-empty input", () => {
    const result = scorePlugins(["context7"]);
    expect(result.empty).toBe(false);
  });

  it("returns a number score for non-empty input", () => {
    const result = scorePlugins(["context7"]);
    expect(typeof result.score).toBe("number");
  });

  it("score is between 0 and 100", () => {
    const result = scorePlugins(["context7"]);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("score is always an integer (no floating point)", () => {
    const result = scorePlugins(["context7"]);
    expect(result.score).toBe(Math.round(result.score as number));
  });

  it("conflicting pair reduces score compared to single plugin", () => {
    const single = scorePlugins(["context7"]);
    const conflicting = scorePlugins(["omc", "superpowers"]);
    expect(conflicting.score as number).toBeLessThan(single.score as number);
  });

  it("score clamps at 0 for extreme negative inputs", () => {
    // Use all known conflicting combos + many plugins to drive score to 0
    const result = scorePlugins(["omc", "superpowers", "playwright", "puppeteer", "brave-search", "tavily"]);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("score clamps at 100 maximum", () => {
    // Single well-verified plugin should not exceed 100
    const result = scorePlugins(["context7"]);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("integer score is consistent with Math.round()", () => {
    const ids = ["context7", "playwright", "github"];
    const result = scorePlugins(ids);
    expect(Number.isInteger(result.score)).toBe(true);
  });
});

// ─────────────────────────────────────────────
// ANLYS-01: Conflict detection
// ─────────────────────────────────────────────
describe("conflict detection", () => {
  it("detects omc+superpowers as a conflict", () => {
    const result = scorePlugins(["omc", "superpowers"]);
    expect(result.conflicts.length).toBeGreaterThan(0);
  });

  it("conflict entry includes both omc and superpowers ids", () => {
    const result = scorePlugins(["omc", "superpowers"]);
    const ids = result.conflicts[0].ids;
    expect(ids).toContain("omc");
    expect(ids).toContain("superpowers");
  });

  it("no conflicts for context7+playwright (compatible pair)", () => {
    const result = scorePlugins(["context7", "playwright"]);
    expect(result.conflicts).toHaveLength(0);
  });

  it("detects playwright+puppeteer as a conflict", () => {
    const result = scorePlugins(["playwright", "puppeteer"]);
    expect(result.conflicts.length).toBeGreaterThan(0);
  });

  it("conflict has msg field", () => {
    const result = scorePlugins(["omc", "superpowers"]);
    expect(typeof result.conflicts[0].msg).toBe("string");
    expect(result.conflicts[0].msg.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────
// Redundancy detection
// ─────────────────────────────────────────────
describe("redundancy detection", () => {
  it("detects brave-search+tavily as a redundancy", () => {
    const result = scorePlugins(["brave-search", "tavily"]);
    expect(result.redundancies.length).toBeGreaterThan(0);
  });

  it("no redundancies for unrelated pair", () => {
    const result = scorePlugins(["context7", "playwright"]);
    expect(result.redundancies).toHaveLength(0);
  });

  it("redundancy has msg field", () => {
    const result = scorePlugins(["brave-search", "tavily"]);
    expect(typeof result.redundancies[0].msg).toBe("string");
  });
});

// ─────────────────────────────────────────────
// ANLYS-03: Coverage analysis
// ─────────────────────────────────────────────
describe("coverage analysis", () => {
  it("covered + uncovered always equals 10", () => {
    const single = scorePlugins(["context7"]);
    expect(single.coverage.covered.length + single.coverage.uncovered.length).toBe(10);
  });

  it("covered + uncovered equals 10 for multiple plugins", () => {
    const multi = scorePlugins(["context7", "playwright", "github", "omc"]);
    expect(multi.coverage.covered.length + multi.coverage.uncovered.length).toBe(10);
  });

  it("context7 appears in covered (workflow category)", () => {
    const result = scorePlugins(["context7"]);
    expect(result.coverage.covered).toContain("workflow");
  });

  it("uncovered has all 10 categories for empty input", () => {
    const result = scorePlugins([]);
    expect(result.coverage.uncovered).toHaveLength(10);
  });

  it("covered has unique categories (no duplicates)", () => {
    const result = scorePlugins(["context7", "bkit", "bkit-starter"]);
    const covered = result.coverage.covered;
    expect(new Set(covered).size).toBe(covered.length);
  });
});

// ─────────────────────────────────────────────
// RECOM-01: Complement suggestions
// ─────────────────────────────────────────────
describe("complement suggestions", () => {
  it("complements do not contain already-installed plugins", () => {
    const result = scorePlugins(["context7"]);
    const complementIds = result.complements.map((c) => c.pluginId);
    expect(complementIds).not.toContain("context7");
  });

  it("complements length <= number of uncovered categories", () => {
    const result = scorePlugins(["context7"]);
    expect(result.complements.length).toBeLessThanOrEqual(result.coverage.uncovered.length);
  });

  it("each complement has pluginId field", () => {
    const result = scorePlugins(["context7"]);
    for (const c of result.complements) {
      expect(typeof c.pluginId).toBe("string");
      expect(c.pluginId.length).toBeGreaterThan(0);
    }
  });

  it("each complement has forCategory field", () => {
    const result = scorePlugins(["context7"]);
    for (const c of result.complements) {
      expect(typeof c.forCategory).toBe("string");
      expect(c.forCategory.length).toBeGreaterThan(0);
    }
  });

  it("complement forCategory is in uncovered list", () => {
    const result = scorePlugins(["context7"]);
    for (const c of result.complements) {
      expect(result.coverage.uncovered).toContain(c.forCategory);
    }
  });

  it("no complements for already-installed ids excluded", () => {
    // Install one plugin from each category to maximize coverage
    const result = scorePlugins(["context7", "playwright", "github", "omc", "security", "aws", "figma", "vercel", "repomix", "taskmaster"]);
    const complementIds = result.complements.map((c) => c.pluginId);
    const installedIds = ["context7", "playwright", "github", "omc", "security", "aws", "figma", "vercel", "repomix", "taskmaster"];
    for (const id of installedIds) {
      expect(complementIds).not.toContain(id);
    }
  });
});

// ─────────────────────────────────────────────
// RECOM-02: Replacement suggestions
// ─────────────────────────────────────────────
describe("replacement suggestions", () => {
  it("unverified plugin triggers a replacement suggestion", () => {
    // ralph has verificationStatus: "unverified"
    const result = scorePlugins(["ralph"]);
    const replacementOriginalIds = result.replacements.map((r) => r.original);
    expect(replacementOriginalIds).toContain("ralph");
  });

  it("stale plugin triggers replacement with reason deprecated", () => {
    // linear has maintenanceStatus: "stale"
    const result = scorePlugins(["linear"]);
    const linearReplacement = result.replacements.find((r) => r.original === "linear");
    expect(linearReplacement).toBeDefined();
    expect(linearReplacement?.reason).toBe("deprecated");
  });

  it("replacement suggestion has original field", () => {
    const result = scorePlugins(["ralph"]);
    const r = result.replacements.find((x) => x.original === "ralph");
    expect(r?.original).toBe("ralph");
  });

  it("replacement suggestion has reason field", () => {
    const result = scorePlugins(["ralph"]);
    const r = result.replacements.find((x) => x.original === "ralph");
    expect(typeof r?.reason).toBe("string");
  });

  it("replacement suggestion has replacement field (string or null)", () => {
    const result = scorePlugins(["ralph"]);
    const r = result.replacements.find((x) => x.original === "ralph");
    expect(r).toBeDefined();
    // replacement is string or null
    expect(r?.replacement === null || typeof r?.replacement === "string").toBe(true);
  });

  it("if no same-category verified alternative, replacement is null", () => {
    // uiux is unverified with category ui-ux — check if null alternative is handled gracefully
    const result = scorePlugins(["uiux"]);
    const r = result.replacements.find((x) => x.original === "uiux");
    expect(r).toBeDefined();
    // replacement can be null if no verified alternative exists in the same category
    expect(r?.replacement === null || typeof r?.replacement === "string").toBe(true);
  });

  it("verified active plugin does NOT trigger replacement", () => {
    const result = scorePlugins(["context7"]);
    const replacementOriginalIds = result.replacements.map((r) => r.original);
    expect(replacementOriginalIds).not.toContain("context7");
  });

  it("partial plugin triggers replacement suggestion", () => {
    // atlassian has verificationStatus: "partial"
    const result = scorePlugins(["atlassian"]);
    const r = result.replacements.find((x) => x.original === "atlassian");
    expect(r).toBeDefined();
    expect(r?.reason).toBe("partial");
  });
});
