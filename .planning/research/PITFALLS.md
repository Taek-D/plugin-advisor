# Pitfalls Research

**Domain:** Adding Plugin type system + tab UI + scoring integration to existing MCP-only advisor
**Researched:** 2026-03-18
**Confidence:** HIGH — all pitfalls derived directly from codebase inspection, not training-data assumptions

---

## Critical Pitfalls

### Pitfall 1: `type` Field Added to `Plugin` Without Updating `DEFAULT_PLUGIN_FIELDS` — All 42 Entries Silently Become `undefined`

**What goes wrong:**
The seed pattern in `lib/plugins.ts` uses `DEFAULT_PLUGIN_FIELDS` (lines 22–33) merged with per-entry `PLUGIN_FIELD_OVERRIDES`. If `type: 'mcp' | 'plugin'` is added to the `Plugin` type in `lib/types.ts` but NOT added to `DEFAULT_PLUGIN_FIELDS`, TypeScript will still compile if `type` is declared optional (`type?`). At runtime all 42 existing entries have `type: undefined`. Every downstream conditional (`plugin.type === 'mcp'`) evaluates to `false` for all existing entries — breaking tab filtering, scoring type scope, and complement suggestions simultaneously. The entire catalog disappears from the MCP tab.

**Why it happens:**
Making `type` optional looks like a safe way to avoid touching 42 entries. It satisfies TypeScript without mass edits. The error is invisible in `pnpm dev` (no full type check) and only surfaces as a runtime blank state.

**How to avoid:**
Make `type` required (not optional) from day one. Add `type: 'mcp' as const` to `DEFAULT_PLUGIN_FIELDS`. Zero individual entry changes are needed — the merge pattern applies the default to all 42 automatically. Only new Plugin-type entries need an explicit override `type: 'plugin'`. TypeScript will enforce this for all new entries and all test mocks.

**Warning signs:**
- `type?` (optional) appears in the `Plugin` type definition in `lib/types.ts`
- `lib/plugins.ts` builds without any change to `DEFAULT_PLUGIN_FIELDS`
- The MCP tab on `/plugins` shows zero entries after the type field is added

**Phase to address:** Phase 1 (DB type migration) — `Plugin` type change and `DEFAULT_PLUGIN_FIELDS` update must be the same commit

---

### Pitfall 2: `parseMcpList` Pseudo-Plugin Factory Breaks on the New Required `type` Field

**What goes wrong:**
`lib/parse-mcp-list.ts` lines 93–117 construct a `pseudoPlugins: Plugin[]` array by mapping raw IDs into minimal `Plugin` objects with hardcoded defaults. This factory exists only for token resolution and hard-codes only the fields needed for name matching. When `type` becomes required on `Plugin`, this factory produces a TypeScript error. The common fix — adding `type: 'mcp'` as a silent default — is actually correct for the MCP list path, but wrong for the `claude plugin list` path (the `isPluginList` branch, line 124). Giving both branches the same `type: 'mcp'` default means plugin list tokens are labeled as MCPs, corrupting any type-aware scoring or filtering.

**Why it happens:**
The pseudo-plugin factory is an implementation detail inside the parser. Developers suppress the type error with the same default value across both branches without checking which branch needs which default.

**How to avoid:**
Split the resolution: `parseMcpList` should accept a typed plugin list `plugins: Plugin[]` (the real objects, not a pseudo-array). The caller in `OptimizerApp` already has access to `PLUGINS` — pass `Object.values(PLUGINS)` filtered by `type === 'mcp'` for MCP list parsing and filtered by `type === 'plugin'` for plugin list parsing. Delete the pseudo-plugin factory entirely. This also fixes the existing limitation that the pseudo-plugin factory cannot resolve against `plugin.name` or `plugin.tag` with full fidelity.

**Warning signs:**
- The pseudo-plugin factory in `parse-mcp-list.ts` is still present after the type field is added
- Test mocks in `lib/__tests__/parse-mcp-list.test.ts` use `as Plugin` cast or `@ts-expect-error` after the type change
- `claude plugin list` output resolves entries but they are labeled `type: 'mcp'` when inspected

**Phase to address:** Phase 1 (DB type migration) — fix the factory the moment `type` becomes required

---

### Pitfall 3: `buildComplements` and `buildReplacements` in `scoring.ts` Do Not Filter by Type — Plugin Entries Bleed Into MCP-Only Analysis

**What goes wrong:**
`lib/scoring.ts` `buildComplements` (line 113) calls `Object.values(PLUGINS)` to find candidates for uncovered categories. `buildReplacements` (line 140) does the same to find verified alternatives. Neither function is type-aware. Once Plugin-type entries are added to `PLUGINS`, a user who submits only their `claude mcp list` output will receive Plugin-type entries as complement or replacement suggestions. These are not installable via `claude mcp add` — the install mechanism is completely different. The suggestions are not just unhelpful; they are actively misleading.

**Why it happens:**
The scoring functions were designed when all entries in `PLUGINS` were MCPs. There was no reason to filter by type. Adding new entries without updating the filter assumption silently poisons every scoring output.

**How to avoid:**
Before adding any Plugin-type entries to `PLUGINS`, add a `typeScope: 'mcp' | 'plugin' | 'both'` parameter to `scorePlugins` (default `'mcp'` for backward compatibility). Inside `buildComplements` and `buildReplacements`, filter `Object.values(PLUGINS)` by `plugin.type === typeScope` (or allow both when `typeScope === 'both'`). The caller — `OptimizerApp` — passes the scope based on what the user submitted.

**Warning signs:**
- `scorePlugins` signature has no type-scope parameter after Plugin entries are added
- Scoring tests pass but a `type === 'plugin'` entry appears in `complements` when only MCP IDs were passed
- `ALL_CATEGORIES` penalty fires for categories only Plugin-type entries can cover, even for MCP-only users

**Phase to address:** Phase 2 (scoring extension) — must be done before any Plugin-type entries enter `PLUGINS`

---

### Pitfall 4: `PluginCategory` Type Contaminated by Using It to Represent the MCP/Plugin Tab Dimension

**What goes wrong:**
`PluginGrid` already uses `PluginCategory | 'all'` as its filter state. The fastest way to add an MCP/Plugin tab is to add `'mcp'` and `'plugin'` as new values of `PluginCategory`. This appears to work for the UI, but `PluginCategory` is also used in `scoring.ts` `ALL_CATEGORIES` (line 41), `lib/types.ts` type declarations, and `lib/i18n/types.ts` `categories` key set. Widening the union with tab-like values causes `ALL_CATEGORIES` to include 12 items instead of 10, the uncovered-category penalty fires for the two new pseudo-categories, and the `categories` i18n Record requires new keys that have no display meaning.

**Why it happens:**
Reusing the existing `category` state in `PluginGrid` is the path of least resistance — it avoids a new state variable and a new prop. The contamination is not obvious during local development because tests do not cover `ALL_CATEGORIES.length`.

**How to avoid:**
Add a completely separate `activeType: 'all' | 'mcp' | 'plugin'` state to `PluginGrid`, independent of `activeCategory`. Apply both filters in sequence: first by `plugin.type` (if `activeType !== 'all'`), then by `plugin.category` (if `activeCategory !== 'all'`). `PluginCategory` remains a closed 10-value union. `scoring.ts` is not touched.

**Warning signs:**
- `PluginCategory` type in `lib/types.ts` gains `'mcp'` or `'plugin'` as values
- `ALL_CATEGORIES` array in `scoring.ts` is updated to exclude the new values
- i18n `categories` Record requires new keys `'mcp'` or `'plugin'`

**Phase to address:** Phase 3 (tab UI)

---

### Pitfall 5: Tab State in `PluginGrid` Lost on `/plugins/[id]` Navigation — Users Must Re-Select the Plugin Tab

**What goes wrong:**
`PluginGrid` holds all filter state in local `useState`. When a user selects the Plugin tab (a minority of the catalog), clicks through to `/plugins/[id]`, and presses back, `PluginGrid` remounts and resets to `activeType: 'all'`. Because Plugin-type entries are a small fraction of the total catalog, the user sees a wall of MCP entries and does not know their Plugin tab selection was lost. This is especially disruptive during the early period when only 10–15 Plugin entries exist — they are visually buried.

**Why it happens:**
Local `useState` for filter state is correct for components that never unmount. In Next.js App Router, navigation to a child route unmounts the parent page and its component tree. The issue is invisible during development because hot-reload preserves React state.

**How to avoid:**
Lift the active type state into the URL as a query parameter: `?type=plugin`. In `app/plugins/page.tsx`, read `searchParams.get('type')` and pass `initialType` as a prop to `PluginGrid`. On tab change, call `router.replace('/plugins?type=plugin', { scroll: false })`. This also makes the Plugin tab directly linkable from other pages (e.g., a landing CTA can link directly to `/plugins?type=plugin`).

**Warning signs:**
- `activeType` state is managed with `useState` in `PluginGrid` rather than derived from URL
- `app/plugins/page.tsx` does not read `searchParams`
- No `initialType` prop on `PluginGrid`

**Phase to address:** Phase 3 (tab UI)

---

### Pitfall 6: Optimizer Paste Hint and Sample Data Not Updated for `claude plugin list` Format — Users Cannot Discover Plugin Paste Support

**What goes wrong:**
`OptimizerApp.tsx` `handleSampleData` (line 61) hardcodes a `claude mcp list`-style sample: `"context7 (user):\nplaywright (user):\ngithub (user):"`. The i18n keys `t.optimizer.pasteLabel` and `t.optimizer.pastePlaceholder` mention only MCPs. After adding `claude plugin list` support, users who have Plugins installed will not know they can paste that output into the same field. The `isPluginList` branch in `parseMcpList` (which detects `❯` prefix) already exists but is completely undiscoverable. Users see zero plugin matches and assume the optimizer does not support their Plugins.

**Why it happens:**
The parser `isPluginList` branch was added in anticipation of v1.2 but the UX layer was not updated to match. The parser is ahead of the UI.

**How to avoid:**
Update `t.optimizer.pasteLabel` and `t.optimizer.pastePlaceholder` in both `lib/i18n/ko.ts` and `lib/i18n/en.ts` to explain that both `claude mcp list` and `claude plugin list` output are accepted. Update `handleSampleData` to include at least one `❯ omc@marketplace` style line. Add a small format hint below the textarea showing both command formats.

**Warning signs:**
- i18n paste label keys unchanged after Plugin support is added
- `handleSampleData` string does not contain `❯`
- No visible hint explaining two accepted formats in the optimizer UI

**Phase to address:** Phase 4 (parser extension + optimizer UI update) — same phase as `claude plugin list` parser support

---

### Pitfall 7: `ALL_CATEGORIES` Coverage Penalty Fires for Plugin-Only Categories on MCP-Only Submissions

**What goes wrong:**
`scoring.ts` penalises every category in `ALL_CATEGORIES` that is uncovered by the submitted plugin set. If new Plugin-type entries are added that cover categories no MCP currently covers (e.g., a new `automation` category or Plugin entries placed in existing categories where no MCP exists), an MCP-only user's score is penalised for not covering those categories — categories they can never cover via MCPs. The score becomes artificially low and the complement suggestions point at Plugin-type entries the user cannot install via `claude mcp add`.

**Why it happens:**
`ALL_CATEGORIES` is a hardcoded list. The coverage model was designed when all entries shared one installation mechanism. The penalty math does not distinguish whether a category gap is fillable by the type of plugins the user has.

**How to avoid:**
When `typeScope === 'mcp'` is passed to `scorePlugins`, compute `ALL_CATEGORIES` dynamically as only those categories that at least one MCP-type entry covers. Categories that are Plugin-only do not count as uncovered for MCP-only users. This is a one-line filter: `const scorableCategories = ALL_CATEGORIES.filter(cat => Object.values(PLUGINS).some(p => p.type === 'mcp' && p.category === cat))`.

**Warning signs:**
- An MCP-only user's score drops after Plugin entries are added to a new category
- Complement suggestions for MCP-only input include a `type === 'plugin'` entry

**Phase to address:** Phase 2 (scoring extension) — implement alongside type-scope parameter

---

### Pitfall 8: i18n `Translations` Type Enforces All Keys Required — New Tab Strings Added to One Locale Cause Build Failure

**What goes wrong:**
`lib/i18n/types.ts` defines `Translations` with all fields required. When `pluginsPage.tabMcp` and `pluginsPage.tabPlugin` (or equivalent) are added to `ko.ts` but not `en.ts` in the same commit, `pnpm build` fails with a TypeScript error in the English locale file. This is the correct behavior — but if the developer relies on `pnpm dev` for feedback (which does not run full type checking), the error is invisible locally and only surfaces in CI.

**Why it happens:**
Developers add UI strings when building the Korean-first UI, intend to add English strings "later," and forget before committing. The Next.js dev server does not enforce TypeScript strictly.

**How to avoid:**
Add both locale strings in the same commit as the UI component that consumes them. The `Translations` type should NOT be weakened to `Partial`. Run `pnpm typecheck` (not just `pnpm dev`) before committing any i18n change. The tab-related strings needed are: `pluginsPage.tabAll`, `pluginsPage.tabMcp`, `pluginsPage.tabPlugin` at minimum.

**Warning signs:**
- `pnpm dev` works but `pnpm build` fails with an i18n type error
- Diff shows changes to `ko.ts` but not `en.ts` (or vice versa)
- New component uses `t.pluginsPage.tabPlugin` which does not yet exist in the `Translations` type

**Phase to address:** Phase 5 (i18n update) — strings must be added alongside their UI consumers, not deferred

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Make `type` optional in `Plugin` | Skip updating 42 entries | `undefined` leaks into every consumer; requires `?? 'mcp'` fallback everywhere | Never — `DEFAULT_PLUGIN_FIELDS` default costs nothing |
| Use `PluginCategory` values to represent MCP/Plugin tab | Single state variable | Contaminates scoring `ALL_CATEGORIES`; i18n `categories` Record needs new keys | Never |
| Keep pseudo-plugin factory in `parseMcpList`, add `type: 'mcp'` default | Suppress TypeScript error quickly | Plugin list tokens labeled as MCPs; silently wrong type-aware results | Never after Plugin entries exist |
| Inline `plugin.type === 'mcp'` checks in each consumer | Fast | No central filter; adding a third type requires hunting all call sites | Never — centralise behind a typed filter function |
| Defer i18n English strings to a follow-up commit | Ship Korean UI faster | Build fails in CI; PR cannot merge | Never |
| Copy `scorePlugins` into a new function for Plugin-only path | No risk to existing optimizer | Two diverging scoring implementations; tests must double | Only if rollback safety is critical; remove old version in same milestone |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `parseMcpList` pseudo-plugin factory | Add `type: 'mcp'` to suppress TypeScript error, apply to all branches | Delete the factory; pass real `Plugin[]` filtered by type to the parser |
| `PLUGINS` record in `scoring.ts` | Call `Object.values(PLUGINS)` without type filter after Plugin entries are added | Filter by `plugin.type` before building complement/replacement candidates |
| `PluginGrid` + `PluginSearch` filter chain | Add `'mcp'` / `'plugin'` as category values | Add separate `activeType` state; keep `PluginCategory` closed |
| `conflicts.ts` `CONFLICT_PAIRS` | Define MCP-Plugin cross-type conflicts using same structure | Cross-type conflicts are valid — `CONFLICT_PAIRS` structure handles them; just add the pair with both IDs |
| `lib/__tests__/parse-mcp-list.test.ts` mock objects | Leave mock `Plugin` objects without `type` field | Update all mock objects when `type` becomes required; `pnpm typecheck` catches this |
| `lib/__tests__/scoring.test.ts` | Tests assert `complements` IDs without checking `plugin.type` | Add assertions that complements for MCP-only input are all `type === 'mcp'` |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| `Object.values(PLUGINS)` called inside every `buildComplements` invocation | Negligible at 57 entries; measurable at 200+ | Memoize filtered arrays outside the function (one `const MCP_PLUGINS` and `const PLUGIN_PLUGINS` at module level) | Not a concern for v1.2 scope |
| `filterPlugins` in `parse-mcp-list.ts` scans all plugins on every keypress in `PluginTypeInput` | Slight lag at 150+ entries | Already capped at 8 results; add debounce if > 100 entries | At ~150 entries |
| `scorePlugins` called synchronously inside `setTimeout(0)` in `OptimizerApp` | Fine at 57 entries | Keep as-is; scoring is O(n) with small n | Not a concern for v1.2 scope |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Plugin tab shows 0 entries if Plugin DB is not yet populated when the tab UI ships | User thinks the feature is broken | Either ship tab UI simultaneously with the first Plugin entries, or show an "empty state" message with context |
| Category filter not reset when switching between MCP and Plugin tabs | User sees 0 results because their selected category only has MCP entries | Reset `activeCategory` to `'all'` when `activeType` changes |
| Score display in optimizer still says "MCP 조합 점수" after Plugin entries are included in scoring | User confusion about what was scored | Update score label to reflect the submission type: "MCP 점수", "Plugin 점수", or "MCP + Plugin 점수" |
| Optimizer paste area shows no hint for `claude plugin list` format | Plugin users see all their entries marked "unrecognized" and abandon the feature | Show a concrete example of both `claude mcp list` and `claude plugin list` output in the paste hint |
| Both tab clicks reset the category filter | Unexpected state loss when user had filtered by category before switching tabs | Preserve `activeCategory` across tab switches; only reset when the selected category has zero results in the new type |

---

## "Looks Done But Isn't" Checklist

- [ ] **`type` field migration:** All 42 existing entries resolve to `type: 'mcp'` at runtime — verify with `Object.values(PLUGINS).every(p => p.type !== undefined)`
- [ ] **Scoring type scope:** `scorePlugins(['context7', 'omc'])` returns `complements` that are all `type === 'mcp'` — verify no Plugin-type entries appear
- [ ] **`PluginCategory` unchanged:** `ALL_CATEGORIES` in `scoring.ts` still has exactly 10 entries — verify by count assertion in scoring tests
- [ ] **Tab URL state:** Navigate to `/plugins/[id]` from Plugin tab, press back — Plugin tab is still active — verify by manual navigation
- [ ] **Both locale files updated:** `pnpm build` passes without i18n type errors — verify after every new string addition (not just `pnpm dev`)
- [ ] **Parser sample updated:** `handleSampleData` in `OptimizerApp` includes a `❯` format line — verify in source
- [ ] **Test mocks updated:** All `Plugin` mock objects in `lib/__tests__/` include the `type` field — verify `pnpm typecheck` passes
- [ ] **Pseudo-plugin factory removed or fixed:** `parseMcpList` no longer constructs `Plugin` objects inline — verify by reading `parse-mcp-list.ts`

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| `type` optional, runtime `undefined` everywhere | MEDIUM | Make `type` required, add default to `DEFAULT_PLUGIN_FIELDS`, run `pnpm typecheck` to find all missed consumers, fix each |
| `PluginCategory` contaminated with tab values | HIGH | Revert `PluginCategory` type, add separate `PluginItemType = 'mcp' \| 'plugin'`, update `PluginGrid` state, verify `scoring.ts` and `recommend.ts` unchanged |
| Scoring surfaces Plugin complements for MCP-only input | LOW | Add type filter in `buildComplements` and `buildReplacements`, add regression test asserting type scope, no data migration needed |
| Tab state lost on navigation | LOW | Move `activeType` to URL query param, change `PluginGrid` to read `initialType` prop, update `app/plugins/page.tsx` to pass `searchParams` |
| i18n build failure | LOW | Add missing string keys to the failing locale file in the same commit |
| Pseudo-plugin factory gives wrong type to plugin list tokens | LOW | Delete factory, pass real filtered `Plugin[]` to parser, update call site in `OptimizerApp` |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| `type` not in `DEFAULT_PLUGIN_FIELDS` (optional leak) | Phase 1: DB type migration | `pnpm typecheck` passes with `type` required; `Object.values(PLUGINS).every(p => p.type)` is true |
| `parseMcpList` pseudo-factory broken by required `type` | Phase 1: DB type migration | `lib/__tests__/parse-mcp-list.test.ts` passes without `as Plugin` casts |
| Scoring surfaces Plugin complements for MCP-only input | Phase 2: Scoring extension | New test: `scorePlugins(mcpIds, {typeScope:'mcp'})` returns only `type === 'mcp'` complements |
| `ALL_CATEGORIES` penalty fires for Plugin-only categories | Phase 2: Scoring extension | Test: MCP-only user score unchanged after Plugin entries added to DB |
| `PluginCategory` contaminated by tab values | Phase 3: Tab UI | `PluginCategory` type diff shows no new values; `ALL_CATEGORIES.length === 10` assertion passes |
| Tab state lost on navigation | Phase 3: Tab UI | Manual nav test: Plugin tab preserved after `/plugins/[id]` navigation |
| Optimizer paste hint not updated | Phase 4: Parser + optimizer UI | Both locale files show updated paste hint; `handleSampleData` includes `❯` format line |
| i18n strings missing in one locale | Phase 5: i18n update | `pnpm build` succeeds; both `ko.ts` and `en.ts` compile against `Translations` type |

---

## Sources

- Direct inspection: `lib/types.ts` — `Plugin` type, `PluginCategory` union (HIGH confidence)
- Direct inspection: `lib/plugins.ts` — `DEFAULT_PLUGIN_FIELDS`, `PLUGIN_FIELD_OVERRIDES` seed pattern (HIGH confidence)
- Direct inspection: `lib/scoring.ts` — `ALL_CATEGORIES`, `buildComplements`, `buildReplacements`, `scorePlugins` (HIGH confidence)
- Direct inspection: `lib/parse-mcp-list.ts` — pseudo-plugin factory, `isPluginList` branch, `ALIAS_MAP` (HIGH confidence)
- Direct inspection: `lib/conflicts.ts` — `CONFLICT_PAIRS`, `REDUNDANCY_GROUPS` (HIGH confidence)
- Direct inspection: `components/PluginGrid.tsx` — local `useState` for filter state (HIGH confidence)
- Direct inspection: `components/OptimizerApp.tsx` — `handleSampleData`, paste flow (HIGH confidence)
- Direct inspection: `lib/i18n/types.ts` — required `Translations` type structure (HIGH confidence)
- Direct inspection: `lib/__tests__/scoring.test.ts`, `lib/__tests__/parse-mcp-list.test.ts` — test coverage gaps (HIGH confidence)
- Project context: `.planning/PROJECT.md` — v1.2 milestone scope (HIGH confidence)

---
*Pitfalls research for: Adding Plugin type system to MCP Plugin Advisor (v1.2 milestone)*
*Researched: 2026-03-18*
