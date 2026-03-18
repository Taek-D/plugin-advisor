# Project Research Summary

**Project:** Plugin Advisor v1.2 — MCP + Plugin Type System
**Domain:** Additive type system extension to existing Claude Code plugin advisor
**Researched:** 2026-03-18
**Confidence:** HIGH

## Executive Summary

This milestone is a tightly scoped, additive change to an already-working product. The research found zero new runtime dependencies are required. The existing stack (Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Vitest) handles every requirement. The core task is: add a `type: 'mcp' | 'plugin'` discriminant to the `Plugin` type, classify 10-15 existing entries as `type: 'plugin'`, add a tab filter on the `/plugins` page, and extend the optimizer's scoring to be type-scope-aware. All four research files converge on the same dependency graph: types must be correct before DB changes, DB before scoring, scoring before UI.

The recommended approach is to treat this as a five-step migration with a strict layering rule: `lib/types.ts` is the single source of truth for the `type` field, and every downstream file derives from it. The most important architectural decision is to add `type: 'mcp'` as a default in `DEFAULT_PLUGIN_FIELDS` rather than making the field optional. This one choice eliminates the highest-severity pitfall (all 42 existing entries silently becoming `undefined` at runtime) at zero migration cost. The scoring engine requires a `typeScope` parameter so MCP-only optimizer submissions do not receive Plugin-type complement suggestions — the two install mechanisms are incompatible and mixing them produces actively misleading output.

The principal risks are type-system contamination pitfalls, not architectural uncertainty. There is no novel engineering here. Every pattern (discriminated union with default, composable filter state, type-scoped scoring) is standard TypeScript/React. The risk is mechanical mistakes during the type migration, not design decisions. Running `pnpm typecheck` after each step — not just `pnpm dev` — is the single most effective mitigation across all eight pitfalls identified.

---

## Key Findings

### Recommended Stack

No new dependencies. This milestone reuses everything already in the bundle. The key technical choices have already been made by the existing codebase — this research confirms they are correct for the extension.

**Core technologies:**

- **TypeScript discriminated union (`'mcp' | 'plugin'`):** The right mechanism for a two-value type discriminant. No runtime library needed. Exhaustiveness checking via `never` catches missing branches at compile time.
- **shadcn/ui `TabsList` + `TabsTrigger`:** Already imported in `OptimizerApp.tsx`. Copy exact same usage pattern into `PluginGrid.tsx` — zero new UI primitives required.
- **`DEFAULT_PLUGIN_FIELDS` merge pattern (in `lib/plugins.ts`):** The existing seed/override architecture handles the `type` default cleanly. Adding `type: 'mcp'` to `DEFAULT_PLUGIN_FIELDS` propagates to all 42 existing entries without touching any individual entry.
- **`scorePlugins` ID-based model (in `lib/scoring.ts`):** Already type-agnostic by design. Needs only a `typeScope` parameter addition — no structural rewrite.

### Expected Features

**Must have (table stakes for v1.2):**

- `type: 'mcp' | 'plugin'` field on every `Plugin` entry, with all 42 existing entries correctly defaulted to `'mcp'`
- 10-15 Plugin-type entries added to `PLUGINS` DB (omc, fireauto, gsd, bkit, agency-agents are the natural first wave — they use `/plugin marketplace add` or `git clone`, not `claude mcp add`)
- MCP / Plugin / All tab UI on `/plugins` page with independent `activeType` state
- Category filter and type tab composing correctly (AND logic) with reset on type switch when selected category yields zero results
- `scorePlugins` extended with `typeScope` parameter so complement and replacement suggestions respect type context
- Both `claude mcp list` and `claude plugin list` paste formats documented in optimizer UI hints and sample data

**Should have (differentiators):**

- Type badge (MCP / Plugin) in `PluginTypeInput` autocomplete dropdown — low effort, visible quality signal
- Tab state persisted in URL query param (`?type=plugin`) so Plugin tab survives `/plugins/[id]` navigation and is directly linkable
- Score label updated to reflect submission type ("MCP 점수" / "Plugin 점수" / "MCP + Plugin 점수")
- Category filter reset when switching type tabs to avoid zero-result confusion

**Defer to v1.x or v2+:**

- Type badge on `SelectedPluginChips` in optimizer — safe to defer, zero functional impact
- AI combo analysis for Plugin-type entries
- Persistent saved setups
- Team-level combo sharing

### Architecture Approach

The architecture is a clean layered extension. `lib/types.ts` sits at the root — all other files derive the `type` field from it. `lib/plugins.ts` applies the default via `DEFAULT_PLUGIN_FIELDS`. `lib/scoring.ts` and `lib/conflicts.ts` are ID-based and require minimal changes (scoring needs `typeScope`; conflicts need none). `PluginGrid.tsx` adds one `useState` for `activeType` and one `TabsList` block. The `/plugins` server page shell remains untouched. The entire change surface is small: 6 files must change meaningfully, 2 need minor touches, 7+ stay completely unchanged.

**Major components and their v1.2 changes:**

1. `lib/types.ts` — ADD `ItemType = 'mcp' | 'plugin'`; ADD required `type: ItemType` field to `Plugin`
2. `lib/plugins.ts` — ADD `type: 'mcp'` to `DEFAULT_PLUGIN_FIELDS`; ADD 10-15 Plugin entries with `type: 'plugin'`
3. `lib/scoring.ts` — ADD `typeScope` parameter to `scorePlugins`; filter candidates in `buildComplements` and `buildReplacements`
4. `components/PluginGrid.tsx` — ADD `activeType` state + `TabsList` row + type predicate in filter chain
5. `lib/i18n/types.ts` + `ko.ts` + `en.ts` — ADD `pluginsPage.tabAll/tabMcp/tabPlugin` keys (both locales in same commit)
6. `lib/parse-mcp-list.ts` — VERIFY `isPluginList` branch resolves new Plugin IDs; ADD `ALIAS_MAP` entries only if needed

**Files that do not change:** `lib/conflicts.ts`, `components/OptimizerApp.tsx`, `components/PluginSearch.tsx`, `app/plugins/page.tsx`, `components/ResultsPanel.tsx`, `components/PluginGridCard.tsx`.

### Critical Pitfalls

1. **`type` made optional instead of required** — All 42 existing entries silently get `undefined` at runtime; MCP tab shows zero entries. Prevention: add `type: 'mcp'` to `DEFAULT_PLUGIN_FIELDS` and make the field required from day one.

2. **`parseMcpList` pseudo-plugin factory gets a blanket `type: 'mcp'` default across both list branches** — Plugin list tokens are mislabeled as MCPs in type-aware contexts. Prevention: delete the factory; pass real `Plugin[]` filtered by type to the parser call site.

3. **`buildComplements`/`buildReplacements` surface Plugin entries for MCP-only submissions** — Suggestions point at entries requiring incompatible install commands. Prevention: add `typeScope` parameter before any Plugin entries enter `PLUGINS`.

4. **`PluginCategory` union widened with `'mcp'` and `'plugin'` values** — Contaminates `ALL_CATEGORIES` in scoring (10 becomes 12), fires false coverage penalties, requires new i18n `categories` keys. Prevention: add a completely separate `activeType` state to `PluginGrid`; keep `PluginCategory` closed.

5. **i18n strings added to `ko.ts` but not `en.ts` in the same commit** — `pnpm build` fails in CI while `pnpm dev` appears fine. Prevention: always add both locale values in the same commit as the UI component that consumes them.

---

## Implications for Roadmap

The dependency graph is unambiguous. The build order is not a stylistic choice — TypeScript will produce compile errors at each step if the sequence is violated. Suggested phase structure:

### Phase 1: Type System Foundation
**Rationale:** Every downstream change depends on `Plugin.type` being a required, correctly-defaulted field. A mistake here causes cascade failures across all other phases. Must be completed and verified (`pnpm typecheck`, `pnpm test`) before anything else proceeds.
**Delivers:** `ItemType` type alias; required `type` field on `Plugin`; `DEFAULT_PLUGIN_FIELDS` updated with `type: 'mcp'`; all 42 existing entries correctly typed at runtime; `parseMcpList` pseudo-factory deleted or fixed.
**Avoids:** Pitfall 1 (optional field with undefined runtime), Pitfall 2 (parser factory mislabeling both list formats).

### Phase 2: Plugin DB Population
**Rationale:** With the type system in place, Plugin entries can be added safely. TypeScript enforces that every new entry declares `type`. This phase produces the data that drives tab filtering and scoring behavior in later phases.
**Delivers:** 10-15 Plugin-type entries in `PLUGINS` (omc, fireauto, gsd, bkit, agency-agents plus new entries); classification rule applied consistently (`/plugin` / `git clone` install = `type: 'plugin'`).
**Uses:** `PLUGIN_FIELD_OVERRIDES` pattern already in `lib/plugins.ts` — no structural change.
**Avoids:** Starting scoring extension before the data that drives it exists.

### Phase 3: Scoring Extension
**Rationale:** Scoring must be extended before Plugin entries can produce correct optimizer output. Adding `typeScope` to `scorePlugins` before the UI exposes mixed results prevents the most damaging UX bug (Plugin complements appearing in MCP-only analysis).
**Delivers:** `typeScope: 'mcp' | 'plugin' | 'both'` parameter on `scorePlugins`; filtered candidate pools in `buildComplements` and `buildReplacements`; dynamic `scorableCategories` computation that excludes Plugin-only categories from MCP-only penalties.
**Avoids:** Pitfall 3 (Plugin complements for MCP-only input), Pitfall 7 (ALL_CATEGORIES penalty firing for Plugin-only categories on MCP-only submissions).

### Phase 4: Tab UI on /plugins
**Rationale:** Tab UI is purely additive client-side state on top of an already-correct data layer. With Phases 1-2 done, `Object.values(PLUGINS)` already contains the right `type` values for filtering.
**Delivers:** `activeType` state in `PluginGrid`; `TabsList` row (All / MCP / Plugin); composable filter predicate (AND logic with category); `?type=` URL query param for persistence across `/plugins/[id]` navigation; category filter reset on type switch.
**Implements:** Composable Filters pattern (Pattern 2) from ARCHITECTURE.md.
**Avoids:** Pitfall 4 (PluginCategory contamination), Pitfall 5 (tab state lost on navigation).

### Phase 5: Optimizer UI + Parser Verification
**Rationale:** The optimizer paste UI needs updated hints and sample data to expose the `claude plugin list` format support that the parser already handles. Low risk, high discoverability impact.
**Delivers:** Updated `pasteLabel` and `pastePlaceholder` i18n keys; `handleSampleData` with `❯ omc@marketplace` style example line; format hint below textarea showing both command formats; verified `ALIAS_MAP` entries for new Plugin IDs.
**Avoids:** Pitfall 6 (optimizer plugin paste support undiscoverable to Plugin users).

### Phase 6: i18n Completion + Type Badges
**Rationale:** i18n keys must accompany their UI consumers, not precede or follow them. This phase closes out all string additions from Phases 4-5 and adds the type badge to `PluginTypeInput`.
**Delivers:** `pluginsPage.tabAll/tabMcp/tabPlugin` keys in both `ko.ts` and `en.ts`; type badge (MCP / Plugin) in autocomplete dropdown; `pnpm build` passes without i18n type errors.
**Avoids:** Pitfall 8 (i18n build failure from missing locale keys in one locale).

### Phase Ordering Rationale

- **Types before data before logic before UI** is the order TypeScript itself enforces via compile errors at each step.
- **Scoring extension before UI exposure** is the product-safety order. Plugin entries in the DB with unscoped scoring produce misleading suggestions; users must never see this state.
- **Tab UI before optimizer hints** because the `/plugins` page is the primary discovery surface for Plugin-type entries. Users need to see Plugin entries before they consider pasting `claude plugin list` output.
- **i18n in the same phase as consumers** because string keys added without consuming components are dead code; keys missing from one locale block `pnpm build` in CI.

### Research Flags

Phases with well-documented patterns (skip additional research):
- **Phase 1:** TypeScript discriminated union with defaults — completely standard; zero research needed.
- **Phase 4:** shadcn/ui Tabs + React `useState` composable filter — already in use in `OptimizerApp.tsx`; copy pattern directly.
- **Phase 6:** i18n key addition — mechanical; no research needed.

Phases that may need a spot-check during implementation:
- **Phase 2 (Plugin DB Population):** Classification of borderline entries (`superpowers`, `taskmaster`, `bkit-starter`) requires inspection of their install commands. The rule is clear but the data is not fully enumerated. Budget 30-60 minutes to inspect each candidate entry's `install` field.
- **Phase 3 (Scoring Extension):** The dynamic `scorableCategories` computation is new logic with no existing test coverage. Needs a regression test asserting that MCP-only user score is unchanged after Plugin entries are added to the DB.
- **Phase 5 (Parser Verification):** `resolvePluginId` behavior for new Plugin IDs depends on their actual registered names in the CLI. `ALIAS_MAP` additions are data-driven and can only be determined by testing against real `claude plugin list` output.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All findings from direct codebase inspection. Zero external dependencies. No version uncertainty. |
| Features | MEDIUM-HIGH | P1 features are well-defined. P2 features validated against analogous tools. Novel UX (Plugin-type scoring scope) has no direct precedent — the rule is sound but score label copy and category-reset behavior need UX validation during implementation. |
| Architecture | HIGH | All integration surfaces read from source. Component boundaries and data flow are unambiguous. Build order is enforced by TypeScript's own compile-time errors. |
| Pitfalls | HIGH | All 8 pitfalls derived from direct source inspection of the specific code constructs being touched. No inference from general patterns. |

**Overall confidence:** HIGH

### Gaps to Address

- **Plugin entry classification for borderline entries:** `superpowers`, `taskmaster`, `bkit-starter` install mechanism needs inspection to assign `type`. Resolve during Phase 2 by reading each entry's `install` field in `lib/plugins.ts`.
- **`resolvePluginId` behavior for new Plugin IDs:** Unknown until tested against real `claude plugin list` output. Plan `ALIAS_MAP` additions as a corrective pass in Phase 5, not upfront guesswork.
- **Score label copy for mixed-type submissions:** "MCP + Plugin 점수" display string is not researched. Decide during Phase 3 implementation with a working prototype visible.
- **Category filter reset UX on type tab switch:** PITFALLS.md recommends resetting `activeCategory` to `'all'` when `activeType` changes. An alternative (preserve category, show zero-result empty state) may feel less disruptive. Decide during Phase 4 with a working prototype.

---

## Sources

### Primary (HIGH confidence)

- Direct codebase inspection — `lib/types.ts`, `lib/plugins.ts`, `lib/scoring.ts`, `lib/conflicts.ts`, `lib/parse-mcp-list.ts`, `components/PluginGrid.tsx`, `components/OptimizerApp.tsx`, `components/PluginTypeInput.tsx`, `lib/i18n/types.ts`, `lib/i18n/ko.ts` — all architecture and pitfall findings
- `.planning/PROJECT.md` — v1.2 milestone scope, explicit out-of-scope decisions, key decisions log

### Secondary (MEDIUM confidence)

- Claude Code MCP official docs — `claude mcp list` and `claude plugin list` output format confirmation
- `claude-code-plugin-analyzer` (GitHub community tool) — scoring methodology reference used to validate rule-based scoring approach
- Claude Code MCP Server Selector TUI (GitHub) — context-window optimization UX patterns
- Autocomplete UX patterns (smart-interface-design-patterns.com) — input design reference

### Tertiary (LOW confidence)

- WordPress plugin conflict diagnosis patterns — analogous domain; used to validate conflict detection UX table stakes assumptions only

---

*Research completed: 2026-03-18*
*Ready for roadmap: yes*
