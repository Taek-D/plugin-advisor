# Architecture Research

**Domain:** Static DB extension — adding 10-15 new MCP/Plugin entries to existing 51-entry DB
**Researched:** 2026-03-18
**Confidence:** HIGH — all findings from direct source inspection of every integration surface

---

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER (lib/)                           │
├───────────────────────────────────────────────────────────────────--┤
│  plugins.ts                                                         │
│  ┌──────────────────────┐   ┌──────────────────────┐               │
│  │ CORE_PLUGINS         │   │ PLUGIN_FIELD_OVERRIDES│               │
│  │ Record<id,PluginSeed>│   │ Partial<Record<id,    │               │
│  │                      │   │  Partial<Operational>>>│              │
│  │ Semantic data:       │   │                       │               │
│  │  id, name, tag,      │   │ Operational data:     │               │
│  │  color, category,    │   │  verificationStatus,  │               │
│  │  desc, longDesc,     │   │  difficulty, type,    │               │
│  │  url, githubRepo,    │   │  installMode,         │               │
│  │  install[], features,│   │  requiredSecrets,     │               │
│  │  conflicts[],        │   │  bestFor, avoidFor    │               │
│  │  keywords[]          │   │                       │               │
│  └──────────┬───────────┘   └──────────┬────────────┘               │
│             │                          │                            │
│             │   DEFAULT_PLUGIN_FIELDS  │                            │
│             │   (type:"mcp", partial,  │                            │
│             │    safe-copy, …)         │                            │
│             │         │                │                            │
│             ▼         ▼                ▼                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  PLUGINS export = Object.fromEntries(                        │   │
│  │    { ...DEFAULT_PLUGIN_FIELDS,                               │   │
│  │      ...PLUGIN_FIELD_OVERRIDES[id],                          │   │
│  │      ...CORE_PLUGINS[id] }   ← CORE wins on field conflict   │   │
│  │  )  as Record<string, Plugin>                                │   │
│  └─────────────────────────────┬────────────────────────────────┘   │
│                                │  single source of truth            │
├────────────────────────────────┼────────────────────────────────────┤
│  conflicts.ts                  │  i18n/plugins-en.ts                │
│  CONFLICT_PAIRS[]              │  pluginDescEn: Record<id,          │
│  REDUNDANCY_GROUPS[]           │    {desc, longDesc}>               │
│  getConflicts(ids)             │                                    │
│  getRedundancies(ids)          │  (Korean stays in plugins.ts;      │
│                                │   English overlay per-id)          │
├────────────────────────────────┴────────────────────────────────────┤
│                       LOGIC LAYER (lib/)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ scoring.ts   │  │ recommend.ts │  │ presets.ts   │              │
│  │ scorePlugins │  │ keyword match│  │ PRESET_PACKS │              │
│  │ buildComple- │  │ + AI mode    │  │              │              │
│  │ ments/Replac │  └──────────────┘  └──────────────┘              │
│  └──────────────┘                                                   │
├─────────────────────────────────────────────────────────────────────┤
│                   UI LAYER (app/ + components/)                     │
│  /advisor   /optimizer   /plugins   /plugins/[id]   /guides         │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Key Constraint |
|-----------|----------------|----------------|
| `CORE_PLUGINS` | Semantic data: id, name, tag, color, category, desc, longDesc, url, githubRepo, install[], features[], conflicts[], keywords[] | `PluginSeed` type — operational fields (`type`, `verificationStatus`, etc.) are excluded by `Omit` |
| `PLUGIN_FIELD_OVERRIDES` | Operational overrides applied per id: verificationStatus, difficulty, installMode, requiredSecrets, bestFor, avoidFor, **type** | Sparse — only entries that deviate from `DEFAULT_PLUGIN_FIELDS`; `type:"plugin"` entries must appear here |
| `DEFAULT_PLUGIN_FIELDS` | Fallback for all operational fields including `type:"mcp"` | Applied first in merge order; provides `type:"mcp"` for every entry unless overridden |
| `PLUGINS` export | Merged view assembled at module load; single consumer interface | Merge order: DEFAULT → OVERRIDES → CORE (CORE wins on field collision) |
| `conflicts.ts` | Explicit conflict pairs and redundancy groups for /optimizer warning UI | Maintained separately from per-plugin `conflicts[]` array; both mechanisms coexist |
| `i18n/plugins-en.ts` | English `desc` and `longDesc` per plugin id | Only `desc` + `longDesc`; name/tag/keywords/install are language-neutral |
| `scoring.ts` | `scorePlugins()`: computes score, complements, replacements, coverage | Reads only `PLUGINS` + `getConflicts()` + `getRedundancies()`; no structural coupling to DB size |
| `lib/__tests__/plugins.test.ts` | Type distribution assertions, translation coverage, minimum count floor | Hard-codes `PLUGIN_TYPE_IDS` list (9 items) and minimum entry count (42) — both become stale after new entries |

---

## Recommended Project Structure

```
lib/
├── plugins.ts              # MODIFIED — CORE_PLUGINS blocks + PLUGIN_FIELD_OVERRIDES blocks
├── conflicts.ts            # CONDITIONALLY MODIFIED — new CONFLICT_PAIRS / REDUNDANCY_GROUPS
├── i18n/
│   └── plugins-en.ts       # MODIFIED — pluginDescEn entry for every new id
├── types.ts                # CONDITIONALLY MODIFIED — PluginCategory union if new category needed
├── scoring.ts              # UNCHANGED — data-driven, no structural changes
├── recommend.ts            # UNCHANGED — keyword matching iterates PLUGINS automatically
└── __tests__/
    └── plugins.test.ts     # MODIFIED — PLUGIN_TYPE_IDS list + count floor
```

### Structure Rationale

- **`plugins.ts` is the only always-required file for DB entries.** The three-layer merge means adding an entry requires one `CORE_PLUGINS` block and optionally one `PLUGIN_FIELD_OVERRIDES` block. No logic files need editing for new data alone.
- **`plugins-en.ts` is co-required for every entry.** The UI falls back silently to Korean if an id is missing from `pluginDescEn` — no error is thrown. Missing translations are invisible in development and only surface for English-language users.
- **`conflicts.ts` is conditionally required.** Needed only when a new entry conflicts with an existing entry. Not all new entries will have conflicts.
- **`types.ts` requires review.** The `PluginCategory` union has exactly 10 members. If any new entry uses a category string not in the union, TypeScript will reject the CORE_PLUGINS entry at compile time.
- **`plugins.test.ts` requires targeted updates.** The test file hard-codes both `PLUGIN_TYPE_IDS` (9 ids) and a minimum count floor (42). After adding new Plugin-type entries and raising the total, both become incorrect and will cause test failures.

---

## Architectural Patterns

### Pattern 1: Three-Layer Merge for Plugin Records

**What:** Each `Plugin` record is assembled at module load from three sources in fixed priority order: `DEFAULT_PLUGIN_FIELDS` (lowest) → `PLUGIN_FIELD_OVERRIDES[id]` (middle) → `CORE_PLUGINS[id]` (highest, wins on field collision).

**When to use:** Always. This is the established pattern for all 51 existing entries without exception.

**Trade-offs:** Clean separation between semantic identity (CORE) and operational status (OVERRIDES). A reader must check both objects to understand the full record. For new entries, the split is mechanical — put display/behavioral data in CORE, put verification/difficulty/type in OVERRIDES.

**Adding a new MCP entry:**
```typescript
// In CORE_PLUGINS — semantic data only, no operational fields:
"new-mcp": {
  id: "new-mcp",
  name: "New MCP",
  tag: "NMCP",
  color: "#HEXVAL",
  category: "integration",       // must be an existing PluginCategory value
  githubRepo: "owner/repo",
  desc: "한국어 설명.",
  longDesc: "상세 한국어 설명.",
  url: "https://github.com/owner/repo",
  install: ["claude mcp add new-mcp -- npx -y new-mcp-package"],
  features: ["feature 1", "feature 2"],
  conflicts: [],                 // ids of conflicting plugins (string[])
  keywords: ["keyword1", "keyword2"],
},

// In PLUGIN_FIELD_OVERRIDES — only fields deviating from defaults:
"new-mcp": {
  verificationStatus: "verified",
  difficulty: "beginner",
  installMode: "external-setup",
  requiredSecrets: ["NEW_MCP_API_KEY"],
  bestFor: ["use case A"],
  avoidFor: ["anti use case"],
  // type:"mcp" is the DEFAULT — omit entirely for MCP entries
},

// In pluginDescEn (plugins-en.ts) — English overlay:
"new-mcp": {
  desc: "English description.",
  longDesc: "English long description.",
},
```

**Adding a new Plugin-type entry:**
```typescript
// CORE_PLUGINS block is identical in structure to MCP entries.
// The only difference is PLUGIN_FIELD_OVERRIDES must declare type:
"new-plugin": {
  // ... same CORE_PLUGINS structure as MCP ...
},

// In PLUGIN_FIELD_OVERRIDES — type override is the only mandatory addition:
"new-plugin": {
  verificationStatus: "verified",
  type: "plugin" as const,   // required — overrides DEFAULT "mcp"
},
```

### Pattern 2: Conflicts — Dual Mechanism

**What:** Conflict data lives in two places simultaneously, serving different surfaces.

1. `CORE_PLUGINS[id].conflicts: string[]` — per-entry list consumed by `recommend.ts` to exclude conflicting plugins from /advisor recommendations.
2. `CONFLICT_PAIRS` in `conflicts.ts` — explicit pairs with Korean warning messages consumed by `scoring.ts`/`getConflicts()` for the /optimizer warning UI.

**When to use:** Any new entry that conflicts with an existing entry must update both mechanisms. If a new entry conflicts with `playwright`, add `"playwright"` to the new entry's `conflicts[]` array AND add a `ConflictPair` entry in `conflicts.ts`. Also update the existing `playwright` entry's `conflicts[]` array to maintain symmetry.

**Synchronization rule:** `conflicts[]` arrays must be symmetric (if A lists B, B must list A). The `CONFLICT_PAIRS` mechanism is already symmetric by definition (it checks both directions).

### Pattern 3: Category-Driven Complement Scoring

**What:** `buildComplements()` in `scoring.ts` scans `Object.values(PLUGINS)` for the best-ranked uninstalled plugin per uncovered category. Ranking uses `rankForComplement()`: verified +4, partial +1, unverified -4; beginner +3, advanced -2; stale -3.

**Implication for new entries:** New entries with `verificationStatus: "verified"` and `difficulty: "beginner"` will rank highest as complement suggestions. If a category currently has zero verified entries, adding the first verified one will immediately surface it as the top complement for all optimizer users missing that category. This is the intended behavior — high-quality new entries should be discoverable through the optimizer.

**No code change required in `scoring.ts`.** The function scans `PLUGINS` dynamically and automatically includes any new entries after the module loads.

---

## Data Flow

### New Entry — Integration Path

```
Developer adds entry to CORE_PLUGINS (plugins.ts)
    ↓
Optionally adds override to PLUGIN_FIELD_OVERRIDES
    (required if: type="plugin" OR non-default operational fields)
    ↓
Adds translation to pluginDescEn (plugins-en.ts)
    ↓
PLUGINS export automatically includes new entry via Object.fromEntries merge
    ↓
    ├── /plugins page: entry appears in MCP or Plugin tab (by type)
    ├── /plugins/[id]: detail page renders from PLUGINS[id]
    ├── /optimizer autocomplete: entry searchable by name/id
    ├── scoring.ts buildComplements: entry eligible as complement suggestion
    ├── scoring.ts buildReplacements: entry eligible as verified alternative
    └── recommend.ts: entry keywords match against user project text
```

### Type Assignment Flow

```
DEFAULT_PLUGIN_FIELDS  →  type: "mcp"  (base for ALL entries)
    ↓
PLUGIN_FIELD_OVERRIDES[id].type = "plugin"  (overrides for 9 current Plugin entries)
    ↓
PLUGINS[id].type  =  "mcp" | "plugin"
    ↓
    ├── /plugins tabs:          MCP tab vs Plugin tab filter
    ├── /optimizer typeScope:   filters complement/replacement suggestions
    └── Autocomplete badge:     "MCP" or "Plugin" label display
```

### Scoring Engine — No Structural Changes Required

`scorePlugins()` is fully data-driven against the `PLUGINS` record:

- `buildCoverage()` iterates `ids` and looks up `PLUGINS[id].category` — works for any new id
- `buildComplements()` scans `Object.values(PLUGINS)` for candidates — automatically includes new entries
- `buildReplacements()` scans `Object.values(PLUGINS)` for alternatives — automatically includes new entries
- `getConflicts()` checks `CONFLICT_PAIRS` — only needs update if new entry has explicit conflicts

Adding 10-15 entries changes the candidate pool size for complement/replacement selection but requires zero code changes in `scoring.ts`.

---

## Integration Points — New vs Modified Files

### Files That Must Change (every new entry)

| Step | File | Change Required |
|------|------|-----------------|
| 1 | `lib/plugins.ts` | Add block to `CORE_PLUGINS`; add block to `PLUGIN_FIELD_OVERRIDES` if operational fields deviate from defaults |
| 2 | `lib/i18n/plugins-en.ts` | Add `pluginDescEn[id]` with English `desc` and `longDesc` |
| 3 | `lib/__tests__/plugins.test.ts` | Update `PLUGIN_TYPE_IDS` for any new Plugin-type entries; raise the minimum count floor from 42 |

### Files That Change Conditionally

| File | Condition | Change |
|------|-----------|--------|
| `lib/types.ts` | New entry uses a `category` value not in the existing 10-member `PluginCategory` union | Add the new literal to the union |
| `lib/conflicts.ts` | New entry conflicts with an existing entry | Add `ConflictPair` entry; optionally add `RedundancyGroup` if the new entry is functionally redundant with existing entries |
| `CORE_PLUGINS[existing_id].conflicts[]` | New entry conflicts with an existing entry | Add new entry id to the existing entry's `conflicts[]` array to maintain symmetry |

### Files That Do Not Change

| File | Reason |
|------|--------|
| `lib/scoring.ts` | Data-driven; automatically handles any entries present in `PLUGINS` |
| `lib/recommend.ts` | Keyword matching iterates `Object.values(PLUGINS)` — new entries participate automatically |
| `lib/conflicts.ts` (REDUNDANCY_GROUPS) | Existing redundancy groups remain valid; add new groups only if new entries introduce new redundancy relationships |
| All UI pages and components | Consume `PLUGINS` export; new entries appear automatically without UI code changes |

### Internal Boundaries

| Boundary | Communication | Key Note |
|----------|---------------|----------|
| `plugins.ts` → `scoring.ts` | `PLUGINS` export (Record<string, Plugin>) | scoring.ts is a pure consumer — no write-back |
| `plugins.ts` → `recommend.ts` | `PLUGINS` export | Keyword matching iterates all entries automatically |
| `plugins.ts` → `conflicts.ts` | None — independent modules | `conflicts[]` arrays in CORE_PLUGINS and `CONFLICT_PAIRS` in conflicts.ts must be manually kept in sync |
| `plugins.ts` → UI pages | `PLUGINS` export (static import at build time) | Pages render whatever PLUGINS contains — no separate registration step |
| `plugins-en.ts` → UI pages | `pluginDescEn` (static import) | Missing ids silently fall back to Korean strings — no runtime error |

---

## Build Order (Dependency Graph)

Work in this order to keep TypeScript clean at each step and catch errors early.

```
Step 1 — lib/types.ts  (conditional)
  IF new entries need a new PluginCategory value:
    Add the literal to the union
  Verification: pnpm typecheck

Step 2 — lib/plugins.ts
  For each new entry:
    Add CORE_PLUGINS block (semantic data)
    Add PLUGIN_FIELD_OVERRIDES block (if type="plugin" or non-default fields)
  Verification: pnpm typecheck, pnpm build

Step 3 — lib/conflicts.ts  (conditional)
  IF new entries conflict with existing entries:
    Add ConflictPair entries (with Korean msg)
    Add RedundancyGroup entries if applicable
    Update existing entries' conflicts[] arrays in CORE_PLUGINS for symmetry
  Verification: pnpm test (scoring + parser tests)

Step 4 — lib/i18n/plugins-en.ts
  Add pluginDescEn[id] for every new entry (both MCP and Plugin type)
  Verification: pnpm typecheck

Step 5 — lib/__tests__/plugins.test.ts
  Update PLUGIN_TYPE_IDS to include new Plugin-type entry ids
  Raise the minimum count floor (currently 42) to 51 + number of new entries
  Verification: pnpm test (all tests pass including new count assertions)

Step 6 — Final verification
  pnpm typecheck && pnpm lint && pnpm build && pnpm test
```

---

## Constraints That Bound New Entries

| Constraint | Rule | Consequence of Violation |
|------------|------|--------------------------|
| `PluginCategory` union | `category` value must be one of the 10 defined literals | TypeScript compile error in CORE_PLUGINS |
| `ItemType` union | `type` value must be `"mcp"` or `"plugin"` | TypeScript compile error in PLUGIN_FIELD_OVERRIDES |
| `PluginSeed` type | CORE_PLUGINS entries must NOT include operational fields (verificationStatus, type, etc.) | TypeScript compile error — these are excluded by Omit |
| `id` uniqueness | No duplicate keys in CORE_PLUGINS | Silent override — second entry silently wins, first entry is lost |
| `conflicts[]` symmetry | If A conflicts B, B should list A | recommend.ts exclusion is directional only; conflicts appear for one direction but not both |
| `plugins.test.ts` count floor | Currently set at 42; must be updated | Test failure: "PLUGINS object has at least 42 entries" passes but "at least N" test for new count fails |
| `PLUGIN_TYPE_IDS` list | Must list all Plugin-type entry ids | Missing ids cause "every plugin-type entry has English translation" test to silently skip the new entry |

---

## Anti-Patterns

### Anti-Pattern 1: Adding `type: "plugin"` Inside CORE_PLUGINS

**What people do:** Include `type: "plugin"` directly in the CORE_PLUGINS entry instead of PLUGIN_FIELD_OVERRIDES.

**Why it's wrong:** `PluginSeed` is `Omit<Plugin, keyof PluginOperationalFields>` and `type` is in `PluginOperationalFields`. TypeScript rejects this with a compile error. The separation exists precisely so operational status can change without touching semantic data.

**Do this instead:** Always put `type: "plugin" as const` in `PLUGIN_FIELD_OVERRIDES[id]`.

### Anti-Pattern 2: Skipping `plugins-en.ts` for MCP Entries

**What people do:** Add translations only for Plugin-type entries, assuming MCP entries "don't need" English because MCP is the majority type.

**Why it's wrong:** `pluginDescEn` covers all 51 existing entries — every MCP entry has an English translation. A missing entry silently falls back to Korean with no error thrown. This failure mode is invisible during Korean-UI development and only surfaces for English-language users.

**Do this instead:** Treat `plugins-en.ts` as a co-required change alongside `plugins.ts` for every new entry regardless of type.

### Anti-Pattern 3: Updating `conflicts[]` Without `CONFLICT_PAIRS`

**What people do:** Add a conflicting plugin id to the new entry's `conflicts[]` array but skip adding a `ConflictPair` to `conflicts.ts`.

**Why it's wrong:** The `conflicts[]` array is consumed by `recommend.ts` for the /advisor recommendation exclusion. `getConflicts()` in `conflicts.ts` is consumed by `scoring.ts` for the /optimizer warning UI. A conflict in `conflicts[]` but absent from `CONFLICT_PAIRS` will silently skip the optimizer warning.

**Do this instead:** For any conflict relationship, update `conflicts[]` arrays in both entries AND add a `ConflictPair` with a Korean `msg` in `conflicts.ts`.

### Anti-Pattern 4: Forgetting to Update `PLUGIN_TYPE_IDS` in Tests

**What people do:** Add a new Plugin-type entry and update `PLUGIN_FIELD_OVERRIDES` with `type: "plugin"` but don't update `PLUGIN_TYPE_IDS` in `plugins.test.ts`.

**Why it's wrong:** The test `"every plugin-type entry has English translation in pluginDescEn"` only checks ids that are in `PLUGIN_TYPE_IDS`. A new Plugin-type entry not in this list will never be checked for translation coverage — the missing translation won't be caught until an English-language user reports it.

**Do this instead:** Update `PLUGIN_TYPE_IDS` as part of the same commit that adds any new Plugin-type entry.

### Anti-Pattern 5: Adding New Categories Without Measuring Impact

**What people do:** Introduce a new `PluginCategory` value for a new entry without checking how `ALL_CATEGORIES` in `scoring.ts` affects uncovered-category penalty calculations.

**Why it's wrong:** `scoring.ts` hard-codes `ALL_CATEGORIES` (the same 10 members as the `PluginCategory` union). `buildCoverage()` treats every category in `ALL_CATEGORIES` as a coverage target. Adding an 11th category to `types.ts` without adding it to `ALL_CATEGORIES` means the new category is never penalized as uncovered — a silent logic gap. Adding it to both `types.ts` and `ALL_CATEGORIES` immediately increases the maximum possible uncovered-category penalty for all users.

**Do this instead:** Exhaust the existing 10 categories before adding new ones. The current category set (orchestration, workflow, code-quality, testing, documentation, data, security, integration, ui-ux, devops) is broad enough to classify any MCP or Plugin. Only introduce a new category if no existing category fits and you are prepared to update `ALL_CATEGORIES` in `scoring.ts` simultaneously.

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 51 → 65 entries (current milestone) | No structural changes needed. Pure data addition to existing files. |
| 65 → 150 entries | Consider splitting `CORE_PLUGINS` into per-category files (e.g., `plugins-workflow.ts`, `plugins-integration.ts`) that export partial records, merged in `plugins.ts`. The single-file approach becomes unwieldy above ~100 entries. |
| 150+ entries | Evaluate moving from a static JS object to JSON files with Zod schema validation. Enables non-developer contributions and a separate CI validation pipeline. Existing Supabase infrastructure already supports a DB-backed fallback. |

### Scaling Priorities

1. **First bottleneck:** `lib/plugins.ts` file length. Currently ~1,637 lines for 51 entries (~32 lines/entry average). At 150 entries the file approaches 4,800 lines. Split by category before reaching that scale.
2. **Second bottleneck:** `pluginDescEn` translation sync. Currently only Plugin-type entries are covered by the "has English translation" test. A test asserting `Object.keys(PLUGINS).every(id => pluginDescEn[id])` would catch any entry (MCP or Plugin) with a missing translation — currently this is not tested.

---

## Sources

- Direct inspection: `lib/plugins.ts` (1,637 lines, 51 entries, all three data structures)
- Direct inspection: `lib/types.ts` (Plugin type, PluginCategory union — 10 members, ItemType)
- Direct inspection: `lib/scoring.ts` (scorePlugins, buildComplements, buildReplacements, ALL_CATEGORIES)
- Direct inspection: `lib/conflicts.ts` (CONFLICT_PAIRS — 3 pairs, REDUNDANCY_GROUPS — 3 groups)
- Direct inspection: `lib/i18n/plugins-en.ts` (pluginDescEn structure and coverage)
- Direct inspection: `lib/__tests__/plugins.test.ts` (PLUGIN_TYPE_IDS — 9 ids, count floor — 42)
- Direct inspection: `.planning/PROJECT.md` (v1.3 milestone scope and key architectural decisions)
- Confidence: HIGH — all integration surfaces read from source; no training-data inference

---
*Architecture research for: Plugin Advisor v1.3 — DB extension (51 → 60-65 entries)*
*Researched: 2026-03-18*
