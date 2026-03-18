# Stack Research

**Domain:** Plugin type system extension — adding `type: 'mcp' | 'plugin'` to existing Plugin DB, building 10-15 Claude plugin entries, tab UI separation on /plugins, and unified scoring in /optimizer.
**Researched:** 2026-03-18
**Confidence:** HIGH (all findings based on direct codebase inspection, no external dependencies required)

---

## Context: This is an additive milestone, not a rewrite

The existing stack (Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Vitest) handles everything this milestone requires. **Zero new runtime dependencies are needed.** All changes are data modeling, type additions, and UI wiring within the existing codebase.

---

## Recommended Stack

### Core Technologies (unchanged)

| Technology | Version | Purpose | Why Relevant to This Milestone |
|------------|---------|---------|-------------------------------|
| TypeScript | ~5.x | Type system for `PluginType` discriminant | Discriminated union `type: 'mcp' \| 'plugin'` is a first-class TS pattern; no library needed |
| Next.js 14 App Router | 14.x | Page/component framework | /plugins tab UI uses existing server-component page + client PluginGrid pattern |
| Tailwind CSS | 3.x | Tab indicator styling | Active tab state already uses inline className toggling; same pattern for MCP/Plugin tabs |
| shadcn/ui Tabs | current | Tab UI components | `TabsList` + `TabsTrigger` are already imported in `OptimizerApp.tsx` — reuse exact same components |
| Vitest | current | Unit tests for scoring with mixed MCP+plugin IDs | Existing 104-test suite covers scoring; new plugin entries need matching test data additions |

### Supporting Libraries (unchanged)

| Library | Version | Purpose | Notes for This Milestone |
|---------|---------|---------|--------------------------|
| lucide-react | current | Tab icons (e.g., `Server`, `Puzzle`) | Already in bundle; use for MCP/Plugin tab icons if desired |
| clsx / cn utility | current | Conditional classNames on tab active state | `cn()` from `lib/utils` already used throughout |

### Development Tools (unchanged)

| Tool | Purpose | Notes |
|------|---------|-------|
| pnpm | Package manager | No new packages to install for this milestone |
| TypeScript compiler (`pnpm typecheck`) | Validate discriminated union exhaustiveness | Run after every type change; `never` checks will catch missing `type` branches |

---

## Installation

```bash
# No new dependencies required for this milestone.
# All changes are in existing source files only.
```

---

## Specific Changes by Layer

### 1. lib/types.ts — Add `PluginType` discriminant

**What to add:**

```typescript
export type PluginType = 'mcp' | 'plugin';
```

**What to change on `Plugin` type:**

Add one optional field (optional avoids a mass migration breaking 42 existing entries):

```typescript
export type Plugin = {
  // ...existing fields...
  type?: PluginType;   // undefined treated as 'mcp' for backward compatibility
};
```

**Why optional, not required:**
- 42 existing MCP entries in `CORE_PLUGINS` use `PluginSeed` (which is `Omit<Plugin, keyof PluginOperationalFields>`). Making `type` required would force touching all 42 seeds immediately.
- A helper `getPluginType(plugin: Plugin): PluginType` that returns `plugin.type ?? 'mcp'` provides a clean read path everywhere.
- When the field is added, TypeScript will not error on existing entries — they default to `'mcp'` at runtime.

**Alternative considered:** Required field with default in `DEFAULT_PLUGIN_FIELDS`.
- `DEFAULT_PLUGIN_FIELDS` in `plugins.ts` covers `PluginOperationalFields`, and `type` is not in that Pick. It would need to be added to `PluginOperationalFields` or `PluginSeed`.
- **Recommended approach:** Add `type` to `PluginOperationalFields` with `type: 'mcp'` as the default. This means all 42 existing entries automatically get `type: 'mcp'` via `DEFAULT_PLUGIN_FIELDS` merging, and new plugin entries can override with `type: 'plugin'` in `PLUGIN_FIELD_OVERRIDES`.

**Final recommendation:** Add `type: PluginType` to `PluginOperationalFields` in `plugins.ts`, set `type: 'mcp'` in `DEFAULT_PLUGIN_FIELDS`, make it required in the `Plugin` type. Zero churn to existing 42 entries.

### 2. lib/plugins.ts — Add Plugin entries

**Structure:** New entries go in `CORE_PLUGINS` as `PluginSeed` (same shape as existing entries). Their `type: 'plugin'` override goes in `PLUGIN_FIELD_OVERRIDES`.

**Target entries (10-15 plugins):**

| ID | Name | Install mechanism |
|----|------|-------------------|
| `omc` | Oh My ClaudeCode | Already in DB — add `type: 'plugin'` override |
| `fireauto` | FireAuto | Already in DB — add `type: 'plugin'` override |
| `superpowers` | Superpowers | Already in DB — confirm type (plugin or mcp?) |
| `gsd` | GSD | Already in DB — add `type: 'plugin'` override |
| `bkit` | bkit | Already in DB — confirm type |
| `bkit-starter` | bkit Starter | Already in DB — confirm type |
| `agency-agents` | The Agency | Already in DB — add `type: 'plugin'` override |
| `taskmaster` | Taskmaster | Already in DB — confirm type |
| `sequential-thinking` | Sequential Thinking | MCP — keep as `'mcp'` |
| `document-skills` | (new entry) | `type: 'plugin'` |

**Key insight from codebase:** Several "plugin" type entries already exist in the DB as MCP-alike entries (omc, fireauto, gsd, bkit, agency-agents use `installMode: 'safe-copy'` and install via `/plugin marketplace add` or `git clone` — not via `claude mcp add`). These are the natural first wave of `type: 'plugin'` entries. Classification rule:

- `install` commands starting with `/plugin` or `git clone` + copy to `~/.claude/` → `type: 'plugin'`
- `install` commands using `claude mcp add` / `npx` / `uvx` / remote HTTP → `type: 'mcp'`

### 3. lib/parse-mcp-list.ts — Add `claude plugin list` support

**Current state:** `parseMcpList` already detects the `claude plugin list` format via `isPluginList = lines.some((l) => /^\s*❯\s/.test(l))` and handles `❯ name@source` tokens.

**What's needed:** The function signature takes a flat `pluginIds: string[]`. When Plugin entries are added to the DB, they'll be included automatically. The parser already handles both formats in one function.

**Recommendation:** Keep the single `parseMcpList` function. Pass `Object.keys(PLUGINS)` (which will include both MCPs and plugins after the DB expansion) as the `pluginIds` argument. No function signature change needed.

### 4. lib/scoring.ts — Unified scoring (no changes needed)

**Current state:** `scorePlugins(ids: string[])` operates purely on IDs and looks up `PLUGINS[id]`. It uses `plugin.category` for coverage calculation and `plugin.verificationStatus` / `plugin.maintenanceStatus` for replacements.

**Impact of adding Plugin type:** None. The scoring model is category-based, not type-based. A `type: 'plugin'` entry with `category: 'orchestration'` scores identically to an `'mcp'` with the same category. This is the correct behavior — the 100-point deduction model does not need to differentiate by type.

**Recommendation:** No changes to `lib/scoring.ts`. The unified scoring goal in the milestone is already achieved by the existing design.

### 5. /plugins page — MCP | Plugin tab separation

**Current state:** `PluginGrid.tsx` filters by `PluginCategory | "all"` state. It reads from `Object.values(PLUGINS)` and renders `PluginGridCard` per entry.

**What to add:** A `type: PluginType | "all"` filter state in `PluginGrid`, rendered as a `TabsList` / `TabsTrigger` pair (same components already used in `OptimizerApp.tsx`). The filter logic becomes:

```typescript
const filtered = allPlugins.filter((p) => {
  if (typeFilter !== "all" && getPluginType(p) !== typeFilter) return false;
  if (category !== "all" && p.category !== category) return false;
  // ...search filter unchanged...
});
```

**Component boundary:** The tab UI lives inside `PluginGrid.tsx` (client component, already `"use client"`). No new component file needed. The `PluginsPage` server component (`app/plugins/page.tsx`) requires no changes.

**shadcn/ui Tab reuse:** `TabsList` and `TabsTrigger` from `components/ui/tabs` are already used in `OptimizerApp.tsx` with the same className pattern. Copy exact same usage pattern — no new UI primitives needed.

### 6. lib/i18n/types.ts + ko.ts + en.ts — i18n additions

**What to add to `Translations` type:**

```typescript
pluginsPage: {
  // existing fields...
  tabAll: string;
  tabMcp: string;
  tabPlugin: string;
};
```

**Scope:** 3 new keys in `pluginsPage` section. The `optimizer` section already has all required keys for the unified analysis UI. No optimizer i18n changes needed.

---

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| Add `type` to `PluginOperationalFields` with default `'mcp'` | Add `type` as required field directly on `Plugin` with no default | Would require touching all 42 `CORE_PLUGINS` seeds; higher blast radius for no benefit |
| Single `PLUGINS` map (both MCPs and plugins) | Separate `MCP_PLUGINS` and `PLUGINS` maps | Scoring, autocomplete, and parser all use `Object.values(PLUGINS)` — splitting would require updates to 6+ call sites |
| Single `parseMcpList` function handles both formats | Separate `parsePluginList` function | Parser already detects `isPluginList` format; splitting adds duplication without benefit |
| Keep `scorePlugins` type-agnostic | Type-specific scoring penalties for plugins vs MCPs | Premature; the milestone goal is unified scoring at same penalty model. Type-specific rules can be added later. |
| Filter tabs in `PluginGrid.tsx` | New `PluginGridWithTabs` wrapper component | `PluginGrid` is already a client component with filter state; adding one more state variable is minimal and doesn't push it past the 200-line limit |

---

## What NOT to Add

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| New UI library (framer-motion, radix Tabs primitive directly) | Project already committed to pure CSS transitions and shadcn/ui wrappers | `TabsList` + `TabsTrigger` from `components/ui/tabs` (already in bundle) |
| Separate `plugins` DB file (e.g., `lib/plugins-only.ts`) | Creates import split; scoring/parser/autocomplete would need conditional imports | Single `lib/plugins.ts` with `type` field as discriminant |
| Database/API for plugin type classification | All data is static; type is a metadata field not a runtime concern | Inline `type` field in `PLUGIN_FIELD_OVERRIDES` in `lib/plugins.ts` |
| Runtime type guard libraries (zod, io-ts) | Overkill for a two-value discriminant | TypeScript discriminated union + exhaustiveness check via `never` |
| New `PluginType` filter as a URL query param | Adds routing complexity; no requirement for shareable filtered URLs in this milestone | Local `useState` in `PluginGrid.tsx` (same pattern as existing `category` filter) |

---

## Stack Patterns by Variant

**Adding a new plugin entry (type: 'plugin'):**
- Add `PluginSeed` to `CORE_PLUGINS` in `lib/plugins.ts` with install commands using `/plugin` or `git clone` pattern
- Add `PLUGIN_FIELD_OVERRIDES` entry with `type: 'plugin'` plus any non-default operational fields
- Add English translations to `lib/i18n/plugins-en.ts` (desc + reasons)

**Adding a new MCP entry:**
- Same as before; `DEFAULT_PLUGIN_FIELDS` provides `type: 'mcp'` automatically
- No `PLUGIN_FIELD_OVERRIDES` entry needed unless overriding other fields

**Tab filtering in PluginGrid:**
- Add `typeFilter: PluginType | 'all'` state
- Add `TabsList` block above the existing category filter
- Filter predicate: check type first, then category, then search

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| shadcn/ui Tabs | Current Next.js 14 + Tailwind 3 | Already in use in `OptimizerApp.tsx`; no version concern |
| TypeScript discriminated unions | TS ~5.x | `PluginType = 'mcp' \| 'plugin'` is standard TS, no version concern |

---

## Sources

- Direct codebase inspection — `lib/types.ts`, `lib/plugins.ts`, `lib/scoring.ts`, `lib/parse-mcp-list.ts`, `lib/conflicts.ts`, `components/PluginGrid.tsx`, `components/OptimizerApp.tsx`, `lib/i18n/types.ts`, `lib/i18n/ko.ts` — HIGH confidence
- `.planning/PROJECT.md` — milestone requirements and constraints — HIGH confidence
- No external research required; all decisions based on existing code patterns

---

*Stack research for: Plugin Advisor v1.2 — MCP + Plugin type system*
*Researched: 2026-03-18*
