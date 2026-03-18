# Architecture Research

**Domain:** MCP + Plugin type system integration into existing Plugin Advisor
**Researched:** 2026-03-18
**Confidence:** HIGH — based on direct source reading of all integration surfaces

---

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Pages (Next.js App Router)                    │
│  ┌──────────────┐  ┌────────────────────┐  ┌──────────────────────┐ │
│  │  /plugins    │  │  /optimizer        │  │  /advisor            │ │
│  │  (Server SC) │  │  (Client SC)       │  │  (Client SC)         │ │
│  └──────┬───────┘  └─────────┬──────────┘  └──────────────────────┘ │
│         │                    │                                        │
├─────────┴────────────────────┴────────────────────────────────────---┤
│                     UI Components (Client)                            │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ PluginGrid  │  │ OptimizerApp │  │PluginTypeIn- │  │ResultsP- │  │
│  │ +typeFilter │  │ (no change)  │  │put +typeBadge│  │anel (no  │  │
│  │ tab NEW     │  │              │  │ MINOR        │  │ change)  │  │
│  └─────────────┘  └──────────────┘  └──────────────┘  └──────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│                         lib/ (Pure Logic)                             │
│  ┌───────────┐  ┌────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ types.ts  │  │ plugins.ts │  │  scoring.ts  │  │ conflicts.ts │  │
│  │ +ItemType │  │ +type field│  │  NO CHANGE   │  │  NO CHANGE   │  │
│  │ +type on  │  │ +10-15 new │  │  (ID-based)  │  │  (ID-based)  │  │
│  │  Plugin   │  │  entries   │  │              │  │              │  │
│  └───────────┘  └────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────────────┐  ┌──────────────────────────────────────┐  │
│  │ parse-mcp-list.ts    │  │ i18n/ (types.ts + ko.ts + en.ts)     │  │
│  │ VERIFY existing      │  │ ADD: pluginsPage tab keys            │  │
│  │ plugin list branch   │  │ ADD: type label keys                 │  │
│  └──────────────────────┘  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Change in v1.2 |
|-----------|----------------|----------------|
| `lib/types.ts` | All shared TypeScript types | ADD `ItemType = 'mcp' \| 'plugin'`; ADD `type: ItemType` field to `Plugin` |
| `lib/plugins.ts` | Static DB: `PLUGINS` record + `DEFAULT_PLUGIN_FIELDS` + `PLUGIN_FIELD_OVERRIDES` | ADD `type` to `DEFAULT_PLUGIN_FIELDS` (default `'mcp'`); ADD 10-15 new Plugin entries with `type: 'plugin'` |
| `lib/scoring.ts` | `scorePlugins(ids)` — deduction model, coverage, complements, replacements | NO CHANGE — operates on IDs only; type-agnostic by design |
| `lib/conflicts.ts` | `getConflicts()`, `getRedundancies()` — hardcoded ID pairs | NO CHANGE — ID-based; works for both types |
| `lib/parse-mcp-list.ts` | `parseMcpList()`, `filterPlugins()`, `resolvePluginId()` | VERIFY existing `isPluginList` branch handles new Plugin IDs; ADD to `ALIAS_MAP` only if needed |
| `components/PluginGrid.tsx` | Filterable grid of all plugins — category + search | ADD `typeFilter` state + tab pill row + filter predicate |
| `components/PluginSearch.tsx` | Search input + category filter pills | NO CHANGE — category filter remains; type tab lives in PluginGrid |
| `components/PluginTypeInput.tsx` | Autocomplete for optimizer manual input | MINOR: add type badge in dropdown items |
| `components/OptimizerApp.tsx` | Orchestrates optimizer input + analysis | NO CHANGE — already consumes unified `PLUGINS` + `parseMcpList` |
| `app/plugins/page.tsx` | Server component shell for /plugins | NO CHANGE — PluginGrid owns its own tab state |
| `lib/i18n/types.ts` | Translation shape contract | ADD keys: `pluginsPage.tabAll`, `tabMcp`, `tabPlugin` |
| `lib/i18n/ko.ts` + `en.ts` | Translation values | ADD values for new keys |

---

## Recommended Project Structure

```
lib/
├── types.ts              # MODIFY: add ItemType + type field on Plugin
├── plugins.ts            # MODIFY: add type to DEFAULT_PLUGIN_FIELDS + new Plugin entries
├── scoring.ts            # NO CHANGE
├── conflicts.ts          # NO CHANGE
├── parse-mcp-list.ts     # VERIFY + minor ALIAS_MAP additions if needed
└── i18n/
    ├── types.ts          # MODIFY: add pluginsPage tab keys
    ├── ko.ts             # MODIFY: add Korean values
    └── en.ts             # MODIFY: add English values

components/
├── PluginGrid.tsx        # MODIFY: add typeFilter state + tab pills + filter
├── PluginSearch.tsx      # NO CHANGE
├── PluginTypeInput.tsx   # MINOR MODIFY: type badge in autocomplete dropdown
├── OptimizerApp.tsx      # NO CHANGE
├── SelectedPluginChips.tsx  # OPTIONAL: type badge on chip (safe to defer)
└── ResultsPanel.tsx      # NO CHANGE

app/plugins/page.tsx      # NO CHANGE
```

### Structure Rationale

- **`lib/types.ts` is the single source of truth for the `type` field.** Every downstream file (`plugins.ts`, `PluginGrid`, `PluginTypeInput`) derives from it.
- **`lib/plugins.ts` default is `'mcp'`.** All 42 existing entries represent MCP servers. A default in `DEFAULT_PLUGIN_FIELDS` means zero line-by-line edits to existing entries.
- **`app/plugins/page.tsx` stays a thin server shell.** Tab state is ephemeral client UI — it belongs in `PluginGrid`, same as the existing `category` and `search` state.
- **`scoring.ts` and `conflicts.ts` unchanged.** The deduction model is category-coverage-based, not type-based. This boundary is correct and should not be crossed.

---

## Architectural Patterns

### Pattern 1: Additive Field with Default — Zero Breaking Change

**What:** Add `type: ItemType` as a required field to `Plugin`. Set `type: 'mcp'` in `DEFAULT_PLUGIN_FIELDS`. All 42 existing entries receive the default without touching any individual entry. New Plugin entries explicitly declare `type: 'plugin'`.

**When to use:** Extending a record type where all existing records share the same new value.

**Trade-offs:** Required field ensures new entries cannot be added without declaring type (TypeScript enforcement). Default means zero migration cost for existing data. The `PluginSeed` / `PluginOperationalFields` split in `plugins.ts` means `type` should be added to `PluginOperationalFields` so it participates in the override/default system.

**Example:**
```typescript
// lib/types.ts
export type ItemType = 'mcp' | 'plugin';

export type Plugin = {
  // ... all existing fields unchanged ...
  type: ItemType;   // ADD — required
};

// lib/plugins.ts — add to PluginOperationalFields and DEFAULT_PLUGIN_FIELDS
const DEFAULT_PLUGIN_FIELDS: PluginOperationalFields = {
  // ... all existing defaults unchanged ...
  type: 'mcp',   // ADD — all existing entries inherit this
};
```

### Pattern 2: Composable Filters in PluginGrid

**What:** Add a `typeFilter` state (`'all' | 'mcp' | 'plugin'`) to `PluginGrid.tsx` alongside the existing `category` and `search` state. All three filters compose with AND logic in the single `filtered` array. No new sub-component needed — a tab pill row sits above the existing `PluginSearch`.

**When to use:** When filter dimensions are independent (type does not affect category; category does not affect type).

**Trade-offs:** All filter state in one component. Simple. Passing `typeFilter` to `PluginSearch` is an option but adds prop complexity for no gain — PluginGrid already owns `category` state directly.

**Example:**
```typescript
// components/PluginGrid.tsx
const [typeFilter, setTypeFilter] = useState<ItemType | 'all'>('all');

const filtered = allPlugins.filter((p) => {
  if (typeFilter !== 'all' && p.type !== typeFilter) return false;
  if (category !== 'all' && p.category !== category) return false;
  if (!search.trim()) return true;
  const q = search.toLowerCase();
  return (
    p.name.toLowerCase().includes(q) ||
    p.desc.toLowerCase().includes(q) ||
    p.keywords.some((kw) => kw.toLowerCase().includes(q))
  );
});
```

### Pattern 3: Unified Scoring — Type-Agnostic ID Model

**What:** `scorePlugins(ids: string[])` operates on IDs only. MCP and Plugin entries coexist in the same `PLUGINS` record under unique IDs. The scoring engine, conflict detection, and redundancy detection work correctly for mixed combos without any changes.

**When to use:** When the existing abstraction is already correct — do not add type-branching inside scoring functions.

**Trade-offs:** Zero migration cost. `buildCoverage` counts `category` coverage regardless of item type — intentionally correct (a Plugin covering `workflow` is valid coverage). `buildComplements` will now naturally suggest Plugin-type entries when a category is uncovered, which is the desired behavior. `buildReplacements` is also type-agnostic, which is correct.

**No code change required in `scoring.ts` or `conflicts.ts`.**

---

## Data Flow

### /plugins Page — Type Tab Filter Flow

```
User clicks "Plugin" tab in PluginGrid
    ↓
setTypeFilter('plugin')
    ↓
filtered = allPlugins.filter(p =>
  p.type === 'plugin'          // typeFilter predicate
  && categoryMatch             // existing predicate
  && searchMatch               // existing predicate
)
    ↓
PluginGridCard renders filtered results (no change to card itself)
```

### /optimizer — Mixed MCP + Plugin Combo Flow

```
User pastes `claude mcp list` OR `claude plugin list` output
    ↓
parseMcpList(raw, Object.keys(PLUGINS))
    matched:   ['context7', 'omc', 'fireauto']   ← MCP and Plugin IDs mixed
    unmatched: ['some-unknown-server']
    ↓
OptimizerApp: setSelectedPlugins(matched.map(id => PLUGINS[id]))
    ↓
User clicks "분석"
    ↓
scorePlugins(selectedIds)
    getConflicts(ids)           ID-based, type-agnostic, no change
    getRedundancies(ids)        ID-based, type-agnostic, no change
    buildCoverage(ids)          category-based, type-agnostic, no change
    buildComplements(...)       recommends best-ranked per uncovered category
                                now includes Plugin-type candidates automatically
    buildReplacements(...)      verificationStatus/maintenanceStatus based, no change
    ↓
ResultsPanel renders ScoringResult — no change
```

### New Plugin Entry Registration Flow

```
New Plugin entry added to lib/plugins.ts:
  { id: 'fireauto', type: 'plugin', category: 'workflow', ... }
    ↓
Automatically available across entire system:
  Object.values(PLUGINS)  →  PluginGrid catalog + typeFilter
  Object.keys(PLUGINS)    →  parseMcpList candidate resolution
  PLUGINS[id]             →  scorePlugins lookups, conflict checks
  filterPlugins()         →  PluginTypeInput autocomplete
  resolvePluginId()       →  paste input matching
```

---

## Integration Points — New vs Modified Files

### Files That Must Change

| File | Change Type | What Changes |
|------|-------------|--------------|
| `lib/types.ts` | ADD | `ItemType` type alias; `type: ItemType` field on `Plugin` |
| `lib/plugins.ts` | ADD | `type` in `PluginOperationalFields` pick list; `type: 'mcp'` in `DEFAULT_PLUGIN_FIELDS`; 10-15 new Plugin entries with `type: 'plugin'` |
| `lib/i18n/types.ts` | ADD keys | `pluginsPage.tabAll`, `pluginsPage.tabMcp`, `pluginsPage.tabPlugin` |
| `lib/i18n/ko.ts` | ADD values | Korean text for new tab keys |
| `lib/i18n/en.ts` | ADD values | English text for new tab keys |
| `components/PluginGrid.tsx` | MODIFY | `typeFilter` state; tab pill row UI; filter predicate extension |

### Files With Minor Touches

| File | Change Type | What Changes |
|------|-------------|--------------|
| `lib/parse-mcp-list.ts` | VERIFY only | `isPluginList` branch already handles `❯ name@source` format. Confirm new Plugin IDs resolve correctly. Add entries to `ALIAS_MAP` only if normalization fails for specific names. No logic rewrite. |
| `components/PluginTypeInput.tsx` | MINOR MODIFY | Add type badge (`MCP` / `Plugin`) next to plugin name in dropdown items |
| `components/SelectedPluginChips.tsx` | OPTIONAL | Type badge on chip in optimizer. Safe to defer to a later task. |

### Files That Do Not Change

| File | Reason |
|------|--------|
| `lib/scoring.ts` | Type-agnostic ID model is already correct for mixed combos |
| `lib/conflicts.ts` | ID-based; `CONFLICT_PAIRS` and `REDUNDANCY_GROUPS` remain valid |
| `components/OptimizerApp.tsx` | Already uses unified `PLUGINS` + `parseMcpList`; no new behavior required |
| `components/PluginSearch.tsx` | Category filter unchanged; type tab lives in PluginGrid, not here |
| `app/plugins/page.tsx` | Thin server shell; tab state belongs in PluginGrid client component |
| `components/ResultsPanel.tsx` | `ScoringResult` shape unchanged |
| `components/PluginGridCard.tsx` | Card rendering unchanged; type badge is optional and lives in Grid context if needed |

---

## Build Order (Dependency Graph)

The critical path flows `lib/types.ts` → `lib/plugins.ts` → UI components. Work in this sequence to avoid TypeScript errors at each step.

```
Step 1 — lib/types.ts
  ADD: ItemType = 'mcp' | 'plugin'
  ADD: type field to Plugin
  Verification: pnpm typecheck passes (all 42 existing entries
                will error until Step 2)

Step 2 — lib/plugins.ts
  ADD: type to PluginOperationalFields pick + DEFAULT_PLUGIN_FIELDS
  ADD: 10-15 new Plugin entries with type: 'plugin'
  Verification: pnpm typecheck passes, pnpm test passes (no scoring
                changes so all 104 tests remain green)

Step 3 — lib/i18n/types.ts + ko.ts + en.ts
  ADD: tab translation keys
  Verification: pnpm typecheck passes

Step 4 — components/PluginGrid.tsx
  ADD: typeFilter state + tab pill UI + filter predicate
  Verification: /plugins page shows MCP/Plugin/All tabs and
                filters correctly; Plugin entries appear under Plugin tab

Step 5 — lib/parse-mcp-list.ts (verify/adjust)
  VERIFY: paste `claude plugin list` output with new Plugin IDs
  ADD to ALIAS_MAP: only entries that fail resolvePluginId
  Verification: pnpm test (parser tests pass); manual paste test
                in optimizer shows Plugin IDs matched

Step 6 — components/PluginTypeInput.tsx
  ADD: type badge in dropdown suggestion items
  Verification: optimizer type-input autocomplete shows MCP/Plugin
                badge next to each suggestion

Step 7 — components/SelectedPluginChips.tsx (optional)
  ADD: type badge on selected chip
  Verification: optimizer selected chips show type indicator
  Note: safe to defer; zero functional impact
```

---

## Anti-Patterns

### Anti-Pattern 1: Separate PLUGINS Records per Type

**What people do:** Create `MCP_PLUGINS` and `EXT_PLUGINS` as separate records, then merge them at export.

**Why it's wrong:** Every call site uses `PLUGINS[id]`, `Object.keys(PLUGINS)`, `Object.values(PLUGINS)`. A split record doubles every lookup and requires merge logic at every consumer. The `type` field is exactly the right mechanism to distinguish at the data level.

**Do this instead:** Single `PLUGINS` record. Distinguish by `p.type` in filter predicates.

### Anti-Pattern 2: Type Branching Inside Scoring Functions

**What people do:** Add `if (plugin.type === 'plugin') { ... }` branches inside `scorePlugins`, `buildCoverage`, or `buildComplements`.

**Why it's wrong:** The scoring model is category-coverage-based. Whether an item is an MCP server or a Plugin, covering the `workflow` category is equally valid. Type-aware branching makes scoring asymmetric without a product rationale.

**Do this instead:** Keep scoring type-agnostic. If a future decision requires weighting Plugin-type coverage differently, add a named penalty constant — do not branch on `type` inside existing scoring functions.

### Anti-Pattern 3: Tab State in Server Component

**What people do:** Lift the MCP/Plugin tab into `app/plugins/page.tsx` as a URL search param.

**Why it's wrong:** This adds URL routing complexity for ephemeral UI state. The existing `PluginGrid` already owns `category` and `search` as plain `useState` — the type tab is the same kind of filter state.

**Do this instead:** Add `typeFilter` state to `PluginGrid.tsx` alongside existing state. Keep `app/plugins/page.tsx` as a stateless server shell.

### Anti-Pattern 4: Rewriting the Parser for Plugin Format

**What people do:** Build a separate code path in `parse-mcp-list.ts` for `claude plugin list` output because it looks different from `claude mcp list`.

**Why it's wrong:** The `isPluginList` branch already exists and handles the `❯ name@source` format. New Plugin IDs resolve through the same `resolvePluginId` function. The parser already handles both formats.

**Do this instead:** Verify the existing `isPluginList` branch works with new Plugin IDs. Add to `ALIAS_MAP` only for entries that need specific name normalization. Do not rewrite the parser.

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 42 MCPs + 15 Plugins (~57 items) | Static `PLUGINS` record is appropriate — O(1) lookup, zero API cost, ~600-line file |
| 100+ items | Static record still fine; consider splitting `plugins.ts` into `mcp-plugins.ts` + `plugin-plugins.ts` merged at the export boundary |
| 500+ items | Move DB to Supabase with static JSON build cache; existing Supabase infra already supports this pattern |

### Scaling Priorities

1. **First bottleneck:** Bundle size of `lib/plugins.ts`. At 57 entries the file remains manageable. If it approaches 800+ lines, split by type into separate files with a unified re-export.
2. **Second bottleneck:** `filterPlugins` is O(n) linear scan — fine up to ~200 items before needing an indexed structure.

---

## Sources

- Direct source reading: `lib/types.ts`, `lib/plugins.ts`, `lib/scoring.ts`, `lib/conflicts.ts`, `lib/parse-mcp-list.ts`
- Direct source reading: `components/OptimizerApp.tsx`, `components/PluginGrid.tsx`, `components/PluginSearch.tsx`, `components/PluginTypeInput.tsx`
- Direct source reading: `app/plugins/page.tsx`, `lib/i18n/types.ts`
- Project context: `.planning/PROJECT.md` — v1.2 milestone requirements and key decisions
- Confidence: HIGH — all integration surfaces read from source; no documentation inference

---
*Architecture research for: MCP + Plugin type system integration (v1.2)*
*Researched: 2026-03-18*
