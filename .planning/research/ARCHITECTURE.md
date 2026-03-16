# Architecture Research

**Domain:** Plugin combination optimizer — additive feature milestone on existing Next.js 14 App Router app
**Researched:** 2026-03-16
**Confidence:** HIGH (based on direct codebase analysis)

---

## Standard Architecture

### System Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                         Pages (App Router)                          │
│  ┌──────────────┐  ┌─────────────────────┐  ┌───────────────────┐  │
│  │  /advisor    │  │  /optimizer  (NEW)  │  │  /plugins  /admin │  │
│  │  (existing)  │  │                     │  │  (existing)       │  │
│  └──────┬───────┘  └──────────┬──────────┘  └───────────────────┘  │
├─────────┼────────────────────-┼────────────────────────────────────┤
│         │    Client Components│& Hooks                              │
│  ┌──────┴──────────┐  ┌───────┴──────────────────────────────────┐  │
│  │ PluginAdvisorApp│  │ OptimizerApp (NEW)                       │  │
│  │ useAnalysis     │  │ useOptimizer (NEW)                       │  │
│  └──────┬──────────┘  └───────┬──────────────────────────────────┘  │
├─────────┼─────────────────────┼────────────────────────────────────┤
│         │     lib/ (pure functions — no I/O)                        │
│  ┌──────┴────┐  ┌─────────────┴───────────┐  ┌──────────────────┐  │
│  │recommend  │  │ optimize (NEW)           │  │ conflicts        │  │
│  │           │  │ parseMcpList (NEW)       │  │ (extended)       │  │
│  └───────────┘  └─────────────────────────┘  └──────────────────┘  │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────────────────┐ │
│  │ plugins    │  │ setup        │  │ types (extended)             │ │
│  │ (static DB)│  │              │  │                              │ │
│  └────────────┘  └──────────────┘  └──────────────────────────────┘ │
├───────────────────────────────────────────────────────────────────- ┤
│                    Data Layer                                        │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐ │
│  │ PLUGINS (static, lib/plugins)│  │ Supabase (suggestions/admin) │ │
│  └──────────────────────────────┘  └──────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | New vs Existing |
|-----------|---------------|-----------------|
| `app/optimizer/page.tsx` | Route shell, server component wrapper | NEW |
| `components/OptimizerApp.tsx` | Client orchestrator — input, analysis, results state | NEW |
| `hooks/useOptimizer.ts` | Step state machine (input → analyzing → result) + toggle | NEW |
| `lib/optimize.ts` | Combo scoring, complement logic, alternative suggestions | NEW |
| `lib/parseMcpList.ts` | Parse `claude mcp list` text output into plugin ID list | NEW |
| `components/McpListInput.tsx` | Textarea for paste + autocomplete for manual add | NEW |
| `components/ComboScoreCard.tsx` | Visual score display (conflict penalty, synergy, coverage) | NEW |
| `components/ComplementPanel.tsx` | "Add this" suggestions with reason text | NEW |
| `components/AlternativePanel.tsx` | "Replace X with Y" suggestions with reason | NEW |
| `lib/conflicts.ts` | `getConflicts`, `getRedundancies` — already exists | EXISTING (reuse as-is) |
| `lib/plugins.ts` + `lib/types.ts` | Plugin DB and type definitions | EXISTING (extend types only) |
| `components/ConflictWarning.tsx` | Conflict display card | EXISTING (reuse as-is) |
| `lib/analytics.ts` | Event tracking — add new event names | EXISTING (extend event union) |

---

## Recommended Project Structure

```
app/
├── optimizer/
│   └── page.tsx                  # Route shell (server component)
components/
├── OptimizerApp.tsx              # Client orchestrator (mirrors PluginAdvisorApp.tsx)
├── McpListInput.tsx              # Paste textarea + autocomplete input
├── ComboScoreCard.tsx            # Score breakdown display
├── ComplementPanel.tsx           # "Add these" recommendations
├── AlternativePanel.tsx          # "Replace X with Y" recommendations
├── ConflictWarning.tsx           # REUSE — already handles ConflictWarning[]
hooks/
├── useAnalysis.ts                # EXISTING — no changes needed
└── useOptimizer.ts               # NEW — step state + plugin list management
lib/
├── optimize.ts                   # NEW — pure scoring/analysis functions
├── parseMcpList.ts               # NEW — text parser for `claude mcp list`
├── conflicts.ts                  # EXISTING — reuse getConflicts/getRedundancies
├── plugins.ts                    # EXISTING — no changes
├── types.ts                      # EXTEND — add OptimizerResult type
└── analytics.ts                  # EXTEND — add optimizer event names
```

### Structure Rationale

- **`app/optimizer/` as a new route:** The optimizer has a distinct purpose from `/advisor` (analyze existing combo vs. get first recommendation). Separate page is the right call per the PROJECT.md decision log.
- **`OptimizerApp.tsx` mirrors `PluginAdvisorApp.tsx`:** The same step-based pattern (input → analyzing → result) fits the optimizer flow. Copy the pattern, do not merge the two components — their state shapes will diverge.
- **`lib/optimize.ts` as pure functions:** All scoring logic stays in `lib/` with no React imports, same as `lib/recommend.ts`. This makes it directly unit-testable with Vitest.
- **`lib/parseMcpList.ts` is a separate file:** The parser has a single responsibility and is testable in isolation. Do not inline it into the component.

---

## Architectural Patterns

### Pattern 1: Pure lib functions — no React, no I/O

**What:** All scoring and analysis logic lives in `lib/` as pure TypeScript functions. Components call them; they do not call components.

**When to use:** All of `optimize.ts` and `parseMcpList.ts` must follow this pattern.

**Trade-offs:** Slightly more wiring in hooks, but every function is trivially unit-testable and reusable from both client and any future API route.

**Example:**
```typescript
// lib/optimize.ts
export function scoreCombo(pluginIds: string[]): OptimizerResult {
  const conflicts = getConflicts(pluginIds);       // reuse existing
  const redundancies = getRedundancies(pluginIds); // reuse existing
  const conflictPenalty = conflicts.length * -15;
  const coverageScore = computeCoverageScore(pluginIds);
  const synergyScore = computeSynergyScore(pluginIds);
  const total = Math.max(0, Math.min(100, 50 + coverageScore + synergyScore + conflictPenalty));
  return { total, conflictPenalty, coverageScore, synergyScore, conflicts, redundancies, complements, alternatives };
}
```

### Pattern 2: Step-based state in a custom hook

**What:** The optimizer page UI has three states — `input`, `analyzing`, `result`. All state lives in `useOptimizer`, not in the component. The component only renders based on step.

**When to use:** Mirrors `useAnalysis.ts` exactly. Use the same pattern.

**Trade-offs:** Hook is slightly more complex than local state, but it enables history restoration and keeps the component clean.

**Example:**
```typescript
// hooks/useOptimizer.ts
type Step = "input" | "analyzing" | "result";

export function useOptimizer() {
  const [step, setStep] = useState<Step>("input");
  const [pluginIds, setPluginIds] = useState<string[]>([]);
  const [result, setResult] = useState<OptimizerResult | null>(null);

  const handleAnalyze = useCallback((ids: string[]) => {
    setStep("analyzing");
    // setTimeout 500ms for UX (matches useAnalysis pattern)
    setTimeout(() => {
      setResult(scoreCombo(ids));
      setStep("result");
    }, 500);
  }, []);

  return { step, pluginIds, setPluginIds, result, handleAnalyze, reset };
}
```

### Pattern 3: `claude mcp list` text parsing

**What:** `claude mcp list` outputs a table or list format. The parser extracts plugin names and fuzzy-matches them to known plugin IDs in `PLUGINS`.

**When to use:** `parseMcpList.ts` — called from `useOptimizer` when the user submits paste input.

**Trade-offs:** Fuzzy matching needed because MCP names (e.g. `context7`, `@upstash/context7-mcp`) may differ from internal plugin IDs. Keep the matcher simple — exact match first, then substring fallback, then return unrecognized list for manual review.

**Example:**
```typescript
// lib/parseMcpList.ts
export type ParseResult = {
  recognized: string[];   // plugin IDs found in PLUGINS
  unrecognized: string[]; // names that didn't match any plugin
};

export function parseMcpList(raw: string): ParseResult {
  // Split on newlines, strip table formatting, extract server names
  // Match against Object.keys(PLUGINS) and known aliases
}
```

---

## Data Flow

### Optimizer Request Flow

```
User pastes `claude mcp list` output (or types plugin names)
    ↓
McpListInput → calls parseMcpList(raw) → { recognized, unrecognized }
    ↓
useOptimizer.handleAnalyze(recognized)
    ↓
setStep("analyzing") + setTimeout 500ms (UX delay, matches /advisor)
    ↓
scoreCombo(pluginIds)
    → getConflicts(pluginIds)      [reuse lib/conflicts.ts]
    → getRedundancies(pluginIds)   [reuse lib/conflicts.ts]
    → computeCoverageScore(pluginIds)
    → computeSynergyScore(pluginIds)
    → buildComplements(pluginIds)  [gap analysis vs PLUGINS]
    → buildAlternatives(pluginIds) [quality substitution rules]
    ↓
setResult(OptimizerResult) + setStep("result")
    ↓
OptimizerApp renders:
    ComboScoreCard   ← result.total, breakdown
    ConflictWarning  ← result.conflicts  [REUSE existing component]
    ComplementPanel  ← result.complements
    AlternativePanel ← result.alternatives
```

### State Management

```
useOptimizer (hook state)
    ↓ (drives rendering)
OptimizerApp ← step, result, pluginIds
    ↓ (user actions)
McpListInput.onSubmit → handleAnalyze(ids)
PluginChip.onRemove  → removePlugin(id)
```

### Key Data Flows

1. **Conflict detection:** `scoreCombo` calls `getConflicts(pluginIds)` from existing `lib/conflicts.ts`. The `ConflictWarning` component accepts the returned `ConflictWarning[]` — no changes to either module needed.

2. **Complement recommendations:** `buildComplements` iterates `PLUGINS`, checks which categories are not covered by the input set, and returns the highest-trust uninstalled plugin per missing category. Uses `plugin.bestFor`, `plugin.category`, `plugin.verificationStatus` already on the `Plugin` type.

3. **Alternative recommendations:** `buildAlternatives` uses `CONFLICT_PAIRS` and `REDUNDANCY_GROUPS` from `lib/conflicts.ts` plus quality heuristics (`verificationStatus`, `maintenanceStatus`) to suggest swapping lower-quality plugins for better equivalents.

---

## Integration Points

### New types needed in `lib/types.ts`

```typescript
export type OptimizerResult = {
  total: number;                    // 0-100 combo score
  conflictPenalty: number;          // negative, e.g. -15 per conflict
  coverageScore: number;            // +points for category breadth
  synergyScore: number;             // +points for known good combos
  conflicts: ConflictWarning[];     // reuse existing type
  redundancies: RedundancyGroup[];  // reuse existing type from conflicts.ts
  complements: Array<{ pluginId: string; reason: string; reasonEn: string }>;
  alternatives: Array<{ fromId: string; toId: string; reason: string; reasonEn: string }>;
  unrecognizedNames: string[];      // names from paste that didn't match
};
```

### Existing modules — reuse without modification

| Module | What the optimizer uses |
|--------|------------------------|
| `lib/conflicts.ts` | `getConflicts()`, `getRedundancies()`, `CONFLICT_PAIRS`, `REDUNDANCY_GROUPS` |
| `lib/plugins.ts` | `PLUGINS` record — read-only |
| `lib/types.ts` | `Plugin`, `ConflictWarning` — extend only (add `OptimizerResult`) |
| `components/ConflictWarning.tsx` | Render conflict cards — pass `result.conflicts` directly |
| `lib/analytics.ts` | Add `optimizer_analyze_start`, `optimizer_analyze_complete`, `optimizer_mcp_paste` to `EventName` union |

### Existing modules — do NOT touch

| Module | Reason |
|--------|--------|
| `lib/recommend.ts` | Separate concern — advisor scoring. No shared state. |
| `hooks/useAnalysis.ts` | Advisor-specific. Optimizer gets its own `useOptimizer`. |
| `components/PluginAdvisorApp.tsx` | No cross-feature coupling needed. |
| `lib/plugins.ts` (data) | Static DB — read only. No writes from optimizer. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `OptimizerApp` ↔ `useOptimizer` | Hook return values + callbacks | Same pattern as PluginAdvisorApp/useAnalysis |
| `useOptimizer` ↔ `lib/optimize.ts` | Direct function call (no API route — all client-side) | Scoring is pure/synchronous; no network needed |
| `lib/optimize.ts` ↔ `lib/conflicts.ts` | Direct import | optimize.ts depends on conflicts.ts, not vice versa |
| `lib/parseMcpList.ts` ↔ `lib/plugins.ts` | Direct import of `PLUGINS` for ID matching | Parser is a pure read of the static DB |

---

## Build Order

The dependency graph dictates this sequence:

1. **`lib/types.ts` extension** — Add `OptimizerResult`. No other changes. Unblocks everything downstream.

2. **`lib/parseMcpList.ts`** — Pure function, no deps except `lib/plugins.ts` (already exists). Write tests first.

3. **`lib/optimize.ts`** — Pure functions. Depends on `lib/conflicts.ts` (exists), `lib/plugins.ts` (exists), new types (step 1). Write tests first.

4. **`hooks/useOptimizer.ts`** — Depends on `lib/optimize.ts` (step 3) and `lib/parseMcpList.ts` (step 2).

5. **`components/McpListInput.tsx`** — UI only. Depends on `lib/plugins.ts` for autocomplete list.

6. **`components/ComboScoreCard.tsx`** — Depends on `OptimizerResult` type (step 1).

7. **`components/ComplementPanel.tsx`** and **`components/AlternativePanel.tsx`** — Depend on `OptimizerResult` type (step 1).

8. **`components/OptimizerApp.tsx`** — Assembles steps 4-7. Reuses `ConflictWarning` from existing components.

9. **`app/optimizer/page.tsx`** — Route shell wrapping `OptimizerApp`. Last step.

10. **Nav link update** — Add `/optimizer` to `components/Nav.tsx`.

11. **`lib/analytics.ts` extension** — Add new event names. Can be done at any point.

---

## Anti-Patterns

### Anti-Pattern 1: Merging optimizer state into `useAnalysis`

**What people do:** Add `optimizerResult` and `pluginIds` state into the existing `useAnalysis` hook to avoid creating a new hook.

**Why it's wrong:** `useAnalysis` owns the text input → recommendation flow. The optimizer flow is input list → score. They have different step machines, different inputs, different outputs. Merging them creates a god hook with contradictory state.

**Do this instead:** Create `useOptimizer` as a separate hook. It takes 10 minutes and keeps both hooks understandable.

### Anti-Pattern 2: Calling `recommend()` inside the optimizer

**What people do:** Run `recommend()` on each plugin name to "validate" or "score" them individually.

**Why it's wrong:** `recommend()` is designed for free-text input → ranked suggestions. It is not a per-plugin scorer. Using it in the optimizer produces nonsensical results because it returns preset-weighted recommendations, not combo quality.

**Do this instead:** Use `getConflicts()`, `getRedundancies()` from `lib/conflicts.ts` and the new `scoreCombo()` in `lib/optimize.ts`.

### Anti-Pattern 3: Creating an API route for combo scoring

**What people do:** Add `/api/optimize` because the advisor uses `/api/analyze`.

**Why it's wrong:** The optimizer (v1.1) is rules-based and synchronous. All the data it needs is already in `PLUGINS` which is a client-available static import. An API route adds latency, a network hop, and Vercel function cold-start risk with zero benefit.

**Do this instead:** Call `scoreCombo()` directly in `useOptimizer`. If AI analysis is added later (v1.2+), add the API route at that point.

### Anti-Pattern 4: Fuzzy-matching all unrecognized plugin names silently

**What people do:** Silently drop names from `claude mcp list` that don't match known plugin IDs.

**Why it's wrong:** Users expect to see what was recognized and what wasn't. Silent drops erode trust in the tool.

**Do this instead:** `parseMcpList` returns `{ recognized, unrecognized }`. Render `unrecognized` names in the UI as a callout: "These were not matched to known plugins."

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current (static DB, client-side scoring) | No changes — all logic runs in the browser, no server load |
| When adding AI analysis mode (v1.2+) | Add `/api/optimize` route at that point. Pass recognized IDs + context, receive enriched reasons. Pattern already established by `/api/analyze`. |
| When adding user-saved combos | Add Supabase table (pattern already established by plugin-suggestions). No architecture change needed. |

---

## Sources

- Direct codebase analysis: `lib/recommend.ts`, `lib/conflicts.ts`, `lib/plugins.ts`, `lib/types.ts`, `lib/setup.ts`, `hooks/useAnalysis.ts`, `components/PluginAdvisorApp.tsx`, `components/ConflictWarning.tsx`
- Project decisions: `.planning/PROJECT.md` (v1.1 milestone, key decisions table)
- Confidence: HIGH — all findings are based on reading the actual source files, not inference

---
*Architecture research for: Plugin Optimizer — v1.1 milestone integration*
*Researched: 2026-03-16*
