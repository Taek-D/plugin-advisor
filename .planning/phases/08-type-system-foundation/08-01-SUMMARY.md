---
phase: 08-type-system-foundation
plan: 01
subsystem: type-system
tags: [types, plugin-model, mcp, foundation]
dependency_graph:
  requires: []
  provides: [ItemType, Plugin.type, DEFAULT_PLUGIN_FIELDS.type]
  affects: [lib/types.ts, lib/plugins.ts, lib/parse-mcp-list.ts, app/api/admin/plugins/route.ts]
tech_stack:
  added: []
  patterns: [PluginOperationalFields-default-injection, string-literal-union]
key_files:
  created:
    - lib/__tests__/plugins.test.ts
  modified:
    - lib/types.ts
    - lib/plugins.ts
    - lib/parse-mcp-list.ts
    - lib/__tests__/parse-mcp-list.test.ts
    - app/api/admin/plugins/route.ts
decisions:
  - "ItemType named 'ItemType' not 'PluginType' to avoid confusion with the Plugin type itself"
  - "type field added to PluginOperationalFields so DEFAULT_PLUGIN_FIELDS spreads it into all 42 PLUGINS entries without touching seed objects"
  - "admin/plugins/route.ts Plugin literal hardcoded to type: 'mcp' (admin-created entries are MCP tools)"
metrics:
  duration_minutes: 12
  completed_date: "2026-03-18"
  tasks_completed: 2
  files_modified: 5
  files_created: 1
---

# Phase 8 Plan 1: Type System Foundation Summary

**One-liner:** Added `ItemType = "mcp" | "plugin"` union and required `type: ItemType` field to Plugin via DEFAULT_PLUGIN_FIELDS injection — all 42 entries automatically typed as `'mcp'` without seed changes.

## What Was Built

Foundation type field for the v1.2 MCP + Plugin separation. Phase 9–12 all depend on `Plugin.type` existing.

### Key Changes

**lib/types.ts**
- Added `export type ItemType = "mcp" | "plugin";` after `MaintenanceStatus`
- Added `type: ItemType;` as the last field of the `Plugin` type

**lib/plugins.ts**
- Added `| "type"` to `PluginOperationalFields` Pick union
- Added `type: "mcp"` to `DEFAULT_PLUGIN_FIELDS`
- Result: all 42 `PLUGINS` entries automatically receive `type: 'mcp'` via the `...DEFAULT_PLUGIN_FIELDS` spread — zero seed object changes required

**lib/parse-mcp-list.ts**
- Added `type: "mcp" as const` to the pseudoPlugins factory object literal

**lib/__tests__/plugins.test.ts** (new)
- 4 tests: type field defined, valid ItemType value, all entries are `'mcp'`, at least 42 entries

**lib/__tests__/parse-mcp-list.test.ts**
- Added `type: "mcp"` to all 4 mock Plugin objects (context7, brave-search, github, playwright)

**app/api/admin/plugins/route.ts**
- Added `type: "mcp"` to the Plugin literal constructed from admin POST body

## Verification

- `pnpm typecheck`: zero errors
- `pnpm test`: 115/115 tests pass (104 existing + 4 new plugins.test.ts + existing parse-mcp-list updated)
- `pnpm build`: succeeds
- CORE_PLUGINS section (lines 402–1613 of plugins.ts): zero modifications

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 (TDD RED+GREEN) | 7610574 | feat(08-01): add ItemType union and type field to Plugin type system |
| Task 2 | c542e47 | feat(08-01): add type field to parseMcpList factory and fix mock data |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing field] app/api/admin/plugins/route.ts Plugin literal missing type field**
- **Found during:** Task 2 (typecheck after adding required type to Plugin)
- **Issue:** Admin route constructs a `Plugin` literal directly — after `type` became required, this broke typecheck
- **Fix:** Added `type: "mcp"` to the literal (admin-created entries are MCP tools)
- **Files modified:** app/api/admin/plugins/route.ts
- **Commit:** c542e47

## Self-Check

All files verified:
- `lib/types.ts` — ItemType exported, Plugin.type field present
- `lib/plugins.ts` — PluginOperationalFields includes "type", DEFAULT_PLUGIN_FIELDS has type: "mcp"
- `lib/parse-mcp-list.ts` — pseudoPlugins factory includes type: "mcp" as const
- `lib/__tests__/plugins.test.ts` — created, 4 tests
- `lib/__tests__/parse-mcp-list.test.ts` — 4 mockPlugins each have type: "mcp"
- `app/api/admin/plugins/route.ts` — Plugin literal has type: "mcp"

Commits 7610574 and c542e47 verified in git log.

## Self-Check: PASSED
