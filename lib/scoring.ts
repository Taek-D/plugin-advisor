import type { PluginCategory, Plugin, ItemType } from "./types";
import { PLUGINS } from "./plugins";
import { getConflicts, getRedundancies } from "./conflicts";
import type { ConflictWarning } from "./types";
import type { RedundancyGroup } from "./conflicts";

// ─────────────────────────────────────────────
// Exported types
// ─────────────────────────────────────────────

export type CoverageResult = {
  covered: PluginCategory[];
  uncovered: PluginCategory[];
};

export type ComplementSuggestion = {
  pluginId: string;
  forCategory: PluginCategory;
};

export type ReplacementSuggestion = {
  original: string;
  reason: "unverified" | "partial" | "deprecated";
  replacement: string | null;
};

export type ScoringResult = {
  empty: boolean;
  score: number | null;
  conflicts: ConflictWarning[];
  redundancies: RedundancyGroup[];
  coverage: CoverageResult;
  complements: ComplementSuggestion[];
  replacements: ReplacementSuggestion[];
  typeScope: ItemType | "both";
};

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const ALL_CATEGORIES: PluginCategory[] = [
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

const CONFLICT_PENALTY = 20;
const REDUNDANCY_PENALTY = 7;
const UNCOVERED_PENALTY = 7;

// ─────────────────────────────────────────────
// Private helpers
// ─────────────────────────────────────────────

function rankForComplement(plugin: Plugin): number {
  let score = 0;

  // verificationStatus
  if (plugin.verificationStatus === "verified") score += 4;
  else if (plugin.verificationStatus === "partial") score += 1;
  else if (plugin.verificationStatus === "unverified") score -= 4;

  // difficulty
  if (plugin.difficulty === "beginner") score += 3;
  else if (plugin.difficulty === "advanced") score -= 2;

  // maintenanceStatus
  if (plugin.maintenanceStatus === "stale") score -= 3;
  else if (plugin.maintenanceStatus === "unclear") score -= 2;

  return score;
}

function calculateScore(
  conflictCount: number,
  redundancyCount: number,
  uncoveredCount: number
): number {
  return Math.round(
    Math.max(
      0,
      Math.min(
        100,
        100 -
          conflictCount * CONFLICT_PENALTY -
          redundancyCount * REDUNDANCY_PENALTY -
          uncoveredCount * UNCOVERED_PENALTY
      )
    )
  );
}

function buildCoverage(ids: string[]): CoverageResult {
  const coveredSet = new Set<PluginCategory>();
  for (const id of ids) {
    const plugin = PLUGINS[id];
    if (plugin?.category) {
      coveredSet.add(plugin.category);
    }
  }
  const covered = ALL_CATEGORIES.filter((cat) => coveredSet.has(cat));
  const uncovered = ALL_CATEGORIES.filter((cat) => !coveredSet.has(cat));
  return { covered, uncovered };
}

function buildComplements(
  uncovered: PluginCategory[],
  installedIds: string[],
  typeScope: ItemType | "both"
): ComplementSuggestion[] {
  const installedSet = new Set(installedIds);
  const complements: ComplementSuggestion[] = [];

  for (const category of uncovered) {
    // Find all plugins in this category that are not already installed
    const candidates = Object.values(PLUGINS).filter(
      (plugin) =>
        plugin.category === category &&
        !installedSet.has(plugin.id) &&
        (typeScope === "both" || plugin.type === typeScope)
    );

    if (candidates.length === 0) continue;

    // Pick the best-ranked candidate
    const best = candidates.reduce((prev, curr) =>
      rankForComplement(curr) > rankForComplement(prev) ? curr : prev
    );

    complements.push({ pluginId: best.id, forCategory: category });
  }

  return complements;
}

function buildReplacements(ids: string[], typeScope: ItemType | "both"): ReplacementSuggestion[] {
  const replacements: ReplacementSuggestion[] = [];

  for (const id of ids) {
    const plugin = PLUGINS[id];
    if (!plugin) continue;

    const isUnverified = plugin.verificationStatus === "unverified";
    const isPartial = plugin.verificationStatus === "partial";
    const isStale = plugin.maintenanceStatus === "stale";

    if (!isUnverified && !isPartial && !isStale) continue;

    const reason: ReplacementSuggestion["reason"] = isStale
      ? "deprecated"
      : isUnverified
      ? "unverified"
      : "partial";

    // Find best same-category verified alternative (exclude the plugin itself)
    const alternatives = Object.values(PLUGINS).filter(
      (p) =>
        p.id !== id &&
        p.category === plugin.category &&
        p.verificationStatus === "verified" &&
        p.maintenanceStatus !== "stale" &&
        (typeScope === "both" || p.type === typeScope)
    );

    const best =
      alternatives.length > 0
        ? alternatives.reduce((prev, curr) =>
            rankForComplement(curr) > rankForComplement(prev) ? curr : prev
          )
        : null;

    replacements.push({
      original: id,
      reason,
      replacement: best?.id ?? null,
    });
  }

  return replacements;
}

// ─────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────

export function scorePlugins(
  ids: string[],
  typeScope: ItemType | "both" = "both"
): ScoringResult {
  // Early return for empty input
  if (ids.length === 0) {
    return {
      empty: true,
      score: null,
      conflicts: [],
      redundancies: [],
      coverage: { covered: [], uncovered: [...ALL_CATEGORIES] },
      complements: [],
      replacements: [],
      typeScope,
    };
  }

  const conflicts = getConflicts(ids);
  const redundancies = getRedundancies(ids);
  const coverage = buildCoverage(ids);
  const score = calculateScore(
    conflicts.length,
    redundancies.length,
    coverage.uncovered.length
  );
  const complements = buildComplements(coverage.uncovered, ids, typeScope);
  const replacements = buildReplacements(ids, typeScope);

  return {
    empty: false,
    score,
    conflicts,
    redundancies,
    coverage,
    complements,
    replacements,
    typeScope,
  };
}
