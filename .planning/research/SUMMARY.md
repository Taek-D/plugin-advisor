# Project Research Summary

**Project:** Plugin Advisor — v1.1 Plugin Optimizer
**Domain:** Plugin combination analyzer / optimizer (Claude Code MCP plugin set)
**Researched:** 2026-03-16
**Confidence:** HIGH

## Executive Summary

The v1.1 milestone adds a `/optimizer` page to an already-shipped Next.js 14 app. The optimizer is an additive feature — it does not replace the existing `/advisor` flow but gives users who already have plugins installed a way to analyze their current set for conflicts, coverage gaps, and upgrade opportunities. Research confirms this is a rules-based, fully client-side feature: all the data it needs (42-plugin DB, conflict pairs, redundancy groups, preset packs) already lives in the codebase's `lib/` layer. No new API routes, no backend changes, no external data dependencies are required for v1.1.

The recommended implementation approach is to mirror the existing `/advisor` pattern precisely: a new `app/optimizer/page.tsx` route, a `useOptimizer` hook that owns step-based state (`input → analyzing → result`), and pure functions in `lib/optimize.ts` and `lib/parseMcpList.ts` that are directly unit-testable with Vitest. The six new files + two type extensions needed are small, well-bounded, and have clear ownership. The highest-risk step is the `claude mcp list` text parser — the output format is undocumented and varies across Claude Code versions, so it requires defensive parsing and explicit unit tests.

The two risks to manage are (1) the MCP list parser silently dropping unrecognized plugins and eroding user trust, and (2) score normalization being deferred until the raw integer scores are already in production and hard to change. Both are addressable in the first implementation sprint if the team treats them as build criteria rather than polish items.

## Key Findings

### Recommended Stack

The existing stack is the correct stack. No new dependencies are needed for v1.1. The codebase already runs Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Vitest, and Supabase. The optimizer uses zero Supabase (all static data), zero new API routes (all client-side scoring), and no additional npm packages beyond what is already installed.

The one optional addition worth considering: **Fuse.js** (already listed as a candidate in the features research) for fuzzy plugin-name matching in the autocomplete input. It is a small library and the project already does keyword fuzzy matching, so it would not be a novel dependency. Without it, the fallback is a simple substring + normalization approach in `parseMcpList.ts`.

**Core technologies (existing, no changes):**
- Next.js 14 App Router: routing, server components for page shells — required, already deployed
- TypeScript: all new files must be typed; `OptimizerResult` type is the key new addition
- Tailwind CSS + shadcn/ui: `Command` component for autocomplete input; `Card` for score display — already in project
- Vitest: unit tests for `parseMcpList.ts` and `lib/optimize.ts` — same test runner already configured
- Vercel: deployment target, no changes needed

### Expected Features

Research confirmed the feature scope against comparable tools (claude-code-plugin-analyzer, MCP Server Selector TUI, WordPress plugin auditor) and against the existing codebase's infrastructure.

**Must have (table stakes — P1 for v1.1):**
- `claude mcp list` paste parser + fuzzy name resolution — without this, no analysis is possible
- Direct-type input with shadcn/ui Command autocomplete — primary path for users who know their plugins
- Recognized vs. unrecognized parse feedback — silent drops look like a broken tool
- Conflict warning display (reuse `getConflicts()` + `getRedundancies()`) — already built, just wire up
- Combination score with per-rule breakdown (0–100, not raw integers) — the core "is my set good?" answer
- Complement suggestions: "add these" based on coverage gaps — core optimizer value
- Replacement suggestions: "swap these" for unverified/stale plugins — core optimizer value
- AI mode as Coming Soon (non-interactive, no onClick handler) — explicit PROJECT.md decision

**Should have (P2, add in v1.1.x after validation):**
- Category coverage visualization (badge grid by workflow area)
- Preset-match indicator (Jaccard similarity against existing preset packs)
- Difficulty aggregate rating for the whole set

**Defer (v2+):**
- Active AI combo analysis — requires Anthropic API integration; cost/latency tradeoff not yet evaluated
- Persistent saved setups — requires user accounts or URL-serialized state
- Team-level combo sharing
- settings.json / mcp.json file upload parsing (explicitly out of scope per PROJECT.md)

### Architecture Approach

The optimizer slots cleanly into the existing app structure as a sibling to `/advisor`. The architecture is a four-layer stack: route shell (server component) → client orchestrator component + custom hook → pure lib functions → static PLUGINS data. All scoring runs synchronously in the browser — no API route is needed or appropriate for v1.1 since the entire 42-plugin DB is already a client-available static import.

**Major components (new):**
1. `app/optimizer/page.tsx` — Route shell, server component wrapper
2. `components/OptimizerApp.tsx` — Client orchestrator (mirrors PluginAdvisorApp.tsx pattern)
3. `hooks/useOptimizer.ts` — Step state machine (`input | analyzing | result`) + plugin list management
4. `lib/parseMcpList.ts` — Pure parser: `claude mcp list` text → `{ recognized: string[], unrecognized: string[] }`
5. `lib/optimize.ts` — Pure scoring functions: `scoreCombo()`, `buildComplements()`, `buildAlternatives()`
6. `components/McpListInput.tsx` — Paste textarea + autocomplete
7. `components/ComboScoreCard.tsx` — Score breakdown display
8. `components/ComplementPanel.tsx` + `components/AlternativePanel.tsx` — Recommendation cards

**Existing modules reused without modification:**
- `lib/conflicts.ts` — `getConflicts()`, `getRedundancies()` (authoritative conflict source)
- `lib/plugins.ts` — static PLUGINS record (read-only)
- `components/ConflictWarning.tsx` — accepts `ConflictWarning[]` directly
- `lib/setup.ts` — install script generation for complement suggestions

**Existing modules extended minimally:**
- `lib/types.ts` — add `OptimizerResult` type
- `lib/analytics.ts` — add 3 new event names to the union

**Build order dictated by dependency graph:**
types.ts → parseMcpList.ts → optimize.ts → useOptimizer → UI components → page.tsx → nav link

### Critical Pitfalls

1. **`claude mcp list` parser fragility** — The output format is undocumented and varies (header lines, scope annotations like `context7 (user):`, status tails like `✓ Connected`). A naive line-split crashes or silently drops plugins. Avoid by: skipping non-matching lines, stripping scope annotations before lookup, returning an explicit `unrecognized` list. Write unit tests for 5+ edge cases before touching the UI.

2. **Plugin name mismatch (installed name vs DB ID)** — Users install servers with arbitrary names (`mcp-context7`, `context-7`, `my-github`). The DB uses flat IDs like `context7`. Avoid by: building a normalization step (lowercase, strip `mcp-` prefix, strip `-mcp` suffix, replace underscores with hyphens) and an `aliases` field on each plugin. Never silently drop an unrecognized name.

3. **Conflict data one-directionality** — `plugin.conflicts[]` on each plugin seed and `CONFLICT_PAIRS` in `lib/conflicts.ts` can drift. The optimizer must call `getConflicts()` exclusively — never walk `plugin.conflicts` directly. Add a test asserting symmetric coverage.

4. **Score normalization deferred** — Raw integer scores (`-4`, `7`, `12`) are uninterpretable to users and produce counter-intuitive results (1 plugin can outscore 10 plugins with no conflicts). Define each sub-score on a 0–100 scale, produce a composite letter grade or percentage, and document the formula before shipping.

5. **Complement logic recommending already-installed plugins** — Reusing `recommend()` from `/advisor` without filtering produces this bug. The `buildComplements()` function must accept `installedIds: string[]` and filter both already-installed and conflicting plugins from the output.

## Implications for Roadmap

Based on the dependency graph in ARCHITECTURE.md and the pitfall-to-phase mapping in PITFALLS.md, three implementation phases emerge naturally.

### Phase 1: Foundation — Types, Parser, Page Scaffold

**Rationale:** The `OptimizerResult` type and `parseMcpList.ts` are zero-dependency starting points that unblock all downstream work. The page scaffold must be established (with the Coming Soon AI button correctly non-interactive) before any feature work begins, to avoid the "pre-wired AI mode crashes the page" pitfall.

**Delivers:** A navigable `/optimizer` route with working input (both paste and autocomplete), correct parse feedback (recognized vs. unrecognized), and no functional scoring yet (loading state placeholder is acceptable).

**Addresses features:** `claude mcp list` paste input, direct-type autocomplete, recognized/unrecognized feedback, Coming Soon AI mode display.

**Avoids pitfalls:** Parser fragility (unit tests written here), premature AI mode wiring, localStorage leaking file paths.

**Research flag:** Standard patterns — no additional research needed. Parser edge cases are fully documented in PITFALLS.md.

### Phase 2: Scoring Engine

**Rationale:** With the parser and types in place, all scoring logic can be built and tested as pure functions before any UI is connected. This phase delivers `lib/optimize.ts` and `hooks/useOptimizer.ts` — the core value of the feature.

**Delivers:** A complete `scoreCombo()` function returning a normalized 0–100 score with per-rule breakdown, `buildComplements()` with installed-plugin exclusion, `buildAlternatives()` using verification status heuristics, and conflict/redundancy detection via existing `lib/conflicts.ts`.

**Addresses features:** Combination score with breakdown, conflict warnings, complement suggestions, replacement suggestions.

**Avoids pitfalls:** Score normalization (define 0–100 scales here, not post-launch), complement-recommends-installed bug, conflict one-directionality (use `getConflicts()` exclusively).

**Research flag:** Standard patterns — scoring algorithm is well-understood; conflict reuse is direct. No additional research needed.

### Phase 3: Results UI and Polish

**Rationale:** With the scoring engine complete and tested, the UI components become thin rendering layers over verified data. This phase assembles `ComboScoreCard`, `ComplementPanel`, `AlternativePanel`, wires up `OptimizerApp`, adds the nav link, and applies UX polish (progressive disclosure, score delta display, capped complement suggestions).

**Delivers:** A fully functional `/optimizer` page with all P1 features live. Analytics events added. Nav link added.

**Addresses features:** Score display, conflict warnings (reuse `ConflictWarning`), complement and alternative recommendation cards, install script for complements.

**Avoids pitfalls:** Alert fatigue (progressive disclosure: score + conflicts first, "Improve" CTA folds complement/alternative panels), complement list capped at 3 items.

**Research flag:** Standard patterns — UI mirrors existing `/advisor` components. No additional research needed.

### Phase Ordering Rationale

- Types and parser come first because every other file depends on them.
- Scoring engine comes before UI because pure functions are easier to test in isolation; catching normalization bugs before the UI ships avoids a redesign.
- UI assembly comes last because it is the thinnest layer — pure rendering of already-verified data.
- This order also naturally enforces the "no AI import until Phase N+1" constraint — the AI mode path does not exist in the codebase until it is explicitly added.

### Research Flags

Phases needing deeper research during planning:
- None identified. All three phases use established patterns with high-confidence sources.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Next.js App Router page creation and shadcn/ui Command autocomplete are well-documented. Parser edge cases are pre-documented in PITFALLS.md.
- **Phase 2 (Scoring Engine):** Pure TypeScript functions with Vitest. Pattern mirrors existing `lib/recommend.ts`.
- **Phase 3 (Results UI):** Mirrors existing `components/PluginAdvisorApp.tsx` and `components/ConflictWarning.tsx`.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Existing codebase — no new dependencies needed. Stack is locked by CLAUDE.md constraints. |
| Features | HIGH | Confirmed against official Claude Code MCP docs, existing codebase infrastructure, and PROJECT.md explicit scope decisions. |
| Architecture | HIGH | Based on direct codebase read of all relevant source files. Dependency graph is unambiguous. |
| Pitfalls | HIGH | Parser edge cases verified via GitHub issue #8288. Conflict data model verified by reading `lib/conflicts.ts` directly. Score normalization pitfall is a known pattern in rules-based scoring systems. |

**Overall confidence: HIGH**

### Gaps to Address

- **Plugin alias table:** Research identified that users install MCP servers with arbitrary names, but the existing `plugins.ts` DB does not have an `aliases: string[]` field. The implementation team must decide: (a) add `aliases` to the Plugin type and populate for common variants, or (b) rely on normalization rules alone (strip prefixes/suffixes, lowercase). Option (a) is more robust but requires populating 42 entries. This decision should be made in Phase 1 before the parser is finalized.

- **Fuse.js vs. substring fallback:** The autocomplete input needs fuzzy matching. Whether to add Fuse.js (already in features research as a candidate) or use a simple substring approach affects the `McpListInput` implementation. Since the plugin set is only 42 items, substring matching is likely sufficient and avoids a new dependency. Confirm during Phase 1 implementation.

- **STACK.md not produced:** The STACK researcher agent did not produce a file. Stack findings above are derived from CLAUDE.md (project instructions), PROJECT.md (constraints section), and the existing codebase. Confidence remains HIGH because the stack is already deployed and locked — there are no open technology decisions for v1.1.

## Sources

### Primary (HIGH confidence)
- `lib/conflicts.ts`, `lib/plugins.ts`, `lib/types.ts`, `lib/recommend.ts`, `lib/setup.ts`, `hooks/useAnalysis.ts`, `components/PluginAdvisorApp.tsx` — direct codebase read
- `.planning/PROJECT.md` — milestone scope, explicit out-of-scope decisions, key decisions table
- `CLAUDE.md` (project) — locked tech stack and constraints
- [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp) — `claude mcp list` output format, space-to-underscore normalization, multiple instance support

### Secondary (MEDIUM confidence)
- [claude-code-plugin-analyzer (GitHub)](https://github.com/thrivikram52/claude-code-plugin-analyzer) — scoring methodology reference
- [Claude Code MCP Server Selector (GitHub)](https://github.com/henkisdabro/Claude-Code-MCP-Server-Selector) — context-window optimization UX patterns
- [claude-code GitHub Issue #8288](https://github.com/anthropics/claude-code/issues/8288) — `claude mcp list` output format variations and scope annotations
- [MCP Server Naming Conventions — zazencodes.com](https://zazencodes.com/blog/mcp-server-naming-conventions) — common naming patterns
- [Autocomplete UX patterns](https://smart-interface-design-patterns.com/articles/autocomplete-ux/) — input design reference

### Tertiary (LOW confidence)
- [WordPress plugin conflict diagnosis](https://wisdmlabs.com/blog/how-to-diagnose-hidden-wordpress-plugin-conflicts/) — conflict detection UX patterns from analogous domain
- [Alert Fatigue in User Interfaces — NN/g](https://www.nngroup.com/videos/alert-fatigue-user-interfaces/) — progressive disclosure rationale
- [7 Critical Challenges of Recommendation Engines — Appier](https://www.appier.com/en/blog/7-critical-challenges-of-recommendation-engines) — complement recommendation pitfalls

---
*Research completed: 2026-03-16*
*Ready for roadmap: yes*
