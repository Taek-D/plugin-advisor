# Phase 6: Scoring Engine - Research

**Researched:** 2026-03-17
**Domain:** Pure TypeScript scoring logic — conflict detection, score calculation, coverage analysis, complement/replacement recommendation
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- 100점 출발 감점 방식 — 문제가 없으면 높은 점수, 문제가 있으면 깎이는 직관적 모델
- 충돌(CONFLICT_PAIRS): 강한 감점 (-15~20점/건)
- 중복(REDUNDANCY_GROUPS): 약한 감점 (-5~8점/건)
- 커버리지: 점수의 핵심 요소 — 미커버 카테고리가 많으면 점수 크게 하락
- 검증상태(verificationStatus): 점수에 영향 없음 — 대체 추천에서만 안내
- 보완 추천: 미커버 카테고리당 최대 1개 플러그인 제안 (최대 10개)
- 보완 추천 우선순위: 검증상태(verified 우선) + 난이도(beginner 우선) — 기존 getTrustScore() 로직 재활용
- 보완 추천 설치 명령어는 데이터에 포함하지 않음 — Phase 7 UI에서 PLUGINS[id].install 참조
- 대체 추천 발동 조건: deprecated, unverified, partial(verificationStatus) 플러그인이 조합에 포함된 경우
- 대안 탐색: 같은 category의 verified 플러그인 중 선택
- 대안 개수: 문제 플러그인당 최선의 대안 1개만 제시
- 대체 추천 데이터 구조: `{ original: pluginId, reason: 'deprecated'|'unverified'|'partial', replacement: pluginId | null }`
- 대안 없는 경우: replacement를 null로 두되 문제는 안내
- 커버리지 판정: 단순 유무 방식 (카테고리에 플러그인 1개라도 있으면 커버됨)
- 10개 카테고리 동등한 가중치, 선형 감점
- 빈 입력 (0개 플러그인): 점수 계산하지 않고 "플러그인을 추가해주세요" 안내 메시지 반환
- 기존 /advisor 추천 엔진(recommend.ts)과 별도 모듈
- `getConflicts()` 독점 사용, `plugin.conflicts[]` 직접 참조 금지
- `buildComplements(installedIds)` 필터링 필수 — 이미 설치된 플러그인 재추천 방지

### Claude's Discretion
- 점수 공식의 세부 가중치 수치 (커버리지/충돌/중복 간 정확한 점수 배분, 선형 감점의 구체적 수치)
- 보완 추천 결과 데이터 구조 설계
- 대체 추천에서 "최선의 대안" 선택 우선순위 (getTrustScore 재활용 등)
- 함수 시그니처 및 모듈 분리 방식

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ANLYS-01 | 입력된 플러그인 조합의 충돌이 감지되고 경고로 표시된다 | `getConflicts()` + `getRedundancies()` already exist in `lib/conflicts.ts`; scoring engine calls them and includes results in `ScoringResult` |
| ANLYS-02 | 조합 점수가 0-100 범위로 정규화되어 표시된다 | 100-point deduction formula; `calculateScore()` pure function in new `lib/scoring.ts` |
| ANLYS-03 | 10개 카테고리별 커버리지 현황이 시각화된다 | `buildCoverage()` maps all 10 `PluginCategory` values against selected plugins; returns covered/uncovered arrays for Phase 7 UI |
| RECOM-01 | 빠진 카테고리/기능의 보완 플러그인이 제안된다 (설치된 것 제외) | `buildComplements()` iterates uncovered categories, filters installed IDs, ranks by `getTrustScore` equivalent logic |
| RECOM-02 | deprecated/unverified 플러그인의 더 나은 대안이 제시된다 | `buildReplacements()` checks `verificationStatus` for each selected plugin, finds best same-category verified alternative |
</phase_requirements>

## Summary

Phase 6 implements a pure client-side scoring engine as a single new module (`lib/scoring.ts`) that consumes `OptimizerInputPlugin[]` from Phase 5 and produces a `ScoringResult` for Phase 7 UI consumption. No API routes, no server-side code, no new dependencies.

All required primitives already exist in the codebase. `lib/conflicts.ts` provides `getConflicts()` and `getRedundancies()` ready to call. `lib/plugins.ts` exposes the `PLUGINS` record with `category` and `verificationStatus` on every plugin. `lib/recommend.ts` exposes `getTrustScore()` (not exported — must be replicated or the logic inlined). `lib/types.ts` defines all 10 `PluginCategory` values and the `Plugin` type.

The scoring formula is a 100-point deduction model: start at 100, subtract for conflicts, redundancies, and uncovered categories. Deduction weights are Claude's discretion. The result type must carry all five pieces of data that requirements ANLYS-01 through RECOM-02 need: conflicts list, redundancies list, numeric score, coverage map, complement suggestions, and replacement suggestions. The existing `AnalysisResult` type in `lib/types.ts` is for the `/advisor` flow and must NOT be reused — a new `ScoringResult` type is needed.

**Primary recommendation:** Create `lib/scoring.ts` exporting a single `scorePlugins(ids: string[]): ScoringResult` entry-point plus helper functions, and add `ScoringResult` + related types to `lib/types.ts`.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | Project-level | All logic typed | Project convention |
| Vitest | Project-level | Unit tests | Existing test framework (`vitest.config.ts` confirmed) |

### No New Dependencies
This phase adds zero npm packages. All logic is pure TypeScript over existing in-memory data.

### Reused Internal Modules
| Module | Export | How Used |
|--------|--------|----------|
| `lib/conflicts.ts` | `getConflicts(ids)`, `getRedundancies(ids)` | Direct call; returns `ConflictWarning[]` and `RedundancyGroup[]` |
| `lib/plugins.ts` | `PLUGINS` | Lookup plugin metadata (category, verificationStatus, difficulty, maintenanceStatus) |
| `lib/types.ts` | `PluginCategory`, `Plugin`, `ConflictWarning` | Type imports |

### getTrustScore — Not Exported, Must Replicate

`getTrustScore()` in `lib/recommend.ts` is not exported. For the scoring engine's complement ranking, a simpler version is sufficient:

```typescript
// Confidence: HIGH — derived from reading lib/recommend.ts lines 226-247
function rankForComplement(plugin: Plugin): number {
  let score = 0;
  if (plugin.verificationStatus === "verified") score += 4;
  if (plugin.verificationStatus === "partial") score += 1;
  if (plugin.verificationStatus === "unverified") score -= 4;
  if (plugin.difficulty === "beginner") score += 3;
  if (plugin.difficulty === "advanced") score -= 2;
  if (plugin.maintenanceStatus === "stale") score -= 3;
  if (plugin.maintenanceStatus === "unclear") score -= 2;
  return score;
}
```

**Alternative:** Export `getTrustScore` from `lib/recommend.ts` to avoid duplication. This is a one-line change and avoids two implementations diverging.

## Architecture Patterns

### Recommended Project Structure

New files in this phase:

```
lib/
├── scoring.ts          # New: ScoringResult type + all scoring logic
lib/__tests__/
├── scoring.test.ts     # New: unit tests for scorePlugins()
```

No new components — Phase 7 handles UI. No API routes — pure client-side.

### Pattern 1: Single Entry-Point Pure Function

**What:** One exported function `scorePlugins(ids: string[]): ScoringResult` that orchestrates all sub-calculations. Sub-functions are module-private or named exports for testability.

**When to use:** When consumers (Phase 7 `OptimizerApp`) need a single call and all logic is deterministic given the same input.

```typescript
// lib/scoring.ts
import { PLUGINS } from "./plugins";
import { getConflicts, getRedundancies } from "./conflicts";
import type { PluginCategory, Plugin } from "./types";

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
  score: number | null;         // null when empty === true
  conflicts: ConflictWarning[];
  redundancies: RedundancyGroup[];
  coverage: CoverageResult;
  complements: ComplementSuggestion[];
  replacements: ReplacementSuggestion[];
};

export function scorePlugins(ids: string[]): ScoringResult { ... }
```

### Pattern 2: Deduction Scoring Formula

**What:** Start at 100, apply ordered deductions, clamp to [0, 100].

**Recommended weight distribution (Claude's discretion):**

| Deduction Event | Points Lost | Rationale |
|-----------------|-------------|-----------|
| Each conflict pair | -20 | Strong signal, locked decision: -15~20 |
| Each redundancy group | -7 | Moderate, locked decision: -5~8 |
| Each uncovered category | -7 | 10 cats × 7 = 70 max; leaves room for conflict/redundancy penalties |

With 10 categories at -7 each: a combination with zero issues but only 3 categories covered loses 49 points → score of 51. A combination covering all 10 categories with one conflict loses 20 → score of 80. This feels intuitive.

**Clamping is required:** `Math.max(0, Math.min(100, rawScore))`.

```typescript
// Source: derived from CONTEXT.md locked decisions
function calculateScore(
  conflicts: ConflictWarning[],
  redundancies: RedundancyGroup[],
  uncoveredCount: number
): number {
  const raw =
    100 -
    conflicts.length * 20 -
    redundancies.length * 7 -
    uncoveredCount * 7;
  return Math.max(0, Math.min(100, raw));
}
```

### Pattern 3: Coverage Calculation

**What:** Check which of the 10 `PluginCategory` values appear in the selected plugins. Return covered and uncovered arrays.

```typescript
const ALL_CATEGORIES: PluginCategory[] = [
  "orchestration", "workflow", "code-quality", "testing",
  "documentation", "data", "security", "integration", "ui-ux", "devops",
];

function buildCoverage(ids: string[]): CoverageResult {
  const coveredSet = new Set(
    ids.map((id) => PLUGINS[id]?.category).filter(Boolean)
  );
  return {
    covered: ALL_CATEGORIES.filter((c) => coveredSet.has(c)),
    uncovered: ALL_CATEGORIES.filter((c) => !coveredSet.has(c)),
  };
}
```

### Pattern 4: Complement Suggestions (RECOM-01)

**What:** For each uncovered category, find the best plugin not already installed.

**Critical constraint from STATE.md:** Filter out installedIds to prevent recommending already-installed plugins.

```typescript
function buildComplements(
  uncoveredCategories: PluginCategory[],
  installedIds: string[]
): ComplementSuggestion[] {
  const installedSet = new Set(installedIds);
  return uncoveredCategories
    .map((category) => {
      const candidate = Object.values(PLUGINS)
        .filter((p) => p.category === category && !installedSet.has(p.id))
        .sort((a, b) => rankForComplement(b) - rankForComplement(a))[0];
      return candidate
        ? { pluginId: candidate.id, forCategory: category }
        : null;
    })
    .filter((s): s is ComplementSuggestion => s !== null);
}
```

### Pattern 5: Replacement Suggestions (RECOM-02)

**What:** For each selected plugin that is `unverified`, `partial`, or deprecated, find the best same-category `verified` alternative.

**Note on "deprecated":** The `Plugin` type in `lib/types.ts` does not have a `deprecated` field. The `maintenanceStatus` field uses `"active" | "unclear" | "stale"`. The CONTEXT.md uses "deprecated" as a reason label in `ReplacementSuggestion.reason`, but the trigger condition should be `verificationStatus === "unverified" | "partial"` plus `maintenanceStatus === "stale"`. This is a gap to resolve in planning.

```typescript
function buildReplacements(
  installedIds: string[]
): ReplacementSuggestion[] {
  return installedIds
    .map((id) => {
      const plugin = PLUGINS[id];
      if (!plugin) return null;

      const isUnverified = plugin.verificationStatus === "unverified";
      const isPartial = plugin.verificationStatus === "partial";
      const isStale = plugin.maintenanceStatus === "stale";

      if (!isUnverified && !isPartial && !isStale) return null;

      const reason: ReplacementSuggestion["reason"] = isUnverified
        ? "unverified"
        : isPartial
          ? "partial"
          : "deprecated";

      const replacement = Object.values(PLUGINS)
        .filter(
          (p) =>
            p.category === plugin.category &&
            p.id !== id &&
            p.verificationStatus === "verified"
        )
        .sort((a, b) => rankForComplement(b) - rankForComplement(a))[0];

      return {
        original: id,
        reason,
        replacement: replacement?.id ?? null,
      };
    })
    .filter((r): r is ReplacementSuggestion => r !== null);
}
```

### Anti-Patterns to Avoid

- **Referencing `plugin.conflicts[]` directly:** Use `getConflicts()` exclusively. This is a carry-forward constraint from STATE.md — the field exists on the Plugin type but the function is the single source of truth for conflict pairs.
- **Reusing `AnalysisResult` from lib/types.ts:** That type is for the `/advisor` keyword-matching flow. Reusing it would couple unrelated features and cause confusion.
- **Floating-point score display:** Score should be `Math.round()` before storing in `ScoringResult` — avoid "73.5714..." in the UI.
- **Recommending installed plugins as complements:** Always filter `installedIds` in `buildComplements()`.
- **Running replacement logic when verificationStatus is "verified" and maintenanceStatus is "active":** Short-circuit early to avoid unnecessary iterations.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Conflict detection | Custom conflict loop | `getConflicts(ids)` from `lib/conflicts.ts` | Already handles all 3 conflict pairs with correct messages |
| Redundancy detection | Custom redundancy loop | `getRedundancies(ids)` from `lib/conflicts.ts` | Already handles all 3 redundancy groups |
| Plugin lookup | Array scan | `PLUGINS[id]` direct key access | O(1) vs O(n); PLUGINS is a keyed Record |
| Category enumeration | Hardcoded string array elsewhere | Import `PluginCategory` from `lib/types.ts` and define `ALL_CATEGORIES` once in `lib/scoring.ts` | Single source of truth |

**Key insight:** The scoring engine is pure orchestration over existing primitives. The only new logic is the deduction formula, the coverage map, and the ranking functions.

## Common Pitfalls

### Pitfall 1: Missing the installedIds Filter in buildComplements
**What goes wrong:** `buildComplements` suggests plugins already in the user's combination.
**Why it happens:** Iterating all plugins in a category without excluding the current selection.
**How to avoid:** Pass `installedIds` explicitly into `buildComplements` and filter before ranking.
**Warning signs:** A test with a full-category selection still returns a complement suggestion.

### Pitfall 2: "deprecated" Field Does Not Exist on Plugin Type
**What goes wrong:** Code checks `plugin.deprecated` which is `undefined` always — no plugins are flagged for RECOM-02.
**Why it happens:** CONTEXT.md uses "deprecated" as a reason label but the Plugin schema uses `maintenanceStatus: "stale"` for the same concept.
**How to avoid:** Map `maintenanceStatus === "stale"` → reason `"deprecated"` in `buildReplacements`. Do not add a new field to the Plugin type.
**Warning signs:** Zero replacement suggestions even for known stale plugins.

### Pitfall 3: Score Goes Below 0
**What goes wrong:** With many conflicts + many redundancies + low coverage, raw deduction exceeds 100.
**Why it happens:** No clamping applied.
**How to avoid:** Always wrap with `Math.max(0, Math.min(100, rawScore))`.
**Warning signs:** Score value appears negative in Phase 7 UI.

### Pitfall 4: All 10 Categories Flagged as Uncovered for 0-Plugin Input
**What goes wrong:** Empty input runs through scoring and returns score 30 (100 - 10×7) with 10 uncovered categories, instead of the "add plugins" empty state.
**Why it happens:** The empty guard is missing.
**How to avoid:** Check `ids.length === 0` at top of `scorePlugins()` and return `{ empty: true, score: null, ... }` immediately.
**Warning signs:** Phase 7 UI renders a score panel with score 30 when no plugins are selected.

### Pitfall 5: Partial-Status Plugins Always Triggering Replacement
**What goes wrong:** The CONTEXT.md says `partial` triggers replacement, but many plugins in `lib/plugins.ts` default to `verificationStatus: "partial"` (the `DEFAULT_PLUGIN_FIELDS` default). This could make RECOM-02 extremely noisy — nearly every combination triggers replacements.
**Why it happens:** `DEFAULT_PLUGIN_FIELDS` sets `verificationStatus: "partial"` for all plugins without explicit overrides.
**How to avoid:** Consider whether `partial` should trigger replacement or only `unverified` + `stale`. At minimum, ensure the replacement exists before surfacing it (`replacement !== null` filter for display, per CONTEXT.md rule). The planner should decide the noise threshold.
**Warning signs:** A 3-plugin selection generates 3 replacement suggestions for all plugins.

## Code Examples

### Full scorePlugins Entry-Point Shape

```typescript
// lib/scoring.ts — complete public API shape
import { PLUGINS } from "./plugins";
import { getConflicts, getRedundancies } from "./conflicts";
import type { PluginCategory, Plugin, ConflictWarning } from "./types";
import type { RedundancyGroup } from "./conflicts";

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
};

export function scorePlugins(ids: string[]): ScoringResult {
  if (ids.length === 0) {
    return {
      empty: true,
      score: null,
      conflicts: [],
      redundancies: [],
      coverage: { covered: [], uncovered: [...ALL_CATEGORIES] },
      complements: [],
      replacements: [],
    };
  }
  const conflicts = getConflicts(ids);
  const redundancies = getRedundancies(ids);
  const coverage = buildCoverage(ids);
  const score = calculateScore(conflicts, redundancies, coverage.uncovered.length);
  const complements = buildComplements(coverage.uncovered, ids);
  const replacements = buildReplacements(ids);
  return { empty: false, score, conflicts, redundancies, coverage, complements, replacements };
}
```

### Test Pattern (matching existing conventions)

```typescript
// lib/__tests__/scoring.test.ts
import { describe, it, expect } from "vitest";
import { scorePlugins } from "../scoring";

describe("scorePlugins()", () => {
  it("returns empty:true and score:null for empty input", () => {
    const result = scorePlugins([]);
    expect(result.empty).toBe(true);
    expect(result.score).toBeNull();
  });

  it("returns score between 0 and 100", () => {
    const result = scorePlugins(["context7", "playwright"]);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("detects omc+superpowers conflict and reduces score", () => {
    const clean = scorePlugins(["context7"]);
    const conflicted = scorePlugins(["omc", "superpowers"]);
    expect(conflicted.conflicts.length).toBeGreaterThan(0);
    expect(conflicted.score!).toBeLessThan(clean.score!);
  });

  it("does not include installed plugins in complements", () => {
    const result = scorePlugins(["context7"]);
    const complementIds = result.complements.map((c) => c.pluginId);
    expect(complementIds).not.toContain("context7");
  });
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `AnalysisResult.complements` field (partial, for /advisor) | New `ScoringResult` type dedicated to optimizer | Phase 6 | Clean separation of advisor vs optimizer data models |
| `plugin.conflicts[]` direct access | `getConflicts()` via `lib/conflicts.ts` | Phase pre-existing convention | Single source of truth for conflict pairs |

**Deprecated/outdated:**
- `AnalysisResult.complements` and `AnalysisResult.redundancies` fields: defined in `lib/types.ts` but unused. Do not populate these for the optimizer — use `ScoringResult` instead.

## Open Questions

1. **Should `partial` verificationStatus trigger a replacement suggestion?**
   - What we know: CONTEXT.md says yes; but `DEFAULT_PLUGIN_FIELDS` defaults every plugin to `partial`, making this very noisy.
   - What's unclear: Whether the intent is "flag all partial" or "flag only explicitly-partial overrides."
   - Recommendation: Planner should decide the threshold. Safest option: only `unverified` and `stale` trigger replacement by default; `partial` is a stretch goal.

2. **Should `getTrustScore` be exported from `lib/recommend.ts` or replicated?**
   - What we know: The function exists at lines 226-247 of `lib/recommend.ts` and is not exported.
   - What's unclear: Whether adding an export creates unwanted coupling between the recommend and scoring modules.
   - Recommendation: Export it. Single implementation is better than two diverging copies. The function is pure and has no side effects.

3. **Score weight calibration**
   - What we know: Locked decisions say conflicts -15~20, redundancies -5~8, coverage is "핵심 요소."
   - What's unclear: Exact numbers are Claude's discretion. The recommended weights above (conflicts -20, redundancies -7, coverage -7/cat) are a starting point.
   - Recommendation: Document the chosen values as named constants in `lib/scoring.ts` so they are easy to tune.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (vitest.config.ts confirmed) |
| Config file | `vitest.config.ts` — root-level, node environment, `@` alias configured |
| Quick run command | `pnpm test --reporter=verbose lib/__tests__/scoring.test.ts` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ANLYS-01 | Conflict pair detected, included in result | unit | `pnpm test lib/__tests__/scoring.test.ts` | ❌ Wave 0 |
| ANLYS-02 | Score is 0-100 integer, changes when plugins added/removed | unit | `pnpm test lib/__tests__/scoring.test.ts` | ❌ Wave 0 |
| ANLYS-03 | Coverage returns covered + uncovered arrays covering all 10 categories | unit | `pnpm test lib/__tests__/scoring.test.ts` | ❌ Wave 0 |
| RECOM-01 | Complements exclude already-installed plugins, one per uncovered category | unit | `pnpm test lib/__tests__/scoring.test.ts` | ❌ Wave 0 |
| RECOM-02 | Replacements returned for unverified/stale plugins with same-category verified alternatives | unit | `pnpm test lib/__tests__/scoring.test.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test lib/__tests__/scoring.test.ts`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `lib/__tests__/scoring.test.ts` — covers ANLYS-01, ANLYS-02, ANLYS-03, RECOM-01, RECOM-02
- [ ] `lib/scoring.ts` — the module under test (must exist before tests can run)

## Sources

### Primary (HIGH confidence)
- Direct read of `lib/conflicts.ts` — `getConflicts()`, `getRedundancies()`, `CONFLICT_PAIRS`, `REDUNDANCY_GROUPS` shapes verified
- Direct read of `lib/types.ts` — `PluginCategory` union (10 values), `Plugin` type, `OptimizerInputPlugin` type, `ConflictWarning` type verified
- Direct read of `lib/plugins.ts` — `DEFAULT_PLUGIN_FIELDS` confirms `verificationStatus: "partial"` default; `PLUGIN_FIELD_OVERRIDES` shows which plugins have explicit overrides
- Direct read of `lib/recommend.ts` — `getTrustScore()` implementation at lines 226-247 verified; not exported
- Direct read of `components/OptimizerApp.tsx` — Phase 5 entry point; `selectedPlugins: Plugin[]` state; `Analyze` button present but not yet wired
- Direct read of `vitest.config.ts` — node environment, `@` alias to project root
- Direct read of `.planning/config.json` — `workflow.research: true`; `nyquist_validation` key absent → treated as enabled

### Secondary (MEDIUM confidence)
- CONTEXT.md decisions and code_context sections — authored by user + Claude during discuss-phase session
- STATE.md carry-forward research findings — `getConflicts()` exclusivity rule, `buildComplements` filter rule

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero new dependencies; all reused modules read directly
- Architecture: HIGH — pure function pattern matches existing `lib/recommend.ts` and `lib/parse-mcp-list.ts` conventions
- Pitfalls: HIGH — identified from direct code reading (DEFAULT_PLUGIN_FIELDS default, missing filter bug, clamping)
- Score weights: MEDIUM — Claude's discretion per CONTEXT.md; recommended values are defensible but not validated against real user data

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (stable domain — no external dependencies)
